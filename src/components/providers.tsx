"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { t as translate, type Lang } from "@/lib/i18n";
import { useLocalString } from "@/lib/use-local-storage";

type Theme = "system" | "light" | "dark";
type Mode = "simple" | "technical";

type Prefs = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const PrefsContext = createContext<Prefs | null>(null);

function applyTheme(t: Theme) {
  const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalString("virasat.theme", "system");
  const [mode, setMode] = useLocalString("virasat.mode", "simple");
  const [lang, setLang] = useLocalString("virasat.lang", "en");

  // Sync the document with the saved theme and language (external system, so an effect is right).
  useEffect(() => {
    applyTheme(theme as Theme);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Prefs>(
    () => ({
      theme: theme as Theme,
      setTheme: (v) => setTheme(v),
      mode: mode as Mode,
      setMode: (v) => setMode(v),
      lang: lang as Lang,
      setLang: (v) => setLang(v),
      t: (key) => translate(lang as Lang, key),
    }),
    [theme, mode, lang, setTheme, setMode, setLang],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside Providers");
  return ctx;
}
