"""Playwright drives the live site and films it.

    python video/record.py

Reads build/narration.json for the real length of every line, so each cursor
move happens while the sentence describing it is being spoken. Writes the raw
capture to build/raw.webm and the wall-clock moment every beat began to
build/timeline.json. The assembler builds the audio against those moments, so
the two tracks cannot drift.
"""
import json
import pathlib
import shutil
import sys
import time

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from beats import BEATS, SITE  # noqa: E402

HERE = pathlib.Path(__file__).parent
BUILD = HERE / "build"

# 4K is done by doubling the frame and zooming the page to match, not by asking
# for a bigger canvas: Playwright fits the viewport into whatever size you ask
# for and pads the remainder with flat grey. Zooming keeps the layout identical
# to 1080p, so every word stays the same size relative to the frame and the only
# thing that changes is how many pixels it is drawn with.
SCALE = 2 if "--4k" in sys.argv else 1
W, H = 1920 * SCALE, 1080 * SCALE
BAR = 38 * SCALE              # must match chrome.js, which is in CSS pixels
HEADER = 71 * SCALE           # the site's own sticky header
TOP = BAR + HEADER + 16 * SCALE   # where a panel's top should land

SCROLL_JS = """(y) => new Promise((done) => {
    const s = window.scrollY, d = y - s, N = 26;
    let i = 0;
    const step = () => {
        i += 1;
        const t = i / N, e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, s + d * e);
        if (i < N) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
})"""

CLEAR_JS = """() => {
    try {
        Object.keys(localStorage)
            .filter((k) => k.indexOf('virasat.') === 0 && k !== 'virasat.theme')
            .forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
}"""


class Ctx:
    """Lets an action wait for a sentence boundary inside its own line."""

    def __init__(self):
        self.t0 = 0.0
        self.sentences = []

    def on_sentence(self, n):
        if n < len(self.sentences):
            target = self.t0 + self.sentences[n]["start"]
            while time.time() < target:
                time.sleep(0.02)


def ease_scroll(page, y):
    """Never jump. A teleporting scroll reads as a dropped frame."""
    page.evaluate(SCROLL_JS, y)


def show(page, locator, top=TOP):
    """Put a locator's top just below the chrome, not in the centre: centring
    a tall panel leaves half of it off screen."""
    try:
        box = locator.first.bounding_box()
    except Exception:
        return
    if not box:
        return
    ease_scroll(page, max(0, page.evaluate("scrollY") + box["y"] - top))
    page.wait_for_timeout(220)


def point(page, locator, settle=260):
    """Travel to a control and rest on it, so the cursor visibly arrives
    before anything changes."""
    try:
        box = locator.first.bounding_box()
    except Exception:
        return
    if not box:
        return
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2, steps=18)
    page.wait_for_timeout(settle)


def dismiss(page):
    """Close any dialog left open, so the next beat is not clicking through it."""
    dlg = page.locator('[role="dialog"]')
    if dlg.count():
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)


def press(page, locator):
    """Click by travelling to the control, so the pulse animates under it."""
    point(page, locator)
    locator.first.click()


# ---------------------------------------------------------------- actions
# Each is a generator. Everything before the yield composes the shot in
# silence. Everything after runs while the line is being spoken.

def a_hello(p, c):
    yield


PAPERS = ["Passbook", "LIC bond", "Share certificate"]


def paper(p, name):
    return p.get_by_role("button", name=name, exact=True)


def a_problem(p, c):
    press(p, p.get_by_role("link", name="Try it now").first)
    p.wait_for_url("**/try", timeout=30000)
    p.wait_for_selector("text=What Virasat read", timeout=60000)
    p.wait_for_timeout(800)
    cards = p.get_by_text("What Virasat read").first
    show(p, cards)
    yield
    # One paper per sentence, while the line names it.
    for i, name in enumerate(PAPERS):
        c.on_sentence(min(i, len(c.sentences) - 1))
        point(p, p.get_by_text(name, exact=False).first, settle=380)


def a_name_it(p, c):
    ease_scroll(p, 0)
    yield
    point(p, p.get_by_role("link", name="Virasat").first, settle=1200)


