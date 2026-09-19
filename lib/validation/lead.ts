import { z } from "zod";

const cefrLevel = z.enum(["undisclosed", "a1", "a2", "b1", "b2", "c1", "c2", "native"]);

export const leadSchema = z
  .object({
    stage: z.string().min(1),
    educationStatus: z.string().min(1),
    interestArea: z.string().min(1),

    /** English and German are asked and stored separately — never
     * combined into one "English B2 / German A2" string — so each can be
     * filtered/queried independently in the CRM. */
    englishLevel: cefrLevel,
    germanLevel: cefrLevel,

    target: z.string().min(1),
    timeline: z.string().min(1),

    /** Optional intake context for the consultant ahead of the first
     * call (background/experience/what they're hoping for) — distinct
     * from `message`, which is a question the applicant asks RTG. */
    background: z.string().max(2000).optional().default(""),
    message: z.string().max(2000).optional().default(""),

    /** How the applicant heard about RTG. "other" requires
     * referralSourceOther to be filled — enforced below and again in
     * Code.gs. */
    referralSource: z.enum([
      "instagram",
      "linkedin",
      "google_search",
      "university_campus",
      "friend_referral",
      "event_booth",
      "whatsapp",
      "youtube",
      "other",
    ]),
    referralSourceOther: z.string().max(200).optional().default(""),

    firstName: z.string().trim().min(1, "Ad gerekli."),
    lastName: z.string().trim().min(1, "Soyad gerekli."),
    phone: z.string().trim().min(6, "Geçerli bir telefon numarası gir."),
    email: z.string().trim().email("Geçerli bir e-posta adresi gir."),
    preferredContact: z.enum(["whatsapp", "phone", "email"]),
    note: z.string().max(500).optional().default(""),

    /** Client-generated once per form session (crypto.randomUUID()) and
     * reused across retries — lets the Apps Script backend recognize a
     * resubmitted request and avoid writing a duplicate Sheets row. */
    submissionId: z.string().min(1, "Geçersiz istek."),

    /** Hidden field real users never see or fill; a filled value means a
     * bot submitted the form. Checked after validation, before any network
     * call — see app/basvuru/actions.ts. */
    honeypot: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.referralSource === "other" && !data.referralSourceOther.trim()) {
      ctx.addIssue({ code: "custom", path: ["referralSourceOther"], message: "Lütfen kısaca belirt." });
    }
  });

export type LeadInput = z.infer<typeof leadSchema>;
