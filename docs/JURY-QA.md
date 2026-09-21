# Jury round brief

Round 4, 27 September. Bharat Academix mentors and industry experts. It is an
elimination round, so this is where the prize is actually decided.

The rules say the presentation must cover eight things, in this order: problem,
solution, innovation, technical implementation, product demonstration, impact,
scalability, future scope. Build the deck in that order. They wrote it down, so
somebody on the panel is ticking it off.

## Before anything else

Three rules for the Q&A that matter more than any individual answer.

**Answer the question that was asked, in one sentence, then stop.** The most
common way a good project loses a jury round is the founder who hears a question
and delivers a two minute speech. Panels read that as evasion.

**When you do not know, say so and say what you would do to find out.** A panel
of industry people has seen a hundred students bluff. They have not seen many
say "I do not know, and here is how I would check." That answer is worth more
than a confident wrong one, and it costs nothing.

**Never argue with a judge.** If they push back, the move is "that is fair" or
"say more about that," then answer. You are not trying to win the exchange. You
are trying to look like someone they would fund.

---

## The questions

### 1. RBI already runs UDGAM. Why does this need to exist?

UDGAM covers bank deposits. A family's money is not only in banks: it is in
lapsed insurance policies, forgotten provident fund accounts, unpaid dividends
sitting with the IEPF, and mutual fund folios. Those live in four separate
portals with four separate processes.

More to the point, UDGAM answers "is there money" and stops. It does not tell a
widow in a village which of six documents she needs, which office issues each
one, that her case changes at the five lakh threshold, or that the name on her
passbook is spelt differently from the name on her Aadhaar. That gap is where
families give up, and that gap is the whole product.

The capability table on the Judge page covers this row by row. Put it on screen
rather than describing it.

### 2. What stops the IEPF or a bank from building this next quarter?

Nothing, and we published the rule corpus openly so they can.

Say that plainly, because the instinct to claim a moat is what makes this answer
sound weak. The honest version is stronger: the hard part is not the software,
it is writing down what every institution actually asks for, which nobody has
done. We started it, we gave it away under MIT, and it is served at
`/api/v1/rules/corpus` with no key.

If the outcome is that IEPF adopts the corpus and families get their money, that
is the goal met. We would rather be the standard than the site.

### 3. So what is your defensible advantage?

Be careful here. Do not invent one.

The truthful answer is that the advantage is accumulated ground truth, not code.
Every claim that comes back rejected tells you something about that institution
that its own circular does not say. Whoever runs this longest has the most
accurate corpus, and accuracy is the only thing that matters to a family who
gets one attempt at a court fee.

### 4. Why would a bank ever pay you?

Because the bank already pays for this, badly.

A branch handles these claims with staff time, and most of that time goes on
packs that arrive incomplete and have to go back. We deliver a pack that is
right on arrival. Regulators are also pushing institutions to bring unclaimed
balances down, so this sits with something they are already being measured on.

Be honest about the status: we have no signed institution. It is the model we
would take into a pilot, not an agreement we hold. Say so before they ask.

### 5. Isn't this just a wrapper around an AI model?

The AI reads photographs and argues about risk. It never decides anything.

The claim route comes from a versioned rule engine with 24 tests across five
institutions, and the same input always produces the same answer. The AIS parser
is a table parser. The claim pack is filled from templates. If you switched the
model off, the route, the checklist and the form still work.

That is deliberate, and it is the opposite of a wrapper: the AI is confined to
the two jobs that genuinely need judgement, and locked out of the one that must
be reproducible.

### 6. What happens when the AI is confidently wrong?

Three things, and they are layered.

The rule engine chooses the route, so a wrong AI reading cannot change what a
family is told to do. The Referee in the debate is prevented in code from
lowering a caution: it can add risks or escalate to human review, never reduce
them. And anything outside the rule files routes to needs-review rather than a
guess.

The residual risk is a misread field, such as a wrongly transcribed policy
number. Every field carries a confidence and is editable by the family, and low
confidence is shown rather than hidden.

### 7. Have you tested this with a real family?

If the answer is still no on the 27th, do not dress it up. Say: not yet, and it
is the most important thing missing. Then say what you did instead, which is
that the flow was built from documented procedures and public sources, every one
of which is cited on the Sources page.

This is the question most likely to hurt. Between now and the 27th, even three
conversations changes the answer completely. See the note at the bottom.

### 8. Your unpaid-dividend index is sample data. Isn't that fatal?

It is a deliberate choice, not a shortcut, and the reason is worth saying out
loud: republishing real lists of unclaimed money next to real names is a
ready-made target list for fraud. The sample data is shaped exactly like the
real lists, so the search, the matching and the claim flow are real code running
on realistic input.

In production this reads from the official sources under the terms they are
published under. The Judge page marks it as sample in the honesty list already.

### 9. What stops a fraudster using this to claim money that is not theirs?

Virasat never submits anything. Every claim is filed by the person, through the
institution's own channel, with their own identity documents, exactly as it
works today. The institution's verification is unchanged. We prepare paperwork;
we do not move money and we do not stand between a family and their bank.

The realistic abuse is someone preparing a better-organised fraudulent claim,
which is a paper problem the institutions already have and already screen for.

### 10. How is this DPDP compliant?