def a_find(p, c):
    # name-it scrolled back to the top, so come back down to the cards.
    show(p, p.get_by_text("What Virasat read").first)
    yield
    conf = p.get_by_text("confidence", exact=False).first
    if conf.count():
        point(p, conf, settle=700)
    c.on_sentence(1)
    ease_scroll(p, p.evaluate("scrollY") + 240)
    total = p.get_by_text("waiting in", exact=False).first
    if total.count():
        point(p, total, settle=800)


def a_ais(p, c):
    ais = p.get_by_role("button", name="Use Ramesh's sample AIS")
    show(p, ais)
    yield
    c.on_sentence(1)
    press(p, ais)
    p.wait_for_timeout(1500)
    c.on_sentence(2)
    ease_scroll(p, p.evaluate("scrollY") + 260)


def a_search(p, c):
    box = p.get_by_placeholder("Shareholder name")
    show(p, box)
    yield
    point(p, box)
    box.first.click()
    box.first.type("Ramesh Balwant Kulkarni Nashik", delay=45)
    # Exact match: "Search" also matches the "Search here" buttons on every
    # asset card, and clicking one of those opens a dialog over the page.
    btn = p.get_by_role("button", name="Search", exact=True).first
    press(p, btn)
    p.wait_for_timeout(1400)
    c.on_sentence(1)
    box.first.fill("")
    box.first.type("Ramesh Kulkarni", delay=55)
    press(p, btn)
    p.wait_for_timeout(1200)


def a_route(p, c):
    # Claim asks for an asset, then the questions appear. Compose the pick and
    # the first answer in silence, so the line lands on the route itself.
    nxt = p.get_by_role("button", name="Next: claim this money")
    if nxt.count():
        press(p, nxt)
    else:
        press(p, p.locator('nav[aria-label*="sidebar"] button', has_text="Claim").first)
    p.wait_for_timeout(1100)
    sbi = p.get_by_role("button", name="State Bank of India", exact=False).first
    show(p, sbi)
    press(p, sbi)
    p.wait_for_selector("text=Was a nominee named", timeout=30000)
    p.wait_for_timeout(500)
    yield
    # Three simple questions, answered on camera.
    show(p, p.get_by_text("Was a nominee named", exact=False).first)
    press(p, p.get_by_role("button", name="Yes", exact=True).first)
    p.wait_for_timeout(500)
    press(p, p.get_by_role("button", name="Spouse", exact=True).first)
    p.wait_for_timeout(600)
    c.on_sentence(1)
    get = p.get_by_role("button", name="Get my route and forms")
    show(p, get)
    press(p, get)
    p.wait_for_selector("text=Your route", timeout=90000)
    p.wait_for_timeout(600)
    show(p, p.get_by_text("Your route").first)
    c.on_sentence(2)
    rule = p.get_by_text("Rule", exact=False).first
    if rule.count():
        point(p, rule, settle=1100)
    c.on_sentence(3)
    ease_scroll(p, p.evaluate("scrollY") + 300)


def a_review(p, c):
    see = p.get_by_role("button", name="See the full debate")
    if see.count():
        show(p, see)
        press(p, see)
        p.wait_for_timeout(700)
    yield
    ch = p.get_by_text("Challenger").first
    if ch.count():
        show(p, ch)
        point(p, ch, settle=900)
    c.on_sentence(2)
    ref = p.get_by_text("Referee").first
    if ref.count():
        show(p, ref)
        point(p, ref, settle=900)


def a_pack(p, c):
    dl = p.get_by_role("button", name="Download claim pack (PDF)")
    if dl.count() == 0:
        dl = p.get_by_text("Download claim pack", exact=False)
    show(p, dl)
    yield
    press(p, dl)
    p.wait_for_timeout(1600)
    c.on_sentence(2)
    track = p.locator('nav[aria-label*="sidebar"] button', has_text="Track").first
    if track.count():
        press(p, track)
        p.wait_for_timeout(900)
        ease_scroll(p, 0)


def a_include(p, c):
    yield
    sel = p.locator("#lang")
    point(p, sel)
    sel.select_option("hi")
    p.wait_for_timeout(1400)
    c.on_sentence(1)
    ease_scroll(p, p.evaluate("scrollY") + 200)


