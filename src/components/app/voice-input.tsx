"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Mic, Square } from "lucide-react";
import { usePrefs } from "@/components/providers";
import { speechLang } from "@/lib/i18n";

type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

const noop = () => () => {};
const isSupported = () => {
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
};

/** Tap to speak, tap again to stop. Uses the browser's speech recognition (Chrome, Android). */
export function VoiceInput({ onText, label = "Speak" }: { onText: (text: string) => void; label?: string }) {
  const { lang } = usePrefs();
  const [listening, setListening] = useState(false);
  const supported = useSyncExternalStore(noop, isSupported, () => false);
  const recRef = useRef<Rec | null>(null);

  const toggle = () => {
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = speechLang(lang);
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(" ");
      onText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  if (!supported) return <span className="text-xs text-muted">Voice input needs Chrome or an Android browser.</span>;
  return (
    <button type="button" onClick={toggle} aria-pressed={listening} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-brand hover:bg-brand-soft">
      {listening ? <Square className="h-4 w-4" aria-hidden /> : <Mic className="h-4 w-4" aria-hidden />}
      {listening ? "Listening... tap to stop" : label}
    </button>
  );
}
