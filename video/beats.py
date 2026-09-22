"""The demo script as data. Every other script reads this one.

Run it alone to check the plan fits: it exits non-zero if the estimated
running time is already over the ceiling, before a single frame is recorded.

    python video/beats.py
"""
import re
import sys

CEILING = 180.0          # hard limit from the rules, in seconds
TARGET = 170.0           # aim here, the last ten seconds are insurance
RATE = "95%"             # SSML prosody rate
VOICE = "Patrick"
ENGINE = "long-form"
SITE = "https://virasat-indol.vercel.app"
NAME = "Ujwal"

# An American voice guesses at these and gets them wrong, so it is told how to
# say them. Virasat ends in the Hindi dental त, which an English ear hears as
# a soft th, so it is written as one: Polly has no dental stop to give. IPA, because Polly's own alphabet varies by language. The captions
# and every other script keep the plain spelling; only the audio sees these.
PRONOUNCE = {
    "Ujwal": "ˈʊdʒʋɑːl",
    "Sunita": "sʊˈniːtɑː",
    "Sunita's": "sʊˈniːtɑːz",
    "Virasat": "ʋɪˈrɑːsəθ",
    "Virasat.": "ʋɪˈrɑːsəθ",
    "Gujarat's": "gʊdʒˈrɑːts",
    "Hindi": "ˈhɪndiː",
    "Hindi.": "ˈhɪndiː",
}

# pause: seconds of silence before the line, for the screen to settle.
BEATS = [
    dict(id="hello", pause=0.0, say=f"Hi everyone, I am {NAME}."),
    dict(id="problem", pause=0.5, say=(
        "Sunita's father is no more. What he left her is a tin of old papers: a "
        "passbook, an insurance bond, a share certificate. The money is hers. The "
        "hard part is discovering where it is, and how to claim it.")),
    dict(id="name-it", pause=0.4, say=(
        "This is Virasat. Photograph the papers, and it finds the money, explains "
        "what to do in your language, and fills the forms.")),
    dict(id="find", pause=0.5, say=(
        "Virasat turns each paper into structured fields, every one with its own "
        "confidence. Three forgotten papers become three places where money is "
        "waiting.")),
    dict(id="ais", pause=0.5, say=(
        "But Virasat can find something more important: the account that was never "
        "in the tin. A legal heir can obtain the account holder's income tax "
        "statement. Virasat reads it for every bank and company that paid him, "
        "revealing accounts that never appeared in her papers. We are not just "
        "digitising what she found. We are helping her discover what was missing.")),
    dict(id="search", pause=0.5, say=(
        "Real records are messy. Names appear differently across institutions, so "
        "when the full name is too specific, a broader search finds it: three years "
        "of unpaid dividends.")),
    dict(id="route", pause=0.5, say=(
        "Three simple questions determine her route: nominee, legal heir, or court. "
        "That decision is not made by AI. It "
        "comes from an open rule corpus: each institution's claim process, written "
        "down, versioned and tested, with the rule id shown so the decision is "
        "traceable. Then the documents she needs, and where to get each one.")),
    dict(id="review", pause=0.5, say=(
        "Before Sunita acts, Virasat challenges its own guidance. One AI looks for "
        "problems, like this name mismatch. Another reviews it, and can "
        "only add caution, never override the rules. Sunita reads the reasoning "
        "herself.")),
    dict(id="pack", pause=0.5, say=(
        "Now everything becomes something she can use. One click creates her claim "
        "form, the checklist, and cover letters in English and Hindi. Virasat tracks "
        "it, and prepares the escalation if nobody replies in thirty days.")),
    dict(id="include", pause=0.5, say=(
        "And it is not built only for people comfortable with financial websites. The "
        "whole journey works in Hindi, and the guidance is read aloud for anyone who "
        "is not comfortable reading.")),
    dict(id="close", pause=0.6, say=(
        "The economics work. Serving one family costs about thirty six "
        "rupees of AI. The average returned at Gujarat's camps is thirty eight "
        "thousand seven hundred. And the Vault checks that today's accounts have "
        "nominees, so tomorrow's money does not become another family's search. Find "
        "what was forgotten. Claim what is yours. Virasat. Your money, your right.")),
    dict(id="thanks", pause=0.6, say="Thank you."),
]


def sentences(text):
    """Split into sentences. The recorder and the subtitler both use this, so
    the pointer and the caption can never disagree about which one is playing."""
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def estimate(text):
    """Rough speaking time. Polly long-form at 95 percent runs near 152 wpm."""
    return len(text.split()) / 152.0 * 60.0


def plan():
    total = 0.0
    rows = []
    for b in BEATS:
        d = estimate(b["say"])
        total += b["pause"] + d
        rows.append((b["id"], b["pause"], d, total))
    return rows, total


if __name__ == "__main__":
    rows, total = plan()
    for bid, pause, d, at in rows:
        print(f"{bid:10s} pause {pause:4.1f}  say {d:5.1f}  ends {at:6.1f}")
    words = sum(len(b["say"].split()) for b in BEATS)
    print(f"\n{len(BEATS)} beats, {words} words, estimated {total:.1f}s "
          f"(target {TARGET:.0f}, ceiling {CEILING:.0f})")
    if total > CEILING:
        print("OVER THE CEILING. Cut words before recording.", file=sys.stderr)
        sys.exit(1)
    if total > TARGET:
        print("Over target but under ceiling. Tight but allowed.", file=sys.stderr)