def a_close(p, c):
    p.locator("#lang").select_option("en")
    p.wait_for_timeout(700)
    p.goto(SITE + "/proof", wait_until="networkidle")
    p.wait_for_timeout(700)
    # Put the headline and the total in one frame and stay there. Scrolling
    # during this beat pushed "One family costs about Rs 36.44 of AI" off the
    # top, which is the one number the close is built on.
    head = p.get_by_text("One family costs about", exact=False).first
    show(p, head, top=BAR + HEADER + 8)
    yield
    point(p, head, settle=1400)
    c.on_sentence(1)
    total = p.get_by_text("One family, end to end").first
    if total.count():
        point(p, total, settle=1600)
    c.on_sentence(2)
    ret = p.get_by_text("rupees recovered for every rupee", exact=False).first
    if ret.count():
        point(p, ret, settle=1600)


def a_thanks(p, c):
    yield


ACTIONS = {
    "hello": a_hello, "problem": a_problem, "name-it": a_name_it, "find": a_find,
    "ais": a_ais, "search": a_search, "route": a_route, "review": a_review,
    "pack": a_pack, "include": a_include, "close": a_close, "thanks": a_thanks,
}


def main():
    narration = json.loads((BUILD / "narration.json").read_text(encoding="utf-8"))
    by_id = {n["id"]: n for n in narration}
    vid = BUILD / "video"
    if vid.exists():
        shutil.rmtree(vid)
    vid.mkdir(parents=True, exist_ok=True)

    timeline = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(args=["--hide-scrollbars"])
        ctx = browser.new_context(
            viewport={"width": W, "height": H},
            record_video_dir=str(vid),
            record_video_size={"width": W, "height": H},   # must equal the viewport
            # At 1080p the page is drawn at twice the frame and downsampled, so
            # the type is supersampled. At 4K the frame already has the pixels,
            # and asking for another doubling only costs memory.
            device_scale_factor=1 if SCALE > 1 else 2,
            color_scheme="light",
        )
        ctx.add_init_script(path=str(HERE / "chrome.js"))
        if SCALE != 1:
            # Applied before anything is measured, so every bounding box the
            # actions read is already in the zoomed coordinate space.
            ctx.add_init_script(
                "addEventListener('DOMContentLoaded',function(){"
                "document.documentElement.style.zoom='%d'})" % SCALE)
        # Force the light theme before first paint, so the recording does not
        # depend on the machine's OS theme.
        ctx.add_init_script("try{localStorage.setItem('virasat.theme','light')}catch(e){}")
        page = ctx.new_page()

        # A fresh context starts clean. /try then seeds Sunita's three papers
        # itself, so they are already read when we arrive: beat 4 reveals the
        # result rather than pretending to trigger it.
        page.goto(SITE, wait_until="networkidle")
        page.evaluate(CLEAR_JS)
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(1200)

        size = page.evaluate("({w: innerWidth, h: innerHeight})")
        assert size["w"] == W, "viewport is %s, expected %s" % (size["w"], W)
        page.mouse.move(W / 2, H / 2)

        start = time.time()
        c = Ctx()
        for b in BEATS:
            n = by_id[b["id"]]
            dismiss(page)
            gen = ACTIONS[b["id"]](page, c)
            next(gen)                       # compose in silence
            time.sleep(b["pause"])
            c.t0 = time.time()
            c.sentences = n["sentences"]
            at = c.t0 - start
            timeline.append({"id": b["id"], "at": round(at, 3), "dur": n["dur"]})
            print("%-10s begins %7.2fs  line %5.2fs" % (b["id"], at, n["dur"]))
            try:
                next(gen)                   # runs while the line is spoken
            except StopIteration:
                pass
            left = n["dur"] - (time.time() - c.t0)
            if left > 0:
                time.sleep(left)
        page.wait_for_timeout(400)
        total = time.time() - start
        ctx.close()
        browser.close()

    raw = next(vid.glob("*.webm"))
    raw.replace(BUILD / "raw.webm")  # replace, not rename: Windows will not overwrite
    (BUILD / "timeline.json").write_text(json.dumps(timeline, indent=2), encoding="utf-8")
    print("\nrecorded %.1fs to build/raw.webm" % total)


if __name__ == "__main__":
    main()
