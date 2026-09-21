/**
 * The Virasat mark: a tin box (the box of old papers every family has) with a
 * coin rising out of it. Drawn on a 24 grid so the strokes stay crisp at any
 * size, and it inherits the text colour so it works on every surface.
 */
export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="2.75" y="10.25" width="18.5" height="11" rx="2.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.75 14.25h6.1a1 1 0 0 1 1 1v.2a2.15 2.15 0 0 0 4.3 0v-.2a1 1 0 0 1 1-1h6.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5.4" r="2.9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.9v3M10.9 5.4h2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
