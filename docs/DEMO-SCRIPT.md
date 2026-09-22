# Demo video script: beats

Target 2:50. Hard ceiling 3:00. About 410 spoken words at Polly long-form,
Patrick, rate 95 percent. Every beat is one scene the family would live, in
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
**Say:** **"Sunita's father died last year. He left a tin of old papers: a passbook, an
insurance bond, a share certificate. The money is hers. The hard part is
discovering where it is, and how to claim it."**

## 3. Name it, 0:26 to 0:34

**Navigate:** scroll up slightly so the Virasat logo and the Find heading are
both in frame.
**Point:** the logo.
**Say:** **"This is Virasat. Photograph the papers, and it finds the money, explains what
to do in your language, and fills the forms."**

## 4. Find: papers become money, 0:34 to 0:56

**Navigate:** click **Or use Sunita's sample papers**. Wait on the DOM for the
"What Virasat read" cards. Ease-scroll so the cards sit under the header.
**Point:** the Holder field, then the confidence badge, then the total line
"waiting in n places".
**Say:** **"Virasat turns paper into structured information: institution, holder, account,
nominee, each with a confidence. Three forgotten papers become three places
where money may be waiting."**

## 5. The idea nobody else has, 0:56 to 1:16

**Navigate:** scroll to "Tax statement (AIS)". Click **Use Ramesh's sample
AIS**. Wait for the new rows to appear.
**Point:** the new rows that were not in the papers, one by one.
**Say:** **"But Virasat can find something more important: the account that was never in
the tin. A legal heir can obtain the account holder's income tax statement.
Virasat reads it for every bank and company that paid him, and one PDF reveals banks and companies that never appeared
in the papers she found. We are not just digitising the
papers she found. We are helping her discover what was missing."**

## 6. Messy records, broadened search, 1:16 to 1:32

**Navigate:** scroll to "Unpaid dividends by name". Type
`Ramesh Balwant Kulkarni Nashik` and click **Search**. Let "No match in index.
Try shorter name." appear and hold it for a full second, with the
"Sample" label in frame. Clear, type
`Ramesh Kulkarni`, click **Search**. Three rows appear.
**Point:** the no-match message, then the three rows.
**Say:** **"Real records are messy. Names appear differently across institutions, so when
the full name is too specific, a broader search finds it: three years of
unpaid dividends, on data marked as sample."**

## 7. Claim: the route, and the rule that chose it, 1:32 to 1:54

**Navigate:** click **Next: claim this money**. On the Claim tab the three
questions are pre-filled for the sample. Click **Get my route and forms**.
Wait for "Your route".
**Point:** the route name, then the "Rule" line with its id and version, then
the document checklist.
**Say:** **"Three simple questions are enough for Virasat to determine her route:
nominee, legal heir, or court. And that decision is not made by AI. It comes
from an open, machine-readable rule corpus, where each institution's claim
process is written down, versioned and tested, with the rule id shown so every
decision is traceable. Then the exact documents she needs, and where to get
each one."**

## 8. Virasat challenges its own guidance, 1:54 to 2:16

**Navigate:** scroll to the debate panel. Click **See the full debate**.
**Point:** the Challenger card on the name-mismatch sentence, then the Referee
verdict, then the "Why" reasoning.
**Say:** **"Before Sunita acts, Virasat challenges its own guidance. One AI looks for
problems, like this name mismatch. Another reviews the concern, and can only
make the guidance more cautious, never override the rules. And Sunita can read
the concern and the reasoning herself."**

## 9. The pack, 2:16 to 2:28

**Navigate:** click **Download claim pack (PDF)**. Let the download begin and
the button settle.
**Point:** the download button, then the Track tab as it is clicked, showing
the new claim with "Next: collect the documents".
**Say:** **"Now everything becomes something she can use. One click creates her claim
form, the document checklist, and cover letters in English and Hindi. Virasat
tracks the claim, and if nobody responds in thirty days, prepares the
escalation."**

## 10. Built for the people websites leave behind, 2:28 to 2:40

**Navigate:** switch the language select to हिन्दी. The whole app, including
the route and checklist, re-renders in Hindi. Click the Listen control so the
route is read aloud for two seconds.
**Point:** the Hindi route text, then the Listen control.
**Say:** **"And it is not built only for people comfortable with financial websites. The
whole journey works in Hindi, and the guidance can be read aloud for someone
who is not comfortable reading it."**

## 11. Close: the number, and the promise, 2:40 to 2:50

**Navigate:** switch back to English. Open /proof and ease-scroll to the cost
table so "One family, end to end" and the figure are in frame. Do not rush
this beat: the numbers get room.
**Point:** the ₹36.44 figure for the cost sentence, the ₹38,700 line for the
next, then the Vault tab for the nominee sentence, then hold on the product
for the last three lines.
**Say:** **"The economics make this scalable. Serving one family costs about thirty six
rupees of AI. The average returned at Gujarat's camps is thirty eight thousand
seven hundred. And the Vault checks that today's accounts have nominees, so
tomorrow's money does not become another family's search. Find what was
forgotten. Claim what is yours. Prevent it being lost again. Virasat. Your
money, your right."**

## 12. Thank you, 2:50 to 2:53

**Navigate:** nothing. Hold on the Proof page in its finished state.
**Point:** cursor still on the figure.
**Say:** **"Thank you."**

---

## What the audit will check on the built file

- Opens on "Hi everyone, I am Ujwal", no pause before it.
- The product is named once, in beat 3, after the problem.
- A search that does not match is shown on camera (beat 6), then broadened.
- The cost is spoken in the same breath as the return: thirty six rupees
  against thirty eight thousand seven hundred. The debate measurement stays on
  /proof, in frame at the close, not in the narration.
- Two separate closing beats, and the last frame is the product, not a card.
- Address bar visible in every frame, reading location.href.
- Duration under 3:00. Resolution 1920x1080, no grey band.
- No emojis, no em dashes, in narration or captions.
