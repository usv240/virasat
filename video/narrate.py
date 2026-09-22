"""One Polly clip per beat, and the real duration of each.

    python video/narrate.py

Writes build/audio/<id>.mp3 and build/narration.json. Run before recording:
the recorder times every cursor move against these real lengths, so it can
point at the thing while the sentence describing it is being spoken.
"""
import json
import pathlib
import subprocess
import sys
import xml.sax.saxutils as esc

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from beats import BEATS, CEILING, ENGINE, RATE, VOICE, sentences  # noqa: E402

BUILD = pathlib.Path(__file__).parent / "build"
AUDIO = BUILD / "audio"


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def synth(text, out):
    ssml = f'<speak><prosody rate="{RATE}">{esc.escape(text)}</prosody></speak>'
    subprocess.run(
        ["aws", "polly", "synthesize-speech",
         "--engine", ENGINE, "--voice-id", VOICE,
         "--text-type", "ssml", "--text", ssml,
         "--output-format", "mp3", str(out)],
        check=True, capture_output=True)


def main():
    AUDIO.mkdir(parents=True, exist_ok=True)
    meta = []
    total = 0.0
    for b in BEATS:
        out = AUDIO / f"{b['id']}.mp3"
        synth(b["say"], out)
        d = duration(out)
        # Per-sentence lengths, split by speaking time in proportion to length.
        sents = sentences(b["say"])
        chars = sum(len(s) for s in sents) or 1
        offs, acc = [], 0.0
        for s in sents:
            share = d * len(s) / chars
            offs.append({"text": s, "start": round(acc, 3), "dur": round(share, 3)})
            acc += share
        total += b["pause"] + d
        meta.append({"id": b["id"], "pause": b["pause"], "dur": round(d, 3),
                     "say": b["say"], "sentences": offs})
        print(f"{b['id']:10s} {d:6.2f}s  ({len(sents)} sentences)")

    BUILD.mkdir(exist_ok=True)
    (BUILD / "narration.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"\nspeech plus pauses: {total:.1f}s, ceiling {CEILING:.0f}s")
    if total > CEILING:
        print("OVER THE CEILING before a frame is recorded. Cut words.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
