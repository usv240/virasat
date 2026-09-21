"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { glossaryHref, glossaryLookup } from "@/lib/glossary";

/**
 * An inline word that explains itself.
 *
 * Wrap any piece of jargon and the reader gets the glossary definition on
 * hover, on keyboard focus, and on tap. One definition lives in the glossary
 * module, so the tooltip and the glossary page can never drift apart.
 *
 * Three details that matter:
 *
 * - It is a button, not a div with a title attribute. A title attribute never
 *   appears for keyboard or touch users, and screen readers treat it
 *   inconsistently.
 * - Hover opens it, but hover alone is never the only way in. Focus opens it
 *   too, and a tap toggles it, which is what a phone user gets.
 * - The word itself stays readable. A dotted underline is the affordance
 *   rather than a colour change, so the sentence still scans normally.
 */
export function Term({ id, children, className }: { id: string; children?: React.ReactNode; className?: string }) {
  const entry = glossaryLookup(id);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const tipId = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPinned(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // An unknown id should be loud in development and invisible in production,
  // never a broken-looking word in the middle of a sentence.
  if (!entry) {
    if (process.env.NODE_ENV !== "production") console.warn(`<Term> has no glossary entry for "${id}"`);
    return <>{children ?? id}</>;
  }

  return (
    <span
      ref={ref}
      className="relative inline-block"
      // The hover handlers belong on the wrapper, not the button. If they sat
      // on the button, moving the pointer towards the glossary link inside the
      // tooltip would close the tooltip before it could be clicked.
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => !pinned && setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={() => !pinned && setOpen(false)}
        onClick={() => {
          setPinned((v) => !v);
          setOpen(true);
        }}
        className={clsx(
          // Padding lifts the hit area to the 24px WCAG 2.2 minimum without
          // changing where the word sits on the line.
          "cursor-help py-1 underline decoration-dotted decoration-from-font underline-offset-4",
          "[transition:color_140ms_var(--ease-out)] hover:text-brand-strong focus-visible:text-brand-strong",
          className,
        )}
      >
        {children ?? entry.term}
        <span className="sr-only"> (what this means)</span>
      </button>
      <span
        id={tipId}
        role="tooltip"
        className={clsx(
          "absolute left-1/2 top-full z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2",
          "rounded-lg border border-border bg-raised p-3 text-left text-sm font-normal normal-case leading-normal tracking-normal text-text shadow-[var(--shadow-3)]",
          !open && "hidden",
        )}
      >
        <span className="block font-semibold text-brand">{entry.term}</span>
        <span className="mt-1 block">{entry.def}</span>
        <Link href={glossaryHref(entry)} className="mt-2 inline-block text-brand underline">
          See it in the glossary
        </Link>
      </span>
    </span>
  );
}
