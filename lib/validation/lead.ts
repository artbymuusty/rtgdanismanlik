import { z } from "zod";

export const leadSchema = z.object({
  stage: z.string().min(1),
  educationStatus: z.string().min(1),
  interestArea: z.string().min(1),
  languageLevel: z.string().min(1),
  target: z.string().min(1),
  timeline: z.string().min(1),
  message: z.string().max(2000).optional().default(""),

  firstName: z.string().trim().min(1, "Ad gerekli."),
  lastName: z.string().trim().min(1, "Soyad gerekli."),
  phone: z.string().trim().min(6, "Geçerli bir telefon numarası gir."),
  email: z.string().trim().email("Geçerli bir e-posta adresi gir."),
  preferredContact: z.enum(["whatsapp", "phone", "email"]),
  note: z.string().max(500).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
