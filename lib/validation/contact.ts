import { z } from "zod";

/**
 * Stable, locale-independent keys — the UI shows a localized label per
 * lib/content/*.ts's contact.composer.categories, but this is what's
 * actually sent to (and validated by) the backend, so a category never
 * depends on the visitor's chosen site language.
 */
export const CONTACT_CATEGORIES = ["general", "consulting", "billing", "complaint", "technical", "website", "other"] as const;
export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const contactSchema = z.object({
  email: z.string().trim().min(1, "E-posta gerekli.").max(254, "E-posta çok uzun.").email("Geçerli bir e-posta adresi gir."),
  category: z.enum(CONTACT_CATEGORIES),
  subject: z.string().trim().min(1, "Konu gerekli.").max(160, "Konu çok uzun."),
  message: z.string().trim().min(1, "Mesaj gerekli.").max(5000, "Mesaj çok uzun."),

  /** Hidden field real visitors never fill — a filled value means a bot
   * submitted the form (same pattern as the lead/mentor forms). Checked
   * after validation, before any network call. */
  honeypot: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
