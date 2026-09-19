export type Lang = "en" | "hi";

export const LANGS: { code: Lang; label: string; speech: string }[] = [
  { code: "en", label: "English", speech: "en-IN" },
  { code: "hi", label: "हिन्दी", speech: "hi-IN" },
];

const dict: Record<Lang, Record<string, string>> = {
  en: {
    "nav.problem": "Problem",
    "nav.how": "How it works",
    "nav.try": "Try it",
    "nav.impact": "Impact",
    "nav.developers": "Developers",
    "nav.faq": "FAQ",
    "nav.judges": "For judges",
    "cta.try": "Try it now",
    "cta.try.sub": "no sign up",
    "cta.video": "Watch the 90 second video",
    "hero.title": "Find and claim your family's money.",
    "hero.sub":
      "Take a photo of old papers. Virasat finds where the money is, explains what to do in your language, and fills the forms.",
    "mode.simple": "Simple",
    "mode.technical": "Technical",
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "listen": "Listen",
    "stop": "Stop",
    "app.find": "Find",
    "app.claim": "Claim",
    "app.track": "Track",
    "app.vault": "Vault",
    "app.help": "Help",
  },
  hi: {
    "nav.problem": "समस्या",
    "nav.how": "यह कैसे काम करता है",
    "nav.try": "आज़माएँ",
    "nav.impact": "प्रभाव",
    "nav.developers": "डेवलपर",
    "nav.faq": "सवाल-जवाब",
    "nav.judges": "जजों के लिए",
    "cta.try": "अभी आज़माएँ",
    "cta.try.sub": "बिना साइन अप",
    "cta.video": "90 सेकंड का वीडियो देखें",
    "hero.title": "अपने परिवार का पैसा ढूँढें और पाएँ।",
    "hero.sub":
      "पुराने कागज़ों की फोटो लें। विरासत बताएगी पैसा कहाँ है, आपकी भाषा में समझाएगी क्या करना है, और फॉर्म भर देगी।",
    "mode.simple": "सरल",
    "mode.technical": "तकनीकी",
    "theme.system": "सिस्टम",
    "theme.light": "हल्का",
    "theme.dark": "गहरा",
    "listen": "सुनें",
    "stop": "रोकें",
    "app.find": "ढूँढें",
    "app.claim": "दावा",
    "app.track": "स्थिति",
    "app.vault": "तिजोरी",
    "app.help": "मदद",
  },
};

export function t(lang: Lang, key: string): string {
  return dict[lang]?.[key] ?? dict.en[key] ?? key;
}

export function speechLang(lang: Lang): string {
  return LANGS.find((l) => l.code === lang)?.speech ?? "en-IN";
}
