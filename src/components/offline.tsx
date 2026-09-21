"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { usePrefs } from "./providers";

/**
 * Registers the service worker, and tells the visitor the truth when the
 * network goes.
 *
 * The honesty matters more than the caching. A family on 2G who taps a button
 * and sees nothing happen assumes the app is broken, or worse, assumes the
 * claim went through. So the bar says plainly which parts still work and which
 * are waiting for signal, rather than letting them guess.
 */
export function Offline() {
  const { t } = usePrefs();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      // Registered after load so it never competes with the first paint.
      const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register, { once: true });
    }

    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      // Bordered rather than filled: the warning colour is dark in the light
      // theme and light in the dark one, so no single text colour sits on it
      // with enough contrast in both.
      className="sticky top-0 z-40 flex items-center justify-center gap-2 border-b-2 border-warning bg-raised px-4 py-2 text-center text-sm font-medium text-text"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-warning" aria-hidden />
      <span>{t("offline.banner")}</span>
    </div>
  );
}
