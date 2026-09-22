"""Cues from the finished cut, burned in, plus a .srt for the repository.

    python video/subtitle.py

Cues come from build/cuts.json, which records where each beat really landed
after the dead air was removed. Building them from the planned timecodes would
drift, because a line that ran long pushed everything after it.

One line per cue, never two: a second line is a second thing to find with your
eyes while something is happening on screen.
"""
import json
import pathlib
import shutil
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from beats import sentences  # noqa: E402

BUILD = pathlib.Path(__file__).parent / "build"
MAX = 58
# Written as ASS rather than burned through force_style, which ffmpeg accepts
# and then silently renders nothing. Declaring PlayRes as the real frame size
# also means FontSize is in actual pixels, instead of being scaled from the
# 288-line default and having to be guessed.
PLAY_W, PLAY_H = 1920, 1080
FONT_SIZE = 42
MARGIN_V = 54
# The alpha byte runs backwards: &HAABBGGRR, 00 opaque and FF transparent,
# so 0x33 is 80 percent opaque.
BACK = "&H33000000"

ASS_HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: %d
PlayResY: %d
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Arial,%d,&H00FFFFFF,&H00FFFFFF,&H00000000,%s,-1,0,0,0,100,100,0,0,3,6,0,2,80,80,%d,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" % (PLAY_W, PLAY_H, FONT_SIZE, BACK, MARGIN_V)


def split(line):
    """One line per cue. Break on a clause boundary, and only on whitespace
    if the sentence has no commas to give."""
    if len(line) <= MAX:
        return [line]
    for sep in (", ", " and ", " so ", " but ", " "):
        cut = line.rfind(sep, 0, MAX + len(sep))
        if cut > 20:
            head = line[:cut + (len(sep) if sep == ", " else 0)].strip()
            tail = line[cut + len(sep):].strip() if sep != ", " else line[cut + 2:].strip()
            return [head] + split(tail)
    return [line[:MAX]]


def ts(t):
    """SRT: HH:MM:SS,mmm"""
    h, rem = divmod(max(0.0, t), 3600)
    m, sec = divmod(rem, 60)
    return "%02d:%02d:%02d,%03d" % (h, m, int(sec), round((sec - int(sec)) * 1000))


def ats(t):
    """ASS: H:MM:SS.cc"""
    h, rem = divmod(max(0.0, t), 3600)
    m, sec = divmod(rem, 60)
    return "%d:%02d:%02d.%02d" % (h, m, int(sec), round((sec - int(sec)) * 100))


def main():
    cuts = json.loads((BUILD / "cuts.json").read_text(encoding="utf-8"))
    narration = {n["id"]: n for n in
                 json.loads((BUILD / "narration.json").read_text(encoding="utf-8"))}

    cues, n = [], 0
    for c in cuts:
        info = narration[c["id"]]
        for sent in info["sentences"]:
            # Share the sentence's speaking time between its cues in proportion
            # to their length. Every cue starts on a real sentence boundary, so
            # the error inside one is tenths of a second.
            lines = split(sent["text"])
            chars = sum(len(x) for x in lines) or 1
            at = c["at"] + sent["start"]
            for line in lines:
                share = sent["dur"] * len(line) / chars
                n += 1
                cues.append((n, at, at + share, line))
                at += share

    srt = "\n".join("%d\n%s --> %s\n%s\n" % (i, ts(a), ts(b), t) for i, a, b, t in cues)
    (BUILD / "captions.srt").write_text(srt, encoding="utf-8")

    events = "".join("Dialogue: 0,%s,%s,Cap,,0,0,0,,%s\n" % (ats(a), ats(b), t)
                     for _, a, b, t in cues)
    (BUILD / "captions.ass").write_text(ASS_HEAD + events, encoding="utf-8")

    # ffmpeg's subtitles filter parses its own argument string, so a Windows
    # path with a drive colon breaks the parse. Pass a bare filename.
    here = pathlib.Path.cwd()
    tmp = here / "_cc.ass"
    shutil.copy(BUILD / "captions.ass", tmp)
    out = BUILD / "final.mp4"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(BUILD / "master.mp4"),
             "-vf", "ass=_cc.ass",
             "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-tune", "stillimage",
             "-pix_fmt", "yuv420p", "-c:a", "copy", str(out)],
            check=True, capture_output=True)
    finally:
        tmp.unlink(missing_ok=True)

    longest = max(cues, key=lambda c: len(c[3]))
    print("%d cues, longest %d chars: %s" % (len(cues), len(longest[3]), longest[3]))
    print("wrote build/captions.srt, build/captions.ass and build/final.mp4")


if __name__ == "__main__":
    main()