Data minimisation is in the design rather than in a policy page. Account and
policy numbers are masked at the moment of reading, so the full number is never
stored. Family data stays in the browser, not on a server. Nothing is used to
train a model. Consent is asked per step, in the language the family chose, and
one button deletes everything.

If pressed on who the data fiduciary is: in the current prototype there is no
server-side store, so the question is largely moot; at pilot scale with an
institution or a state, the deploying partner is the fiduciary and we are the
processor. That is the honest answer and it shows you have thought past the demo.

### 11. How do you reach a family in a village who will never find your website?

You do not, and pretending otherwise is the weakest thing you could say.

Distribution is Common Service Centres. More than four lakh of them already sit
in villages doing exactly this kind of paperwork for a per service fee. The
operator is the user; the family is the beneficiary. That is how rural India
already reaches a government service, and it is why the first pilot is one
district with operators, not a launch.

WhatsApp is the second channel, for the same reason: it is where families
already are.

### 12. Is the "two AI debate" real, or is it a demo trick?

It is measurable, which is the only defence worth giving. We plant known
problems in evidence packets, a name spelled differently across documents, an
amount sitting just above the court threshold, a lapsed policy, and we measure
whether the Challenger finds them, against a single reviewer with no debate.

Those numbers are on the Transparency page and reproduced by `npm run eval`.
If the measurement is not filled in by the 27th, say that it is measured by a
script in the repository that the panel can run, and do not overclaim the result.

Also be ready to concede the limit: research on whether debate improves accuracy
is genuinely mixed. The strong claim is transparency, not accuracy. The family
can read why the system thinks what it thinks, and disagree with it.

### 13. What does one user cost you?

About twenty rupees of AI for a family with three documents and three claim
routes. That is arithmetic on token counts at published prices, not an estimate,
and the working is on the Proof page.

Against an average of ₹38,700 returned per family at Gujarat's camps, that is
roughly nineteen hundred rupees recovered per rupee of compute.

And it goes down, not up, with volume: overnight work moves to the Batch API at
half price, and routine reading of a clear printed passbook does not need the
largest model. The compute is not what makes this hard.

### 14. What is the hardest thing you actually solved?

Pick one and go deep rather than listing. The strongest candidate is keeping the
AI out of the legal decision while still using it for the parts it is good at,
because the obvious build is to ask the model for the answer and the obvious
build is the one that sends a widow to the wrong court.

Second candidate: making the same product work for someone who cannot read
comfortably, in two languages, on a 320 pixel screen, offline, with zero serious
accessibility violations. Say that you measured it rather than that you cared
about it.

### 15. You are one person. How does this become a team and a company?

Do not apologise for it. A solo developer shipping a deployed product, a public
API, an open corpus, a test suite and an audit harness is the point, not the
weakness.

The honest next step is not hiring engineers. It is one person who has actually
sat in a bank branch processing these claims, because the corpus is only as good
as the ground truth behind it.

### 16. Why not use an existing document AI vendor?

For the reading step, you could, and at scale you might. That step is a
commodity and the code path is one function.

The product is not the reading. It is what happens after: the rules, the route,
the checklist, the pack, and the argument about whether the route is right. No
vendor sells that, because it does not exist yet.

### 17. What would make you stop?

Answer it honestly, because a founder with no kill criterion reads as naive.

If a district pilot ran and families did not actually recover money, the theory
is wrong and no amount of product fixes it. The measurement is rupees reaching
families per week, not sign ups, which is why that is the only number the first
three months publishes.

### 18. What did you get wrong?

Have one real answer ready. A good one: the site published a single Lighthouse
performance score, and it turned out we had been quoting a desktop number and a
mobile number as if they were the same measurement. They are not close: the live
deployment scores 99 to 100 on desktop and 91 to 96 on a throttled phone. For a
product whose whole argument is that it is built for people on cheap phones,
quoting the desktop figure was the wrong number to be proud of.

We now publish both, three runs each, and the range rather than the best run.

It is a small thing, and that is exactly why it works. It shows the honesty is
operational rather than rhetorical.

### 19. How do you know any of your numbers are true?

Point at `npm run audit`. One command re-runs accessibility across every page in
both themes, Lighthouse three times, the tests, the production build, and every
route, then writes `docs/AUDIT-REPORT.md` with the date, the commit and anything
that failed.

Offer it as a challenge rather than a claim: everything on the site is
checkable, and the report records failures as readily as passes.

### 20. Why should we give this the prize over a more technically impressive project?

Do not compare yourself to anyone. Answer the underlying question, which is
whether this is real.

Something close to: this is deployed, the code is public, the tests run on every
push, the accessibility and performance numbers are reproducible by you, the
unit economics are arithmetic rather than a slide, and the rules are open for
anyone including our competitors. A family can use it today. The money is real
and the people it belongs to are real.

---

## What to fix before the 27th

**Talk to three families, or one bank branch officer.** Question 7 is the one
that can end the round, and it is the only one that cannot be answered by
writing more code. Three phone calls turns "not yet" into a quote on a slide,
and no other team will have one.

**Run `npm run eval`.** It needs the API key. Until then question 12 has to be
answered with a script rather than a result.

**Rehearse questions 2, 4, 7 and 20 out loud.** Those are the four where the
instinct is to oversell, and overselling in front of industry judges is the
fastest way to lose a room that was on your side.
