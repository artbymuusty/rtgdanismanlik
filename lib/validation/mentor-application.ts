import { z } from "zod";

export const mentorApplicationSchema = z.object({
  firstName: z.string().trim().min(1, "Ad gerekli."),
  lastName: z.string().trim().min(1, "Soyad gerekli."),
  phone: z.string().trim().min(6, "Geçerli bir telefon numarası gir."),
  email: z.string().trim().email("Geçerli bir e-posta adresi gir."),
  germanyExperience: z.string().trim().min(10, "Almanya deneyimini birkaç cümleyle anlat.").max(3000),
  motivation: z.string().trim().min(10, "Neden mentor olmak istediğini birkaç cümleyle anlat.").max(3000),
  message: z.string().max(2000).optional().default(""),

  /** Client-generated once per form session (crypto.randomUUID()) and
   * reused across retries — lets the Apps Script backend recognize a
   * resubmitted request and avoid writing a duplicate Sheets row. */
  submissionId: z.string().min(1, "Geçersiz istek."),

  /** Hidden field real users never see or fill; a filled value means a
   * bot submitted the form. Checked after validation, before any network
   * call — see app/bize-katilin/actions.ts. */
  honeypot: z.string().optional().default(""),
});

export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;
