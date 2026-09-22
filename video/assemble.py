"""Cut the dead air, then build the audio against the shortened timeline.

    python video/assemble.py

The recorder logged the wall-clock moment every beat began. A beat is allowed
its line plus a little slack; the tail beyond that, where the screen has
already settled and the line is already over, is cut. Nothing is ever sped up:
a step that genuinely took twelve seconds still looks like twelve seconds.

Then the narration is rebuilt against the new positions, because a timing
computed before a cut is wrong after it. Writes build/master.mp4 and
build/cuts.json, which records where each beat really landed so the subtitler
can use video positions rather than planned ones.
"""
import json
import pathlib
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from beats import BEATS, CEILING  # noqa: E402

BUILD = pathlib.Path(__file__).parent / "build"
AUDIO = BUILD / "audio"
SEG = BUILD / "seg"
GAP_CAP = 0.85        # most settle time kept after a line ends
# Screen content, not film: large flat areas and hard edges. The default
# deblocking softens type, which is the whole picture here.
def encoder(width):
    """Screen content, not film: large flat areas and hard edges. The default
    deblocking softens type, which is the whole picture here. 4K uses a faster
    preset because slow at this frame size costs an hour for no visible gain."""
    preset = "medium" if width > 2000 else "slow"
    return ["-c:v", "libx264", "-crf", "16", "-preset", preset, "-tune", "stillimage",
            "-pix_fmt", "yuv420p", "-an"]


def run(args):
    subprocess.run(args, check=True, capture_output=True)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def main():
    raw = BUILD / "raw.webm"
    timeline = json.loads((BUILD / "timeline.json").read_text(encoding="utf-8"))
    raw_len = probe(raw)
    width = int(subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width", "-of", "default=nw=1:nk=1", str(raw)],
        capture_output=True, text=True, check=True).stdout.split()[0])
    ENC = encoder(width)
    print("source is %dpx wide, preset %s" % (width, ENC[5]))

    # Work out what to keep. Each beat keeps its line plus slack, plus a capped
    # amount of the composition that follows it.
    keeps, biggest = [], (0.0, "")
    for i, t in enumerate(timeline):
        start = t["at"]
        nxt = timeline[i + 1]["at"] if i + 1 < len(timeline) else raw_len
        gap = max(0.0, nxt - (start + t["dur"]))
        # Keep the line, plus a little of the composition that follows it, and
        # cut the rest of the tail. The cap is the slack; adding more on top of
        # it inflates the cut instead of trimming it.
        end = min(start + t["dur"] + min(gap, GAP_CAP), nxt if i + 1 < len(timeline) else raw_len)
        cut = max(0.0, nxt - end)
        if cut > biggest[0]:
            biggest = (cut, t["id"])
        keeps.append({"id": t["id"], "src": start, "end": end, "dur_line": t["dur"]})

    print("largest single stall cut: %.1fs after %s" % biggest)

    # Cut the segments, then join them with the concat demuxer.
    if SEG.exists():
        for f in SEG.iterdir():
            f.unlink()
    SEG.mkdir(parents=True, exist_ok=True)
    parts, at, cuts = [], 0.0, []
    for i, k in enumerate(keeps):
        out = SEG / ("%02d.mp4" % i)
        run(["ffmpeg", "-y", "-ss", "%.3f" % k["src"], "-t", "%.3f" % (k["end"] - k["src"]),
             "-i", str(raw), *ENC, str(out)])
        d = probe(out)
        cuts.append({"id": k["id"], "at": round(at, 3), "dur": k["dur_line"], "seg": round(d, 3)})
        at += d
        parts.append(out)

    listing = SEG / "list.txt"
    listing.write_text("".join("file '%s'\n" % p.name for p in parts), encoding="utf-8")
    silent = BUILD / "silent.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
         "-c", "copy", str(silent)])
    vid_len = probe(silent)

    # Build the audio against where the beats actually landed after the cut.
    a_parts, a_list, cursor = [], [], 0.0
    for i, c in enumerate(cuts):
        gap = c["at"] - cursor
        if gap > 0.01:
            sil = SEG / ("sil%02d.mp3" % i)
            run(["ffmpeg", "-y", "-f", "lavfi", "-t", "%.3f" % gap,
                 "-i", "anullsrc=r=24000:cl=mono", "-q:a", "4", str(sil)])
            a_parts.append(sil)
        a_parts.append(AUDIO / ("%s.mp3" % c["id"]))
        cursor = c["at"] + c["dur"]
    for p in a_parts:
        a_list.append("file '%s'\n" % p.resolve().as_posix())
    alist = SEG / "alist.txt"
    alist.write_text("".join(a_list), encoding="utf-8")
    voice = BUILD / "voice.mp3"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(alist),
         "-c", "copy", str(voice)])

    master = BUILD / "master.mp4"
    run(["ffmpeg", "-y", "-i", str(silent), "-i", str(voice),
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(master)])

    (BUILD / "cuts.json").write_text(json.dumps(cuts, indent=2), encoding="utf-8")
    final = probe(master)
    print("raw %.1fs -> master %.1fs (video %.1fs, voice %.1fs)"
          % (raw_len, final, vid_len, probe(voice)))
    if final > CEILING:
        print("OVER THE CEILING. Cut words or slack.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
