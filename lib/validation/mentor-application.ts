import { z } from "zod";

export const mentorApplicationSchema = z.object({
  firstName: z.string().trim().min(1, "Ad gerekli."),
  lastName: z.string().trim().min(1, "Soyad gerekli."),
  phone: z.string().trim().min(6, "Geçerli bir telefon numarası gir."),
  email: z.string().trim().email("Geçerli bir e-posta adresi gir."),
  germanyExperience: z.string().trim().min(10, "Almanya deneyimini birkaç cümleyle anlat."),
  motivation: z.string().trim().min(10, "Neden mentor olmak istediğini birkaç cümleyle anlat."),
  message: z.string().max(2000).optional().default(""),
});

export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;
