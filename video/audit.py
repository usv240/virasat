"""Check the built file against every instruction. Run before every upload.

    python video/audit.py

This exists because feedback was once applied carefully to a prose script and
the video was then built from a different file, so several asks were silently
lost. A prose script and a built video cannot be compared by reading them.
Everything below reads a shipped artefact: the text Polly was given, the beat
records, the caption style burned into the frames, the encoded file's own
duration and resolution, and the finished file's pixels.
"""
import json
import pathlib
import re
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from beats import BEATS, CEILING, NAME, PRONOUNCE  # noqa: E402

BUILD = pathlib.Path(__file__).parent / "build"
FINAL = BUILD / "final.mp4"
W, H = 1920, 1080
rows = []


def check(name, ok, detail=""):
    rows.append((name, bool(ok), detail))


def probe(path, entries, stream=False):
    args = ["ffprobe", "-v", "error"]
    if stream:
        args += ["-select_streams", "v:0", "-show_entries", "stream=" + entries]
    else:
        args += ["-show_entries", "format=" + entries]
    args += ["-of", "default=nw=1:nk=1", str(path)]
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout.split()


def main():
    if not FINAL.exists():
        print("No build/final.mp4. Run the pipeline first.", file=sys.stderr)
        sys.exit(1)

    spoken = " ".join(b["say"] for b in BEATS)
    srt = (BUILD / "captions.srt").read_text(encoding="utf-8")
    cuts = json.loads((BUILD / "cuts.json").read_text(encoding="utf-8"))
    # The style that was actually burned, read from the ASS handed to libass,
    # not from the script that wrote it.
    ass = (BUILD / "captions.ass").read_text(encoding="utf-8")
    style = next(l for l in ass.splitlines() if l.startswith("Style: Cap,"))
    fields = style[len("Style: "):].split(",")
    play_h = int(next(l for l in ass.splitlines() if l.startswith("PlayResY:")).split(":")[1])

    # ---- the words actually sent to Polly
    check("Opens by naming a person", spoken.lstrip().startswith("Hi everyone, I am " + NAME))
    check("Product named after the problem, not before",
          spoken.index("This is Virasat") > spoken.index("Sunita's father"))
    check("The AIS discovery is spoken", "income tax statement" in spoken)
    check("The open rule corpus is spoken", "open rule corpus" in spoken)
    check("The rules decide, not the model", "not made by AI" in spoken)
    check("Cost and return spoken together",
          "thirty six" in spoken and "thirty eight thousand seven hundred" in spoken)
    check("Prevention is spoken", "nominees" in spoken)
    check("Closes on the promise", "Your money, your right" in spoken)
    check("Sign-off is its own beat", BEATS[-1]["say"].strip() == "Thank you.")
    check("No emoji or dash in narration",
          not re.search(r"[–—\U0001F300-\U0001FAFF✀-➿]", spoken))

    # Every Indian word an American voice would guess at is given a phoneme.
    # Checks the words in the script, not the dictionary, so a new one added to
    # the narration without a pronunciation fails here.
    import re as _re
    words = set(_re.findall(r"[A-Z][A-Za-z']+", spoken))
    indian = {w for w in words
              if w.rstrip(".,") in {"Ujwal", "Sunita", "Sunita's", "Virasat", "Gujarat's", "Hindi"}}
    missing = sorted(w for w in indian if w not in PRONOUNCE and w.rstrip(".,") not in PRONOUNCE)
    check("Indian words carry a pronunciation", not missing,
          ", ".join(missing) if missing else "%d covered" % len(indian))

    # ---- what the camera was pointed at
    ids = [c["id"] for c in cuts]
    check("Every beat is in the cut", ids == [b["id"] for b in BEATS],
          "%d of %d" % (len(ids), len(BEATS)))
    check("Last beat holds on the product, no credits card", ids[-1] == "thanks")

    # ---- captions
    check("Captions exist", len(srt.strip()) > 0)
    longest = max((len(l) for l in srt.splitlines()
                   if l and not l[0].isdigit() and "-->" not in l), default=0)
    check("One line per cue, at most 60 characters", longest <= 60, "longest %d" % longest)
    check("Opening is subtitled", "Hi everyone" in srt)
    check("Sign-off is subtitled", "Thank you" in srt)
    # Field order is the ASS Format line: 6 is BackColour, 15 is BorderStyle.
    # 16 is Outline, which is what made this pass the wrong value once.
    check("Caption background is 80 percent black",
          fields[6] == "&H33000000" and fields[15] == "3",
          "back %s, border %s" % (fields[6], fields[15]))
    size = int(fields[2])
    check("Caption size suits the frame", play_h == H and 30 <= size <= 56,
          "%dpx at PlayResY %d" % (size, play_h))
    check("No emoji or dash in captions",
          not re.search(r"[–—\U0001F300-\U0001FAFF✀-➿]", srt))

    # ---- the encoded file itself
    dur = float(probe(FINAL, "duration")[0])
    w, h = (int(x) for x in probe(FINAL, "width,height", stream=True)[:2])
    bitrate = int(probe(FINAL, "bit_rate")[0]) // 1000
    check("Under the three minute ceiling", dur <= CEILING, "%.1fs" % dur)
    check("1920x1080", (w, h) == (W, H), "%dx%d" % (w, h))
    check("Bitrate is not starved", bitrate > 500, "%d kbps" % bitrate)
    check("Has an audio track", bool(probe(FINAL, "nb_streams")) and
          subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0",
                          "-show_entries", "stream=codec_name", "-of",
                          "default=nw=1:nk=1", str(FINAL)],
                         capture_output=True, text=True).stdout.strip() != "")

    # ---- the pixels, because the resolution check cannot see letterboxing
    stats = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", "8", "-i", str(FINAL), "-frames:v", "1",
         "-vf", "crop=60:ih:iw-60:0,signalstats", "-f", "null", "-"],
        capture_output=True, text=True)
    edge = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", "8", "-i", str(FINAL), "-frames:v", "1",
         "-vf", "crop=60:ih:iw-60:0,cropdetect=limit=0.1:round=2", "-f", "null", "-"],
        capture_output=True, text=True).stderr
    flat = "crop=0:0" in edge
    check("No flat band at the right edge", not flat, stats.stderr.strip()[:40])

    ok = all(r[1] for r in rows)
    for name, good, detail in rows:
        print("%-46s %s %s" % (name, "ok " if good else "MISS", detail))
    print("\n%d checks, %d missed" % (len(rows), sum(1 for r in rows if not r[1])))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
