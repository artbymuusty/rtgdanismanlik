/**
 * Single source of truth for brand/business configuration. There is no
 * database dependency: changing a value here requires a redeploy.
 *
 * Every "real business value" field starts empty because the live
 * earlier configuration had nothing configured in them either — never
 * fabricate a placeholder WhatsApp number, e-mail, or social URL here.
 */
export const siteConfig = {
  /** Official brand name — shown exactly like this everywhere (header,
   * footer, page titles, share image, structured data). */
  name: "RTG Danışmanlık",
  shortName: "RTG",
  /** Canonical origin for canonical/hreflang/sitemap/OG URLs. Resolution order:
   * NEXT_PUBLIC_SITE_URL (the real domain — always wins) → the production
   * domain Vercel exposes to every build → a placeholder. Without the Vercel
   * step, a deployment with no env set would publish "example.com" to
   * search engines. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://rtgdanismanlik.example.com"),

  /** Empty means "not configured yet" — callers must skip rendering the
   * dependent UI rather than falling back to a placeholder. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  contactEmail: "",

  /** Legal/company identity shown on /gizlilik, /kvkk, /kullanim-sartlari.
   * Empty until a real company entity is registered — pages fall back to
   * `siteConfig.name` as the controller name, never an invented company. */
  companyName: "",
  companyAddress: "",
  taxOffice: "",
  taxNumber: "",
  mersisNo: "",
} as const;

/**
 * A working wa.me link, or `null` when no number is configured — callers
 * must skip rendering the CTA in that case, never fall back to a bare
 * "https://wa.me/".
 */
export function whatsappLinkFor(prefilledMessage?: string): string | null {
  const number = siteConfig.whatsappNumber.replace(/[^\d]/g, "");
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  return prefilledMessage ? `${base}?text=${encodeURIComponent(prefilledMessage)}` : base;
}

export interface SocialLinks {
  linkedinUrl: string;
  instagramUrl: string;
  xUrl: string;
  /** Which fields, if any, are the demo fallback below rather than a real
   * URL — callers use it to disclose that in the accessible name (see
   * Footer), never to hide the distinction. */
  demo: { linkedin: boolean; instagram: boolean; x: boolean };
}

const NO_DEMO = { linkedin: false, instagram: false, x: false };

/** Real accounts — empty until RTG has them. */
const REAL_SOCIAL_LINKS = {
  linkedinUrl: "",
  instagramUrl: "https://www.instagram.com/rtgedu/",
  xUrl: "",
};

/**
 * Independent of demo content (mentors/stories) — safe to leave "true" in
 * production. When no real LinkedIn/Instagram/X URL is set above, this
 * fills the footer's social icons with the platform's own homepage
 * instead of hiding them, so the feature is visible/clickable before real
 * accounts exist. Never fabricates an RTG account: the accessible name
 * always discloses "(örnek hesap)", and a real URL above always wins.
 */
const socialLinksDemoEnabled = process.env.NEXT_PUBLIC_SHOW_SOCIAL_LINKS === "true";

/** Real platform homepages — NOT RTG's accounts. */
const DEMO_SOCIAL_LINKS = {
  linkedinUrl: "https://linkedin.com",
  instagramUrl: "https://instagram.com",
  xUrl: "https://x.com",
};

export function getSocialLinks(): SocialLinks {
  if (!socialLinksDemoEnabled) {
    return { ...REAL_SOCIAL_LINKS, demo: NO_DEMO };
  }

  return {
    linkedinUrl: REAL_SOCIAL_LINKS.linkedinUrl || DEMO_SOCIAL_LINKS.linkedinUrl,
    instagramUrl: REAL_SOCIAL_LINKS.instagramUrl || DEMO_SOCIAL_LINKS.instagramUrl,
    xUrl: REAL_SOCIAL_LINKS.xUrl || DEMO_SOCIAL_LINKS.xUrl,
    demo: {
      linkedin: !REAL_SOCIAL_LINKS.linkedinUrl,
      instagram: !REAL_SOCIAL_LINKS.instagramUrl,
      x: !REAL_SOCIAL_LINKS.xUrl,
    },
  };
}
