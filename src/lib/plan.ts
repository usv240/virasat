/**
 * How this reaches real families, who pays for it, and what happens next.
 *
 * Kept as data rather than prose inside a page because the same answers have
 * to appear on the home page, on the judge page and in the pitch. Written in
 * one place, they cannot drift into three slightly different stories.
 */

/** Who pays, given that the family never does. */
export const PAYERS: { who: string; what: string; why: string; status: string }[] = [
  {
    who: "Banks and insurers",
    what: "A fee per completed claim pack that arrives correct the first time.",
    why: "An institution already pays branch staff to handle these claims, and most of that time goes on packs that come back incomplete. A pack that is right on arrival is cheaper for them than the one they get today, and regulators already push them to bring unclaimed balances down.",
    status: "Not yet signed. This is the model we would take to a pilot, not an agreement we hold.",
  },
  {
    who: "Common Service Centres",
    what: "Virasat listed as one more service the operator can offer, earning the usual per service fee.",
    why: "More than four lakh of these centres already sit in villages doing exactly this kind of paperwork for a small fee. They are how rural India actually reaches a government service. We do not need families to find an app; we need operators to have one more thing on their screen.",
    status: "The obvious distribution path, and the one we would test first.",
  },
  {
    who: "State governments and the IEPF",
    what: "Tooling for the camps they already run.",
    why: "Gujarat's camps returned money to families at scale using volunteers and paper. The demand is proven and the budget already exists. What is missing is the software the volunteer sits in front of.",
    status: "Closest fit to work already happening.",
  },
];

/** The family pays nothing. Saying why, once, in the place people ask. */
export const FAMILY_PAYS =
  "A family never pays Virasat. A private agent typically takes a cut of whatever is recovered, which is exactly the tax on not knowing that this project exists to remove.";

/** What has to be true for this to work, including the parts we cannot control. */
export const DEPENDENCIES: { on: string; risk: string; answer: string }[] = [
  {
    on: "No access to private or government systems",
    risk: "Most ideas in this space die waiting for an integration nobody will grant a student team.",
    answer: "Virasat needs none. It reads papers the family already has and public portals anyone can open. Everything is submitted by the family, through the official channel, exactly as it is today.",
  },
  {
    on: "Handling personal documents lawfully",
    risk: "A service touching identity documents and account numbers is squarely inside the DPDP Act.",
    answer: "Data minimisation is the design, not a policy page: identifiers are masked at the moment of reading, family data stays in the browser, nothing is used for training, and one button deletes everything. Consent is asked for each step and is written in the language the family chose.",
  },
  {
    on: "Adding institutions without rewriting the product",
    risk: "If each new bank needs engineering, this stops at five institutions forever.",
    answer: "A rule set is a versioned file, validated against a published schema and served over the API. Adding an institution is adding data. Anyone can write one, and the endpoint will tell them whether it is valid.",
  },
  {
    on: "Being wrong safely",
    risk: "A confidently wrong legal route could cost a family months in the wrong court.",
    answer: "The AI never picks the route; a tested rule engine does. The Referee can only add risks or ask for a person to look, never lower a caution. Anything outside the rule files routes to needs-review instead of a guess.",
  },
];

/** Round 4 asks for future scope by name. This is it. */
export const FUTURE: { when: string; title: string; points: string[] }[] = [
  {
    when: "Next three months",
    title: "One district, measured in rupees returned",
    points: [
      "Run it with service centre operators and one bank branch in a single district.",
      "Publish one number every week: money actually reaching families, not sign ups.",
      "Watch where operators get stuck, because that is where the product is wrong.",
    ],
  },
  {
    when: "Six to twelve months",
    title: "Every institution in the state, by data not code",
    points: [
      "Open the rule corpus for contribution, with the schema and the validator already public.",
      "WhatsApp, because that is where families already are.",
      "More Indian languages, starting with the ones the pilot district actually speaks.",
      "An escalation path when an institution does not respond, since that is where families give up.",
    ],
  },
  {
    when: "Beyond",
    title: "The corpus becomes public infrastructure",
    points: [
      "Consent-based discovery through DigiLocker and the Account Aggregator framework, so a family stops having to remember what they owned.",
      "The claim rules adopted by whoever serves the family best, including the portals that already exist. We would rather be the standard than the site.",
      "Other countries run unclaimed property programmes with the same shape. The corpus travels; the app is the easy part.",
    ],
  },
];
