// Final pitch deck for the Project Submission round.
// Follows the 8 presentation points Rules.md asks for, in order.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const fs = require("fs");

const OUT = process.argv[2] || "Virasat_Final_Deck.pptx";
const SHOTS = __dirname + "/shots";

const TEAL = "0F3D3E", TEAL2 = "1F6F6B", TINT = "E6F0EE", GOLD = "E3A33B",
  GOLD_T = "FBF1DF", INK = "1B2424", MUTED = "5B6B6A", WHITE = "FFFFFF", LINE = "D5E2DF", GREEN = "1E7F4F";
const LIVE = "https://virasat-indol.vercel.app";
const REPO = "https://github.com/usv240/virasat";
const HF = "Cambria", BF = "Calibri";

async function icon(name, color, size = 256) {
  const Comp = fa[name];
  if (!Comp) throw new Error("icon missing: " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
const img = (f) => "image/png;base64," + fs.readFileSync(`${SHOTS}/${f}`).toString("base64");
const shadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.12 });

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Virasat: Team USV, Project Submission";
  // The live deployment judges can open straight from the deck.


  const I = {};
  for (const [k, n, c] of [
    ["camera", "FaCamera", WHITE], ["claim", "FaFileSignature", WHITE], ["bell", "FaBell", WHITE],
    ["shield", "FaShieldAlt", WHITE], ["mic", "FaMicrophone", WHITE], ["file", "FaFileInvoice", WHITE],
    ["star", "FaStar", TEAL], ["check", "FaCheck", WHITE], ["rupee", "FaRupeeSign", WHITE],
    ["users", "FaUserFriends", WHITE], ["cogs", "FaCogs", WHITE], ["lock", "FaLock", WHITE],
    ["rocket", "FaRocket", WHITE], ["search", "FaSearch", WHITE], ["balance", "FaBalanceScale", WHITE],
    ["lang", "FaLanguage", WHITE], ["code", "FaCode", WHITE], ["heart", "FaHandHoldingHeart", WHITE],
  ]) I[k] = await icon(n, c);

  const tag = (s, num, label) => s.addText(num ? `${num}  ·  ${label.toUpperCase()}` : label.toUpperCase(),
    { x: 0.5, y: 0.28, w: 8, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: GOLD, charSpacing: 2, margin: 0, isTextBox: true });
  const title = (s, text, color = INK, y = 0.58, size = 26) =>
    s.addText(text, { x: 0.5, y, w: 9, h: 0.8, fontFace: HF, fontSize: size, bold: true, color, margin: 0, valign: "top", isTextBox: true });
  const foot = (s, text, color = MUTED) =>
    s.addText(text, { x: 0.5, y: 5.28, w: 9, h: 0.25, fontFace: BF, fontSize: 8, color, margin: 0, isTextBox: true });
  const txt = (s, text, o) => s.addText(text, Object.assign({ fontFace: BF, fontSize: 12, color: INK, margin: 0, valign: "top", isTextBox: true }, o));
  const card = (s, x, y, w, h, fill = WHITE) => s.addShape(pres.shapes.ROUNDED_RECTANGLE,
    { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill === WHITE ? LINE : fill, width: 0.75 }, shadow: shadow() });
  const circleIcon = (s, im, x, y, d = 0.5, fill = TEAL) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
    const p = d * 0.26;
    s.addImage({ data: im, x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  };
  const screenshot = (s, file, x, y, w, h) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.04, y: y - 0.04, w: w + 0.08, h: h + 0.08, rectRadius: 0.06, fill: { color: "EDF2F1" }, line: { color: LINE, width: 0.75 }, shadow: shadow() });
    s.addImage({ data: img(file), x, y, w, h });
  };

  /* 1. Title */
  {
    const s = pres.addSlide(); s.background = { color: TEAL };
    txt(s, "GLOBAL INNOVATION HACKATHON 2026  ·  PROJECT SUBMISSION", { x: 0.6, y: 0.45, w: 8, h: 0.3, fontSize: 11, bold: true, color: GOLD, charSpacing: 2 });
    txt(s, "Virasat", { x: 0.6, y: 1.05, w: 5, h: 0.95, fontFace: HF, fontSize: 54, bold: true, color: WHITE });
    txt(s, "Find and claim your family's money.", { x: 0.6, y: 2.0, w: 5, h: 0.45, fontSize: 19, color: "CFE3DF" });
    txt(s, "A working product. Photograph old papers, and Virasat finds where the money is, explains what to do in your language, and fills the forms.",
      { x: 0.6, y: 2.6, w: 4.9, h: 0.9, fontSize: 13, color: "E8F1EF" });
    txt(s, "Team USV", { x: 0.6, y: 4.3, w: 4, h: 0.3, fontSize: 15, bold: true, color: WHITE });
    txt(s, "FinTech  ·  Generative AI  ·  Social Impact  ·  Accessibility", { x: 0.6, y: 4.68, w: 6, h: 0.3, fontSize: 10.5, color: "9FC3BD" });
    txt(s, "Try it now: virasat-indol.vercel.app", { x: 0.6, y: 3.6, w: 5, h: 0.32, fontSize: 13, bold: true, color: GOLD, hyperlink: { url: LIVE } });
    txt(s, "Code: github.com/usv240/virasat", { x: 0.6, y: 3.95, w: 5, h: 0.3, fontSize: 11, color: "CFE3DF", hyperlink: { url: REPO } });
    screenshot(s, "hindi.png", 6.1, 0.75, 1.75, 3.8);
    txt(s, "Working in Hindi,\non a phone", { x: 8.1, y: 1.6, w: 1.5, h: 0.8, fontSize: 11, color: "CFE3DF" });
  }

  /* 2. Problem (point 1) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "01", "Problem statement");
    title(s, "Lakhs of families have money waiting for them.\nThey just do not know it.");
    const stats = [["₹1.84 L cr", "unclaimed across banks, insurance, PF and shares", "[1]"],
      ["₹72,454 cr", "in old bank accounts alone, parked with RBI", "[2]"],
      ["8.5 lakh", "people have ever used RBI's search portal, in a country of 140 crore", "[3]"],
      ["₹38,700", "average returned per family in Gujarat's claim camps", "[4]"]];
    stats.forEach(([n, l, r], i) => {
      const x = 0.5 + i * 2.28;
      card(s, x, 1.8, 2.1, 1.85, i === 0 ? TEAL : WHITE);
      txt(s, n, { x: x + 0.18, y: 1.98, w: 1.85, h: 0.55, fontFace: HF, fontSize: 23, bold: true, color: i === 0 ? GOLD : TEAL });
      txt(s, l, { x: x + 0.18, y: 2.58, w: 1.78, h: 0.95, fontSize: 11, color: i === 0 ? WHITE : INK });
      txt(s, r, { x: x + 1.62, y: 3.38, w: 0.38, h: 0.2, fontSize: 8, color: i === 0 ? "9FC3BD" : MUTED, align: "right" });
    });
    card(s, 0.5, 3.95, 9, 1.1, GOLD_T);
    circleIcon(s, I.heart, 0.72, 4.22, 0.55, GOLD);
    txt(s, [{ text: "Why it stays stuck: ", options: { bold: true, color: TEAL } },
      { text: "nobody knew it existed; it is spread across six separate portals, mostly in English; the rules are confusing, so agents take 5 to 15 percent; and accounts without a nominee become new unclaimed money every year." }],
      { x: 1.5, y: 4.12, w: 7.8, h: 0.8, fontSize: 12.5, valign: "middle" });
    foot(s, "Sources: [1] Union Finance Minister, Oct 2025  [2] Govt and RBI, Jan 2026  [3] RBI UDGAM, Jul 2025  [4] All India Radio. Full list on the References page of the site.");
  }

  /* 3. Solution (point 2) */
  {
    const s = pres.addSlide(); s.background = { color: TINT };
    tag(s, "02", "Proposed solution");
    title(s, "Take a photo. Get your family's money back.");
    const steps = [[I.camera, "1  FIND", "Photograph old papers, or upload the income tax statement. Virasat lists every place the family may have money, and the exact portal to search."],
      [I.claim, "2  CLAIM", "Three plain questions. A tested rule engine picks the route and generates the filled claim pack as a PDF."],
      [I.bell, "3  TRACK", "Status, next action, and a pre-written ombudsman complaint after 30 days of silence."],
      [I.shield, "4  PREVENT", "The Parivaar Vault records every account and checks that each has a nominee."]];
    steps.forEach(([ic, h, d], i) => {
      const x = 0.5 + i * 2.3;
      card(s, x, 1.55, 2.05, 2.6);
      circleIcon(s, ic, x + 0.2, 1.75, 0.55, i === 3 ? GOLD : TEAL);
      txt(s, h, { x: x + 0.2, y: 2.42, w: 1.7, h: 0.3, fontSize: 12.5, bold: true, color: TEAL, charSpacing: 1 });
      txt(s, d, { x: x + 0.2, y: 2.75, w: 1.72, h: 1.3, fontSize: 10.5, color: INK });
      if (i < 3) s.addShape(pres.shapes.CHEVRON, { x: x + 2.1, y: 2.75, w: 0.16, h: 0.25, fill: { color: GOLD }, line: { color: GOLD } });
    });
    const pills = [[I.mic, "English and Hindi, by voice", 3.2], [I.lang, "Light and dark, phone and laptop", 3.6], [I.lock, "No sign up to try it", 2.4]];
    let px = 0.5;
    pills.forEach(([ic, t, w]) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 4.4, w, h: 0.45, rectRadius: 0.22, fill: { color: TEAL }, line: { color: TEAL } });
      s.addImage({ data: ic, x: px + 0.17, y: 4.51, w: 0.23, h: 0.23 });
      txt(s, t, { x: px + 0.5, y: 4.4, w: w - 0.6, h: 0.45, fontSize: 11, bold: true, color: WHITE, valign: "middle" });
      px += w + 0.15;
    });
  }

  /* 4. The product, built (point 5 preview) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "05", "Product demonstration");
    title(s, "This is the working product, not a mock-up", INK, 0.58, 24);
    screenshot(s, "find.png", 0.5, 1.45, 4.4, 3.1);
    screenshot(s, "claim.png", 5.1, 1.45, 4.4, 3.1);
    txt(s, "Find: three sample papers and the tax statement become a list of ₹4.85 lakh waiting in 5 places, each with its own portal and guided steps.",
      { x: 0.5, y: 4.62, w: 4.4, h: 0.6, fontSize: 10, color: MUTED });
    txt(s, "Claim: the rule engine picks the route, the Two AI Debate checks it, and the filled claim pack downloads as a PDF.",
      { x: 5.1, y: 4.62, w: 4.4, h: 0.6, fontSize: 10, color: MUTED });
  }

  /* 5. Innovation (point 3) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "03", "Innovation");
    title(s, "Four things that exist nowhere else");
    const items = [[I.file, "The tax statement becomes an asset map", "A legal heir can get the account holder's Annual Information Statement. It lists interest from every bank and dividends from every company. Virasat turns that one PDF into a list of places to claim from, even with no papers at all."],
      [I.balance, "The Two AI Debate", "One AI argues for the route, a second hunts for what could go wrong, a third gives the verdict with reasons and risks. The referee can only make advice more careful, never overrule the rules."],
      [I.cogs, "Safety by separation", "The AI reads, explains and translates. Every legal decision comes from a deterministic, versioned, unit-tested rule engine, so an institution can audit it."],
      [I.code, "Bring your own data, key and rules", "A bank sends its own claim rules as JSON. Virasat applies them and records the rule version on every claim."]];
    items.forEach(([ic, h, d], i) => {
      const y = 1.5 + i * 0.93;
      circleIcon(s, ic, 0.5, y, 0.55, i === 1 ? GOLD : TEAL);
      txt(s, h, { x: 1.25, y: y - 0.02, w: 8.2, h: 0.3, fontSize: 14, bold: true, color: TEAL });
      txt(s, d, { x: 1.25, y: y + 0.28, w: 8.2, h: 0.6, fontSize: 10.5, color: INK });
    });
  }

  /* 6. The debate, shown */
  {
    const s = pres.addSlide(); s.background = { color: TINT };
    tag(s, "03", "Innovation: the Two AI Debate");
    title(s, "The Challenger caught what a single answer missed", INK, 0.58, 24);
    card(s, 0.5, 1.5, 4.5, 1.5, WHITE);
    txt(s, "Supporter", { x: 0.7, y: 1.62, w: 4, h: 0.25, fontSize: 11, bold: true, color: GREEN });
    txt(s, "The nominee route is correct: the passbook names a nominee and the amount is below the bank's threshold.", { x: 0.7, y: 1.9, w: 4.1, h: 1, fontSize: 10.5 });
    card(s, 5.1, 1.5, 4.4, 1.5, WHITE);
    txt(s, "Challenger", { x: 5.3, y: 1.62, w: 4, h: 0.25, fontSize: 11, bold: true, color: "8A5A00" });
    txt(s, "The passbook says 'Sunita R Kulkarni'. Her ID may say 'Sunita Ramesh Kulkarni'. Banks reject claims on a spelling mismatch.", { x: 5.3, y: 1.9, w: 4, h: 1, fontSize: 10.5 });
    card(s, 0.5, 3.15, 9, 1.35, TEAL);
    txt(s, "Referee", { x: 0.75, y: 3.28, w: 3, h: 0.25, fontSize: 11, bold: true, color: GOLD });
    txt(s, "Nominee route. High confidence. Next step: carry an ID that matches the nominee name exactly, or an affidavit for the name variation.",
      { x: 0.75, y: 3.56, w: 8.5, h: 0.8, fontSize: 13, color: WHITE });
    foot(s, "Research: multi-agent debate improves factual accuracy (Du and others, ICML 2024). Newer work warns it is not always better, so we measure it: npm run eval reports how often the Challenger catches a planted problem, with and without the debate. Both numbers are published on the site.");
  }

  /* 7. Technical implementation (point 4) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "04", "Technical implementation");
    title(s, "What is actually built");
    const col = (x, w, head, items, fill, tcolor, hcolor) => {
      card(s, x, 1.5, w, 2.45, fill);
      txt(s, head, { x: x + 0.2, y: 1.62, w: w - 0.4, h: 0.3, fontSize: 10.5, bold: true, color: hcolor, charSpacing: 1.5 });
      txt(s, items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < items.length - 1 } })),
        { x: x + 0.2, y: 1.95, w: w - 0.4, h: 1.9, fontSize: 10, color: tcolor, paraSpaceAfter: 3 });
    };
    col(0.5, 3.0, "READS AND WRITES", ["Claude Opus 5 with JSON schema outputs", "AIS PDF tables parsed in code", "Claim packs built with pdf-lib", "Browser speech in and out"], WHITE, INK, MUTED);
    col(3.65, 2.7, "DECIDES", ["Rule engine, 5 institutions", "Versioned and unit-tested", "Bring your own rules", "Debate can only raise caution"], TEAL, WHITE, GOLD);
    col(6.5, 3.0, "SERVES", ["Next.js 16, React 19, TypeScript", "Public API with keys and limits", "RFC 9457 errors, playground", "Data stays in the browser"], WHITE, INK, MUTED);
    const nums = [["23", "automated tests"], ["0", "serious axe violations"], ["99 / 100", "Lighthouse perf / a11y"], ["about ₹16", "AI cost per claim"]];
    nums.forEach(([n, l], i) => {
      const x = 0.5 + i * 2.28;
      card(s, x, 4.15, 2.1, 0.85, GOLD_T);
      txt(s, n, { x: x + 0.15, y: 4.24, w: 1.9, h: 0.35, fontFace: HF, fontSize: 17, bold: true, color: TEAL });
      txt(s, l, { x: x + 0.15, y: 4.6, w: 1.9, h: 0.3, fontSize: 9.5, color: INK });
    });
  }

  /* 8. Accessibility and languages */
  {
    const s = pres.addSlide(); s.background = { color: TINT };
    tag(s, "04", "Technical implementation: measured, not claimed");
    title(s, "Built for a cheap phone, in your language", INK, 0.58, 24);
    screenshot(s, "dark.png", 0.5, 1.5, 4.3, 2.4);
    screenshot(s, "hindi.png", 5.2, 1.5, 1.55, 3.35);
    const rows = [["Accessibility (axe, WCAG 2.2 AA)", "0 serious or critical across 11 pages, light and dark"],
      ["Lighthouse, live, 3 runs each", "99 to 100 desktop, never below 90 on a throttled phone. 100 accessibility, best practices and SEO on both, and layout shift under a quarter of the 0.1 threshold."],
      ["Works with no signal", "Installable. A service worker keeps every opened page, the Vault and the glossary working offline, and says which steps are waiting."],
      ["Languages and reach", "English and Hindi on every screen including the rule output and the debate. 320 px, 44 px controls, voice in and out, no sign up."]];
    rows.forEach(([k, v], i) => {
      const y = 1.5 + i * 0.85;
      txt(s, k, { x: 7.05, y, w: 2.5, h: 0.25, fontSize: 10.5, bold: true, color: TEAL });
      txt(s, v, { x: 7.05, y: y + 0.24, w: 2.5, h: 0.62, fontSize: 8.5, color: INK });
    });
    txt(s, "Dark mode and Hindi are one tap from any screen.", { x: 0.5, y: 4.05, w: 4.3, h: 0.3, fontSize: 10, color: MUTED });
  }

  /* 9. Impact (point 6) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "06", "Impact");
    title(s, "What changes for one family, and for the country");
    const head = ["For ₹4.2 lakh owed", "Today", "With Virasat"].map((t, j) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: j === 2 ? TEAL2 : TEAL } } }));
    const rows = [["Agent's cut (5 to 15%)", "₹21,000 to ₹63,000", "₹0"],
      ["Time on paperwork", "Months of office visits", "Forms ready the same day"],
      ["Chance of missing money", "High: nobody knows what exists", "Low: the tax statement shows every bank"]]
      .map((r) => r.map((c, j) => ({ text: c, options: { bold: j !== 1, color: j === 2 ? TEAL : INK, fill: { color: j === 2 ? "F2F8F6" : WHITE } } })));
    s.addTable([head, ...rows], { x: 0.5, y: 1.55, w: 5.5, colW: [1.9, 1.7, 1.9], fontFace: BF, fontSize: 10.5, border: { type: "solid", pt: 0.5, color: LINE }, rowH: 0.6, margin: [0.05, 0.08, 0.05, 0.08], valign: "middle" });
    const big = [["₹184 crore", "back to families if just 0.1 percent of the pool is claimed", GOLD, INK],
      ["₹38.7 crore", "saved in agent fees if we help 1 lakh families", TEAL, WHITE],
      ["about ₹20", "of AI per family, against ₹38,700 returned on average. Roughly 1,900 rupees recovered per rupee spent.", WHITE, INK]];
    big.forEach(([n, l, fill, tc], i) => {
      const y = 1.55 + i * 1.18;
      card(s, 6.3, y, 3.2, 1.03, fill);
      txt(s, n, { x: 6.5, y: y + 0.1, w: 2.9, h: 0.4, fontFace: HF, fontSize: 19, bold: true, color: fill === WHITE ? TEAL : tc });
      txt(s, l, { x: 6.5, y: y + 0.5, w: 2.9, h: 0.5, fontSize: 9.5, color: tc });
    });
    foot(s, "Agent fees: IEPF recovery consultants publish 5 to 15 percent. ₹38,700 average claim = ₹104 crore over 26,874 claims (All India Radio). AI cost is arithmetic on token counts at published Claude Opus 5 prices, shown in full at /proof and reproducible with npm run measure:cost.");
  }

  /* 10. Scalability (point 7) */
  {
    const s = pres.addSlide(); s.background = { color: TINT };
    tag(s, "07", "Scalability");
    title(s, "Adding a bank is adding one file");
    const stages = [["START", "1 district", "Service centres and one bank. Count the money returned every week."],
      ["STATE", "All institutions", "A rule file per bank, insurer and fund house."],
      ["INDIA", "22 languages", "DigiLocker and Account Aggregator. Join the RBI and IRDAI campaigns."],
      ["WORLD", "Beyond India", "NRI families, and countries with similar unclaimed money programmes."]];
    stages.forEach(([k, h, d], i) => {
      const x = 0.5 + i * 2.3, y = 2.75 - i * 0.3;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.05, h: 2.0 + i * 0.3, rectRadius: 0.08, fill: { color: i === 3 ? GOLD : [TINT, "C8DEDA", TEAL2][i] }, line: { color: WHITE, width: 0 } });
      const dark = i === 2;
      txt(s, k, { x: x + 0.18, y: y + 0.14, w: 1.7, h: 0.3, fontSize: 10.5, bold: true, charSpacing: 1.5, color: dark ? GOLD : i === 3 ? INK : TEAL2 });
      txt(s, h, { x: x + 0.18, y: y + 0.42, w: 1.75, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: dark ? WHITE : INK });
      txt(s, d, { x: x + 0.18, y: y + 0.86, w: 1.72, h: 1.1, fontSize: 10, color: dark ? WHITE : INK });
    });
    txt(s, "How it earns: free for families. Banks and insurers pay, because regulators push them to clear unclaimed balances. Service centres charge a small fixed fee instead of an agent's percentage.",
      { x: 0.5, y: 1.42, w: 9, h: 0.6, fontSize: 12, color: MUTED, italic: true });
  }

  /* 11. Proof: unit economics, the open corpus, and reproducibility */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "07", "Feasibility: the arithmetic, in public");
    title(s, "₹20 a family, open rules, and every number checkable", INK, 0.58, 24);

    // Left: where the twenty rupees goes, and why most of the journey is free.
    card(s, 0.5, 1.5, 4.4, 3.2, "F2F8F6");
    txt(s, "What one family costs", { x: 0.75, y: 1.68, w: 4.0, h: 0.3, fontSize: 12, bold: true, color: TEAL });
    const steps = [["Reading 3 photographed papers", "₹5.17"],
      ["Two AI reviewers, 3 claim routes", "₹14.82"],
      ["Tax statement, rules, claim packs", "free"],
      ["One family, end to end", "₹19.99"]];
    steps.forEach(([k, v], i) => {
      const y = 2.05 + i * 0.5;
      const last = i === steps.length - 1;
      txt(s, k, { x: 0.75, y, w: 3.0, h: 0.4, fontSize: last ? 11 : 10, bold: last, color: last ? TEAL : INK });
      txt(s, v, { x: 3.8, y, w: 0.95, h: 0.4, fontSize: last ? 13 : 10.5, bold: true, align: "right", color: last ? TEAL : v === "free" ? GREEN : INK });
    });
    txt(s, "Most of the journey costs nothing per family, because most of it runs in ordinary code. The AI is used only to read a photograph and to argue about a route.",
      { x: 0.75, y: 4.02, w: 4.0, h: 0.6, fontSize: 9, color: MUTED, italic: true });

    // Right: the two things that make it public infrastructure rather than a demo.
    const pts = [["The rules are open", "The claim procedure of each institution, as machine readable data. Served with no key, MIT licensed, at /api/v1/rules/corpus. If a bank or a government portal takes it, that is the point. We would rather be the standard than the site."],
      ["Every number is checkable", "One command, npm run audit, re-runs accessibility on every page in both themes, Lighthouse three times on two profiles, the tests and the build, then writes the report including whatever failed."]];
    pts.forEach(([h, d], i) => {
      const y = 1.5 + i * 1.65;
      card(s, 5.2, y, 4.3, 1.45);
      txt(s, h, { x: 5.45, y: y + 0.16, w: 3.85, h: 0.3, fontSize: 13, bold: true, color: TEAL });
      txt(s, d, { x: 5.45, y: y + 0.5, w: 3.85, h: 0.85, fontSize: 9.5, color: INK });
    });
    txt(s, "It goes down, not up, with scale: overnight work moves to the Batch API at half price, and a clear printed passbook does not need the largest model. About ₹4 a family at the lowest setting.",
      { x: 5.2, y: 4.85, w: 4.3, h: 0.4, fontSize: 9, color: MUTED, italic: true });
    foot(s, "Published Anthropic prices, checked 21 Sep 2026, converted at 88 rupees to the dollar. Average of ₹38,700 returned per family: Gujarat camps, All India Radio.");
  }

  /* 12. Judge mode */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "05", "Product demonstration: for judges");
    title(s, "Every criterion mapped to proof you can open", INK, 0.58, 24);
    screenshot(s, "judges.png", 0.5, 1.45, 5.2, 3.25);
    const pts = ["A 2-minute guided tour of the live product.",
      "A table mapping each criterion and weight to a claim and a link.",
      "An honest list: what is real, what is sample data, what is planned.",
      "Every deliverable Rules.md asks for, with a link.",
      "One click resets the demo for the next judge."];
    txt(s, pts.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < pts.length - 1 } })),
      { x: 6.0, y: 1.6, w: 3.5, h: 2.6, fontSize: 11.5, color: INK, paraSpaceAfter: 8 });
    txt(s, "Open /judges on the live site.", { x: 6.0, y: 4.25, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: TEAL });
  }

  /* 13. Future scope (point 8) */
  {
    const s = pres.addSlide(); s.background = { color: WHITE };
    tag(s, "08", "Future scope");
    title(s, "The next three things we build");
    const items = [[I.mic, "WhatsApp and more languages", "The same engine behind a WhatsApp number, plus Marathi, Tamil, Telugu and Bengali, so families who never open a website can still use it."],
      [I.lock, "DigiLocker and Account Aggregator", "Fetch certificates directly and, with consent, read bank data through India's account aggregator framework, so the search step disappears."],
      [I.users, "The service centre network", "A helper dashboard for the 5 lakh Common Service Centres, so one trained operator can run claims for a whole village."]];
    items.forEach(([ic, h, d], i) => {
      const y = 1.6 + i * 1.15;
      circleIcon(s, ic, 0.5, y, 0.6, i === 0 ? GOLD : TEAL);
      txt(s, h, { x: 1.3, y, w: 8.2, h: 0.3, fontSize: 15, bold: true, color: TEAL });
      txt(s, d, { x: 1.3, y: y + 0.32, w: 8.2, h: 0.6, fontSize: 11, color: INK });
    });
  }

  /* 14. Close */
  {
    const s = pres.addSlide(); s.background = { color: TEAL };
    txt(s, "Aapki Poonji, Aapka Adhikar.", { x: 0.6, y: 1.3, w: 8.8, h: 0.8, fontFace: HF, fontSize: 34, bold: true, color: WHITE });
    txt(s, "Your money, your right. Virasat is the layer that gets families to it, in their own language.",
      { x: 0.6, y: 2.15, w: 8.5, h: 0.7, fontSize: 17, color: "CFE3DF" });
    [["₹1.84 L cr", "waiting to be claimed"], ["1 photo", "to get started"], ["₹0", "cost to families"], ["23 tests", "and zero a11y violations"]].forEach(([n, l], i) => {
      const x = 0.6 + i * 2.3;
      txt(s, n, { x, y: 3.2, w: 2.2, h: 0.5, fontFace: HF, fontSize: 24, bold: true, color: GOLD });
      txt(s, l, { x, y: 3.75, w: 2.2, h: 0.4, fontSize: 11, color: "9FC3BD" });
    });
    txt(s, "Team USV  ·  Global Innovation Hackathon 2026  ·  Live at virasat-indol.vercel.app",
      { x: 0.6, y: 4.8, w: 8.8, h: 0.3, fontSize: 10, color: "9FC3BD" });
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
