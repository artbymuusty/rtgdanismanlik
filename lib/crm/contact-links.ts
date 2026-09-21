/**
 * Quick-action links for the lead detail drawer. Pure and framework-free so
 * they're usable from both the client component and node:test. These are
 * NOT the public site's `whatsappLinkFor` (lib/site-config.ts) — that one
 * builds a link to message RTG itself; this messages the LEAD.
 */
export function buildMailto(email: string): string | null {
  const trimmed = email.trim();
  return trimmed ? `mailto:${trimmed}` : null;
}

export function buildTel(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function buildWhatsAppLink(phone: string): string | null {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

/** Only ever renders an already-https:// Drive Folder value (the same rule
 * Code.gs's crmValidateField enforces before it's ever stored), so a
 * javascript: URL can never reach an href here even if validation were
 * somehow bypassed upstream. */
export function safeDriveLink(url: string): string | null {
  const trimmed = url.trim();
  return /^https:\/\//i.test(trimmed) ? trimmed : null;
}
