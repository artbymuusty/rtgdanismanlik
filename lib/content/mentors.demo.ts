import type { Mentor } from "./types";

/**
 * DEMO / PLACEHOLDER content — not a real mentor, never shown to real
 * visitors by default. Only renders when NEXT_PUBLIC_SHOW_DEMO_CONTENT=true,
 * and always with a visible "Örnek" label when it does (see
 * MentorProfile usage in app/mentorluk/page.tsx). Used to preview the
 * design before real mentor data exists in lib/content/mentors.ts.
 * Delete this file once real content makes it redundant.
 */
export const demoMentors: Mentor[] = [
  {
    id: "demo-mentor-1",
    name: "Örnek Mentor",
    role: "Eğitim Danışmanı",
    bio: "Almanya'da yüksek lisansını tamamladı ve bugün öğrencilerin başvuru ve vize sürecinde yanında oluyor.",
    germanyExperience: "6 yıl, Berlin",
    education: "TU Berlin — Yüksek Lisans",
    specialty: "Başvuru süreci ve vize hazırlığı",
    quote: "Görevimiz başvuru yapmak değil, doğru kararı vermeni kolaylaştırmak.",
  },
  {
    id: "demo-mentor-2",
    name: "Örnek Mentor",
    role: "Mentorluk Koordinatörü",
    bio: "Almanya'da lisans eğitimini tamamladıktan sonra Studienkolleg ve dil süreçlerinde öğrencilere yol gösteriyor.",
    germanyExperience: "5 yıl, Münih",
    education: "LMU München — Lisans",
    specialty: "Studienkolleg ve dil hazırlığı",
    quote: "En çok, birinin nereden başlayacağını bilmemesinin bir engel olmadığını hatırlatmayı seviyorum.",
  },
  {
    id: "demo-mentor-3",
    name: "Örnek Mentor",
    role: "Vize Süreç Danışmanı",
    bio: "Kendi vize sürecinde yaşadığı belirsizlikten yola çıkarak, öğrencilerin belge ve randevu takibini birlikte yürütüyor.",
    germanyExperience: "4 yıl, Hamburg",
    education: "Universität Hamburg — Yüksek Lisans",
    specialty: "Vize hazırlığı ve blocked account süreci",
    quote: "Küçük bir eksik süreci geciktirebiliyor; bu yüzden hiçbir detayı atlamıyoruz.",
  },
];
