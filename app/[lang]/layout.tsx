import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/lib/content";
import { htmlLang, locales, ogLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { siteConfig, getSocialLinks } from "@/lib/site-config";
import { getOrganizationJsonLd } from "@/lib/structured-data";

// "latin-ext" is required for Turkish: ş Ş ğ Ğ İ ı are not in the plain
// "latin" subset, so without it the browser draws them from a fallback font.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f1",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// No `dynamicParams = false` here on purpose: it would also stop the catch-all
// page below from rendering the localized 404. An unsupported language is
// rejected by getLang() (a 404) instead, and proxy.ts never lets one through
// in normal navigation.

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).meta;

  return {
    metadataBase: new URL(siteConfig.url),
    ...pageMetadata(lang, "home", { title: t.defaultTitle, description: t.defaultDescription }),
    title: { default: t.defaultTitle, template: t.titleTemplate },
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      siteName: siteConfig.name,
      title: t.defaultTitle,
      description: t.defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: t.defaultTitle,
      description: t.defaultDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LangParams;
}) {
  const lang = await getLang(params);
  const t = getDictionary(lang);
  const social = getSocialLinks();

  return (
    <html
      lang={htmlLang[lang]}
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationJsonLd(social, siteConfig.url, t.meta.tagline)),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          {t.common.skipToContent}
        </a>
        <Header lang={lang} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
