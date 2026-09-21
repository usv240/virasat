# Demo video script: beats

Target 2:50. Hard ceiling 3:00. About 390 spoken words at Polly long-form,
Patrick, rate 87 percent. Every beat is one scene the family would live, in
the order they would live it. Everything on screen is the live deployment at
virasat-indol.vercel.app with the address bar burned in.

One correction to the brief: Rules.md weights Presentation and Demonstration
at 5 percent, not 30. The film still decides the round, because a panel scores
Innovation, Technical and Impact through what the film makes them believe.
That is why the strongest material is in the first forty seconds.

Legend. **Navigate**: what the cursor does before the line starts.
**Point**: what the cursor rests on while the line is spoken. **Say**: the
exact narration, nothing else is spoken.

---

## 1. Hello, 0:00 to 0:04

**Navigate:** landing page hero, already loaded, no scroll.
**Point:** nothing yet, cursor still.
**Say:** **"Hi everyone, I am Ujwal."**

## 2. Cold open on the problem, 0:04 to 0:26

**Navigate:** click **Try it now**. On the Find tab, hover the three sample
papers under "Or use Sunita's sample papers" without clicking.
**Point:** the passbook thumbnail, then the LIC bond, then the share
certificate, one per sentence.
**Say:** **"Sunita's father died last year. He left her a tin of old papers: a
passbook, an insurance bond, a share certificate. Somewhere in there is money
that belongs to her family. She does not know which of it is still live, which
office to go to, or what to carry. Most families give up, or pay an agent a
third of it."**

## 3. Name it, 0:26 to 0:34

**Navigate:** scroll up slightly so the Virasat logo and the Find heading are
both in frame.
**Point:** the logo.
**Say:** **"This is Virasat. Photograph the papers, and it finds the money,
explains what to do in your language, and fills the forms."**

## 4. Find: papers become money, 0:34 to 0:56

**Navigate:** click **Or use Sunita's sample papers**. Wait on the DOM for the
"What Virasat read" cards. Ease-scroll so the cards sit under the header.
**Point:** the Holder field, then the confidence badge, then the total line
"waiting in n places".
**Say:** **"Each paper is read into fields: the institution, the holder, the
masked number, the nominee. Every field carries a confidence, so nothing is
silently guessed. Three papers, and already she can see what is waiting and
where."**

## 5. The idea nobody else has, 0:56 to 1:16

**Navigate:** scroll to "Tax statement (AIS)". Click **Use Ramesh's sample
AIS**. Wait for the new rows to appear.
**Point:** the new rows that were not in the papers, one by one.
**Say:** **"Now the part no portal does. A legal heir can get the account
holder's income tax statement. It lists every bank and company that ever paid
him. One PDF, read by code, becomes a map of accounts the family never knew
existed. This is how you find the account nobody remembered."**

## 6. A search that fails, then works, 1:16 to 1:32

**Navigate:** scroll to "Unpaid dividends by name". Type
`Ramesh Balwant Kulkarni Nashik` and click **Search**. Let "No match in index.
Try shorter name." appear and hold it for a full second. Clear, type
`Ramesh Kulkarni`, click **Search**. Three rows appear.
**Point:** the no-match message, then the three rows.
**Say:** **"Not everything works first time. The full name finds nothing,
because company lists spell names their own way. A shorter search finds three
years of unpaid dividends. The index here is sample data, and we say so:
republishing real lists next to real names would be a target list for
fraud."**

## 7. Claim: the route, and the rule that chose it, 1:32 to 1:54

**Navigate:** click **Next: claim this money**. On the Claim tab the three
questions are pre-filled for the sample. Click **Get my route and forms**.
Wait for "Your route".
**Point:** the route name, then the "Rule" line with its id and version, then
the document checklist.
**Say:** **"Three plain questions, and a rule engine picks the route: nominee,
legal heir, or court. Not the AI. A versioned, tested rule, and its id is
printed on the answer, so a bank can audit it. Then the exact documents she
needs, and which office issues each one."**

## 8. Two AIs argue, and she can read it, 1:54 to 2:16

**Navigate:** scroll to the debate panel. Click **See the full debate**.
**Point:** the Challenger card on the name-mismatch sentence, then the Referee
verdict, then the "This review cost" line.
**Say:** **"Before she acts, two AIs argue about her case in the open. The
Challenger catches that the passbook says Sunita R Kulkarni and her ID may
not. The Referee can only make advice more careful, never override the rules.
We measured this: on our planted problems it caught no more than a single
reviewer. We publish that. What it adds is that she can read the argument."**

## 9. The pack, 2:16 to 2:28

**Navigate:** click **Download claim pack (PDF)**. Let the download begin and
the button settle.
**Point:** the download button, then the Track tab as it is clicked, showing
the new claim with "Next: collect the documents".
**Say:** **"One click, and the claim form, a cover letter in English and Hindi,
and the checklist download as one pack. The claim is tracked, and if nobody
replies in thirty days, the ombudsman complaint is pre-written."**

## 10. Built for the people websites leave behind, 2:28 to 2:40

**Navigate:** switch the language select to हिन्दी. The whole app, including
the route and checklist, re-renders in Hindi. Click the Listen control so the
route is read aloud for two seconds.
**Point:** the Hindi route text, then the Listen control.
**Say:** **"All of it in Hindi, including the route and the checklist, read
aloud for anyone who cannot read comfortably. Zero accessibility violations,
measured, on a cheap phone, offline."**

## 11. Close: the number, and the promise, 2:40 to 2:50

**Navigate:** switch back to English. Open /proof and ease-scroll to the cost
table so "One family, end to end" and the figure are in frame.
**Point:** the ₹36.44 figure, then the "one district pilot" row on the impact
table if reachable in one scroll, otherwise stay on the cost figure.
**Say:** **"One family costs thirty six rupees of AI, measured, against
thirty eight thousand seven hundred returned on average. And it works on both
ends: money coming back, and a nominee check so the next lakh crore never gets
stuck. Virasat. Your money, your right."**

## 12. Thank you, 2:50 to 2:53

**Navigate:** nothing. Hold on the Proof page in its finished state.
**Point:** cursor still on the figure.
**Say:** **"Thank you."**

---

## What the audit will check on the built file

- Opens on "Hi everyone, I am Ujwal", no pause before it.
- The product is named once, in beat 3, after the problem.
- A failure is shown on camera (beat 6), and what was done about it.
- The uncomfortable numbers are spoken: thirty six rupees, and the debate
  caught no more than a single reviewer.
- Two separate closing beats, and the last frame is the product, not a card.
- Address bar visible in every frame, reading location.href.
- Duration under 3:00. Resolution 1920x1080, no grey band.
- No emojis, no em dashes, in narration or captions.
