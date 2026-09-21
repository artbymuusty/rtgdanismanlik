import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

// A sibling of app/[lang], not a child of it — it needs its own root
// <html>/<body> and its own font loading. Same three families and the same
// CSS custom properties as the public site (paper/pine/gold), so the CRM
// reads as the same product, just denser and without the marketing chrome.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });
const publicSans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin", "latin-ext"], weight: ["400", "500"] });

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#faf7f1" };

// Never indexed, never followed — this holds personal data behind a login,
// and app/robots.ts separately disallows /crm for well-behaved crawlers.
export const metadata: Metadata = {
  title: "RTG CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="h-full bg-paper font-body text-ink">{children}</body>
    </html>
  );
}
