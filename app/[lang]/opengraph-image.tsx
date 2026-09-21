import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDictionary } from "@/lib/content";
import { fallbackLocale, htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const frauncesBold = readFile(join(process.cwd(), "assets/fraunces-600.woff"));
const frauncesItalic = readFile(join(process.cwd(), "assets/fraunces-italic-500.woff"));

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : fallbackLocale;
  const t = getDictionary(lang);
  const [bold, italic] = await Promise.all([frauncesBold, frauncesItalic]);
  // Upper-cased here (not with CSS) so Turkish "i" becomes "İ" and German "ß" becomes "SS".
  const eyebrow = t.meta.ogEyebrow.toLocaleUpperCase(htmlLang[lang]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF7F1",
          padding: "72px 84px",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", width: 10, height: 64, background: "#2E6156" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 4,
              color: "#8A6A26",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#1E2A22",
              maxWidth: 920,
            }}
          >
            {t.home.hero.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            fontFamily: "Fraunces Italic",
            fontWeight: 500,
            fontSize: 34,
            color: "#2E6156",
          }}
        >
          {siteConfig.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: bold, style: "normal", weight: 600 },
        { name: "Fraunces Italic", data: italic, style: "italic", weight: 500 },
      ],
    },
  );
}
