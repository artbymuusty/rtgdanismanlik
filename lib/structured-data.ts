import { siteConfig, type SocialLinks } from "@/lib/site-config";

/**
 * Serializes a JSON-LD object for embedding via
 * `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ... }} />`.
 * Escapes "<" so a value can never prematurely close the script tag — the
 * browser's HTML parser looks for the raw text "</script" to end a
 * <script> element regardless of its `type` attribute, so a literal
 * "</script>" inside the JSON string would otherwise break out of it and
 * inject arbitrary HTML. Output is otherwise identical to JSON.stringify —
 * every "<" is replaced by its JSON/Unicode escape sequence instead, a
 * no-op for any JSON/schema.org consumer, including search engines — so
 * this changes nothing about what's actually published as structured
 * data. Every
 * current caller (this file, app/[lang]/sss/page.tsx) only ever passes
 * static, developer-authored content — never user input or CRM/Sheets
 * data — so this is defense-in-depth for if that ever changes, not a fix
 * for something exploitable today.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Organization JSON-LD for the homepage. Only includes fields that are
 * actually configured — never fabricates a logo, phone number, or social
 * profile that doesn't exist yet.
 */
export function getOrganizationJsonLd(social: SocialLinks, resolvedUrl: string, tagline: string) {
  // Demo-fallback URLs (see getSocialLinks) are real platform homepages, not
  // RTG's accounts — they must never enter search-engine-facing sameAs data.
  const sameAs = [
    social.demo.linkedin ? null : social.linkedinUrl,
    social.demo.instagram ? null : social.instagramUrl,
    social.demo.x ? null : social.xUrl,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: resolvedUrl,
    description: tagline,
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
