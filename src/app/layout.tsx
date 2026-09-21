import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import { HelpButton } from "@/components/help-button";
import { Offline } from "@/components/offline";

// "swap" rather than "optional": measured over repeated Lighthouse runs the two
// scored the same, and swap guarantees the designed typeface actually renders
// rather than sometimes leaving a visitor on the fallback for the whole visit.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "600"],
  // Only needed once someone switches to Hindi. Preloading it on every page
  // makes it compete with the hero text for bandwidth on a slow connection.
  preload: false,
});

export const metadata: Metadata = {
  title: "Virasat: find and claim your family's money",
  description:
    "Take a photo of old papers. Virasat finds where your family's money is, explains what to do in your language, and fills the forms.",
  // Installable, and it keeps working when the signal goes. The families this
  // is for are on patchy 2G, not on the wifi it was built on.
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Virasat", statusBarStyle: "default" },
  icons: { icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }], apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1413" },
  ],
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `(function(){try{var t=localStorage.getItem("virasat.theme")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light");var l=localStorage.getItem("virasat.lang");if(l)document.documentElement.lang=l;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${devanagari.variable} h-full`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-raised focus:px-3 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>
          <Offline />
          <TopBar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <HelpButton />
        </Providers>
      </body>
    </html>
  );
}
