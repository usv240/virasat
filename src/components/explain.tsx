"use client";

import { Fragment, useMemo } from "react";
import { GLOSSARY } from "@/lib/glossary";
import { Term } from "./term";

/**
 * Takes a sentence and explains the jargon in it, without anyone having to
 * mark the words up by hand.
 *
 * Much of the copy on this site lives in plain strings inside data arrays, so
 * wrapping each piece of jargon manually would mean rewriting those arrays as
 * JSX and remembering to do it again every time a sentence changes. Instead
 * this scans the string for anything the glossary knows about and wraps it.
 *
 * Two rules keep it from turning the page into a field of dotted underlines:
 *
 * - Only the first mention of a term in a given string is linked. Repeating
 *   the affordance in the same sentence adds noise, not help.
 * - Acronyms are matched case sensitively, so "MITRA" is explained but the
 *   word "mitra" inside ordinary prose is left alone.
 */

type Token = { alias: string; id: string; acronym: boolean };

const TOKENS: Token[] = GLOSSARY.flatMap((g) =>
  [g.term, ...(g.aliases ?? [])].map((alias) => ({
    alias,
    id: g.id,
    // Treat a short all-caps string as an acronym that must match exactly.
    acronym: /^[A-Z0-9 ()]+$/.test(alias) && alias.length <= 24,
  })),
)
  // Longest first, so "lakh crore" wins over "lakh" and "AI Review" over "debate".
  .sort((a, b) => b.alias.length - a.alias.length);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function Explain({ text }: { text: string }) {
  const parts = useMemo(() => {
    const used = new Set<string>();
    const out: (string | Token & { matched: string })[] = [];
    let rest = text;

    while (rest.length) {
      let best: { index: number; token: Token; matched: string } | null = null;
      for (const token of TOKENS) {
        if (used.has(token.id)) continue;
        const re = new RegExp(`\\b${escape(token.alias)}\\b`, token.acronym ? "" : "i");
        const m = re.exec(rest);
        if (m && (best === null || m.index < best.index)) best = { index: m.index, token, matched: m[0] };
      }
      if (!best) {
        out.push(rest);
        break;
      }
      if (best.index > 0) out.push(rest.slice(0, best.index));
      out.push({ ...best.token, matched: best.matched });
      used.add(best.token.id);
      rest = rest.slice(best.index + best.matched.length);
    }
    return out;
  }, [text]);

  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <Term key={i} id={p.id}>
            {p.matched}
          </Term>
        ),
      )}
    </>
  );
}
