# Adding an institution

Virasat knows the claim procedure for five institutions. There are thousands.

That gap does not close by us writing code. It closes by people who already
know a bank's process writing it down once, in a form a machine can follow. This
page is how.

You do not need to know TypeScript, and you do not need our permission.

## What a rule set is

A rule set is one institution's answer to a single question: given the family's
situation, which documents does this institution ask for, and in what order?

It is data, not code. Here is a whole one, trimmed to a single rule:

```json
{
  "institution": "State Bank of India",
  "assetType": "bank",
  "version": 3,
  "rules": [
    {
      "id": "SBI_NOMINEE_V1",
      "when": { "nomineePresent": true },
      "route": "nominee",
      "routeLabel": "Nominee claim",
      "documents": ["nominee_id", "nominee_address", "passbook_or_bond", "claim_form", "cover_letter", "cancelled_cheque"],
      "notes": "The nominee receives the money but holds it for the legal heirs under Indian law."
    }
  ]
}
```

The rules are read in order and the first one whose `when` matches is the answer.
Put the specific cases first and the general fallback last.

## Write one

1. Get the schema. It is generated from the same code that validates your file,
   so it cannot be out of date:

   ```sh
   curl https://virasat-indol.vercel.app/api/v1/rules/schema
   ```

2. Look at an existing set for the shape:

   ```sh
   curl https://virasat-indol.vercel.app/api/v1/rules/corpus
   ```

3. Write yours, then have the API check it before you show it to anyone:

   ```sh
   curl -X POST https://virasat-indol.vercel.app/api/v1/rules \
     -H "authorization: Bearer vs_test_demo" \
     -H "content-type: application/json" \
     --data @my-institution.json
   ```

   A valid file comes back with `"valid": true`. An invalid one comes back with
   the exact field and what is wrong with it.

4. Try it against a real situation in the app. Paste your rule set into the
   Bring Your Own Rules box on the Claim tab. The route you get is the route a
   family would get.

5. Open a pull request at
   [github.com/usv240/virasat](https://github.com/usv240/virasat), or just open
   an issue with the file attached if pull requests are not your thing.

## What makes a good rule set

**Write what the institution actually does, not what its website says.** If the
branch asks for an indemnity bond on a balance the circular says needs nothing,
the bond is the truth and the circular is not.

**Say where a document comes from.** `where` is the field a family reads when
they are standing in a queue. "Tehsildar or taluk office, usually 15 to 30 days"
helps. "As applicable" does not.

**Put the threshold in.** Most institutions change the route above some amount,
often ₹5,00,000. Getting that boundary wrong sends a family to the wrong court,
so it is the first thing a reviewer will check.

**Leave the hard case alone.** If you are not sure what happens when there is no
nominee and the amount is large, do not guess. Omit the rule. An unmatched
situation routes to needs-review, which is safe. A wrong rule is not.

## Licence

The corpus is MIT licensed. Contribute a rule set and it stays open, including
to banks, to government portals, and to anyone building something that competes
with us. That is the point. We would rather this became the standard than stayed
our advantage.
