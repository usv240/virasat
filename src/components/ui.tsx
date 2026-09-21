"use client";

import { clsx } from "clsx";
import { Info, X, CheckCircle2, AlertTriangle, HelpCircle, Volume2, Square } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePrefs } from "./providers";
import { speechLang } from "@/lib/i18n";

/* ---------- Button ---------- */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "md" | "lg";
  loading?: boolean;
};
export function Button({ variant = "primary", size = "md", loading, className, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={clsx(
        "press inline-flex items-center justify-center gap-2 rounded-lg font-semibold min-h-11 px-4 [transition:background-color_160ms_var(--ease-out),color_160ms_var(--ease-out),filter_120ms_var(--ease-out),box-shadow_160ms_var(--ease-out)]",
        size === "lg" && "min-h-13 px-6 text-lg",
        variant === "primary" && "bg-brand text-brand-contrast shadow-[var(--shadow-1)] hover:brightness-110 hover:shadow-[var(--shadow-2)]",
        variant === "secondary" && "border border-border bg-raised text-text hover:border-brand/40 hover:bg-surface",
        variant === "quiet" && "text-brand hover:bg-brand-soft",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        (rest.disabled || loading) && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {children}
    </button>
  );
}

/* ---------- Card ---------- */
export function Card({ className, children, tone = "raised", interactive }: { className?: string; children: React.ReactNode; tone?: "raised" | "surface" | "brand" | "accent"; interactive?: boolean }) {
  return (
    <div
      className={clsx(
        "rounded-card border border-border p-5 surface-raised",
        tone === "raised" && "bg-raised",
        tone === "surface" && "bg-surface",
        tone === "brand" && "brand-scope bg-brand text-brand-contrast border-brand dark:bg-[#0c2a2b] dark:border-[#1f5152]",
        tone === "accent" && "bg-accent-soft border-accent-soft",
        interactive && "surface-interactive",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Info button (toggletip) ---------- */
export function InfoButton({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  return (
    <span ref={ref} className="relative inline-block align-middle">
      <button
        type="button"
        aria-label={`More about ${label}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 -m-3 items-center justify-center text-info hover:text-brand"
      >
        <Info className="h-5 w-5" aria-hidden />
      </button>
      <span
        id={id}
        role="status"
        className={clsx(
          "absolute left-1/2 z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-border bg-raised p-3 text-sm text-text shadow-[var(--shadow-3)]",
          !open && "hidden",
        )}
      >
        {open && (
          <>
            <span className="flex items-start justify-between gap-2">
              <span className="font-semibold">{label}</span>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="-m-1 p-1 text-muted hover:text-text">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </span>
            <span className="mt-1 block font-normal leading-relaxed">{children}</span>
          </>
        )}
      </span>
    </span>
  );
}

/* ---------- Source badge ---------- */
export function SourceBadge({ kind, href }: { kind: "public" | "sample" | "yours"; href?: string }) {
  const { t } = usePrefs();
  const text = t(`badge.${kind}`);
  const cls = clsx(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
    kind === "public" && "border-success/40 text-success",
    kind === "sample" && "border-warning/40 text-warning",
    kind === "yours" && "border-info/40 text-info",
  );
  return href ? (
    <a href={href} className={cls} target="_blank" rel="noreferrer">
      {text}
    </a>
  ) : (
    <span className={cls}>{text}</span>
  );
}

/* ---------- Confidence ---------- */
export function Confidence({ level }: { level: "high" | "medium" | "low" }) {
  const { t } = usePrefs();
  const Icon = level === "high" ? CheckCircle2 : level === "medium" ? HelpCircle : AlertTriangle;
  const color = level === "high" ? "text-success" : level === "medium" ? "text-warning" : "text-danger";
  return (
    <span className={clsx("inline-flex items-center gap-1 text-sm font-medium", color)}>
      <Icon className="h-4 w-4" aria-hidden />
      {t(`debate.confidence.${level}`)}
    </span>
  );
}

/* ---------- Stat ---------- */
export function Stat({ value, label, source, sourceHref, tone }: { value: string; label: string; source?: string; sourceHref?: string; tone?: "brand" }) {
  return (
    <Card tone={tone === "brand" ? "brand" : "raised"} className="flex flex-col gap-2">
      <div className={clsx("text-3xl font-semibold tabular tracking-[-0.02em]", tone === "brand" ? "text-accent" : "text-brand")}>{value}</div>
      <div className={clsx("text-sm", tone === "brand" ? "text-brand-contrast/90" : "text-text")}>{label}</div>
      {source && (
        <a href={sourceHref ?? "/references"} className={clsx("text-xs underline", tone === "brand" ? "text-brand-contrast/70" : "text-muted")}>
          Source: {source}
        </a>
      )}
    </Card>
  );
}

/* ---------- Listen (browser text to speech) ---------- */
export function Listen({ text, className }: { text: string; className?: string }) {
  const { lang, t } = usePrefs();
  const [speaking, setSpeaking] = useState(false);
  const supported = useSyncExternalStore(
    () => () => {},
    () => "speechSynthesis" in window,
    () => false,
  );
  const toggle = () => {
    if (!supported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang(lang);
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx("inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-brand hover:bg-brand-soft", className)}
      aria-pressed={speaking}
    >
      {speaking ? <Square className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      {speaking ? t("stop") : t("listen")}
    </button>
  );
}

/* ---------- Section ---------- */
export function Section({ id, eyebrow, title, children, className, tone, h1 }: { id?: string; eyebrow?: string; title: React.ReactNode; children: React.ReactNode; className?: string; tone?: "surface"; h1?: boolean }) {
  const Heading = h1 ? "h1" : "h2";
  return (
    <section id={id} className={clsx("scroll-mt-20 py-16 lg:py-24", tone === "surface" && "bg-surface", className)}>
      <div className="mx-auto w-full max-w-6xl px-4">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
        <Heading className="text-3xl lg:text-4xl">{title}</Heading>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/* ---------- Technical panel (shown only in Technical mode) ---------- */
export function Technical({ title = "Under the hood", children }: { title?: string; children: React.ReactNode }) {
  const { mode } = usePrefs();
  if (mode !== "technical") return null;
  return (
    <div className="mt-6 rounded-lg border border-dashed border-border bg-surface p-4 text-sm">
      <p className="mb-2 font-semibold text-muted">{title}</p>
      <div className="space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}
