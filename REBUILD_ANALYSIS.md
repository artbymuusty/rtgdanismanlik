# REBUILD_ANALYSIS.md

Kaynak proje: `education-mentoring` (https://github.com/artbymuusty/education-mentoring), Next.js 16.3.4 + Supabase. Bu doküman, o projenin görsel/UX/mimari envanterini çıkarır; yeni `rtgdanismanlik` projesi bu envanteri referans alarak inşa edilecektir. Hiçbir alan varsayılmamıştır — her madde kaynak kod veya canlı Supabase veritabanı sorgusuyla doğrulanmıştır.

## 1. Stack ve sürümler

| Alan | Değer |
|---|---|
| Next.js | 16.3.4 (App Router) |
| React / react-dom | 19.2.8 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 (`@tailwindcss/postcss`) |
| Animasyon | framer-motion ^13.2.0 |
| Validasyon | zod ^4.6.2 |
| Harita görseli | dotted-map ^3.1.0 (client-side, harici API çağrısı yok) |
| Backend | @supabase/ssr ^0.12.7, @supabase/supabase-js ^2.116.0 |
| Package manager | npm (lockfileVersion 3) |
| Node gereksinimi | >=20.9.0 (Next.js engines alanı) |

## 2. Route envanteri (gerçek isimler)

```
/
/nasil-yardimci-oluyoruz
/mentorluk
/fiyatlar
/bize-katilin
/ogrenci-hikayeleri
/hakkimizda
/sss
/iletisim
/basvuru
/gizlilik
/kvkk
/kullanim-sartlari
/admin            (login, leads, mentor-applications, settings)
```

Route Handler (`app/api/*`) yok. Tüm sunucu mantığı Server Actions üzerinden yürüyor.

## 3. Design tokens (`app/globals.css`)

```css
--color-ink: #1e2a22;
--color-paper: #faf7f1;
--color-paper-raised: #f3eee3;
--color-accent: #2e6156;      /* pine */
--color-accent-ink: #f5f1e6;
--color-gold: #8a6a26;
--color-line: #e1dacb;
--color-muted: #6b6459;
--color-danger: #9c4a3c;
```

Fontlar (`next/font/google`, `app/layout.tsx`): Fraunces (display, normal+italic), Public Sans (body, 400/500/600/700), IBM Plex Mono (mono, 400/500). `@theme inline` ile `--font-display/--font-body/--font-mono` olarak Tailwind'e bağlanıyor.

Global davranış: `html{scroll-behavior:smooth}`, `::selection` accent renkli, `:focus-visible` 2px accent outline, `prefers-reduced-motion: reduce` altında tüm animasyon/transition süreleri `.01ms`'e düşüyor.

## 4. Animasyon ve interaction envanteri

| Yer | Davranış | Timing/easing | Trigger |
|---|---|---|---|
| `components/ui/Reveal.tsx` | Tek paylaşılan section-reveal primitive'i: fade + 14px yukarı kayma | `duration:0.6, ease:[0.22,1,0.36,1]` | `useInView({once:true, amount:0.2})`, `useReducedMotion()` ile tam bypass (düz `div` render) |
| `components/layout/MobileMenu.tsx` | Açılış/kapanış: `scale-95/opacity-0 → scale-100/opacity-100` | `duration-200 ease-out` | state toggle; Escape tuşu ve dışarı tıklama ile kapanır, Escape'te focus toggle butonuna döner |
| `components/layout/Header.tsx` "Diğer" dropdown | `invisible/opacity-0/-translate-y-1 → visible/opacity-100/translate-y-0` | `duration-150` | `group-hover` + `group-focus-within` (mouse ve klavye için ayrı ayrı çalışır) |
| Footer sosyal ikonlar | hover: `-translate-y-0.5`, active: `scale-95` | `duration-200 ease-out` | CSS `:hover`/`:active`, `motion-reduce:` varyantlarıyla iptal |
| Buton/aktif link | `active:opacity-60` / `active:scale-[0.96]` (tap feedback) | `duration-150` (MobileMenu toggle) | CSS |
| `AssessmentFlow.tsx` ilerleme çubuğu | genişlik `transition-all` | Tailwind default | adım değişince |

Framer-motion sadece `Reveal.tsx` içinde kullanılıyor — geri kalan tüm etkileşimler saf CSS transition. Bu, port işini kolaylaştırıyor: yeni projede aynı iki bağımlılık (framer-motion + Tailwind transition utility'leri) yeterli.

## 5. Component envanteri

```
components/
  admin/            AdminLoginForm, AdminNav, SettingsField      → TAŞINMAYACAK (admin kaldırılıyor, CP1 kararı)
  assessment/       AssessmentFlow                                → CP3/CP5, submit ucu Apps Script'e bağlanacak
  layout/           Footer, Header, MobileMenu, NavLink           → CP2, birebir
  mentorship/       MentorProfile                                 → CP3
  recruitment/      JoinUsCta, MentorApplicationForm               → CP3/CP5
  sections/         FaqPreview, FinalCta, Hero, HowWeWork,
                    HumanConnection, Journey, MentorshipTeaser,
                    ServicesOverview, StageSelector,
                    StudentStories, VisualStorytelling             → CP2 (homepage)
  stories/          FeaturedStudentStory, StudentStoryCard,
                    StudentStoryCarousel                            → CP3
  ui/               Avatar, Button, Card, Container,
                    EditorialPhoto, Reveal, SectionHeading,
                    SocialIcon, WorldMap                            → CP2
```

## 6. İçerik sistemi (`lib/content/*`)

- Tek dil: Türkçe. `lib/content/tr.ts` (642 satır) + `lib/content/types.ts` (278 satır, `Dictionary` tipi) + `lib/content/index.ts` (`getDictionary()`).
- `lib/content/mentors.ts` / `lib/content/stories.ts`: **bilinçli olarak boş diziler** — gerçek mentor/öğrenci yok, uydurulmamış.
- `lib/content/mentors.demo.ts` / `lib/content/stories.demo.ts` + `lib/content/demo.ts` (`NEXT_PUBLIC_SHOW_DEMO_CONTENT` flag'i): açıkça "Örnek" etiketli demo kartları — dürüst bir pattern, aynen taşınacak.

## 7. Form akışları — gerçek alanlar (varsayım yok, `lib/validation/*.ts` + component'lerden)

**`/basvuru`** — çok adımlı sihirbaz (`AssessmentFlow.tsx`), adımlar `Dictionary.assessment.steps`'ten geliyor:
```
stage, educationStatus, interestArea, languageLevel, target, timeline,
message (opsiyonel, max 2000)
--- iletişim adımı ---
firstName, lastName, phone (min 6), email,
preferredContact: "whatsapp" | "phone" | "email",
note (opsiyonel, max 500)
```
Kullanıcının orijinal promptunda önerilen "yaş / şehir tercihi / üniversite-bölüm / bütçe" alanları **bu formda yok** — eklenmeyecek.

**`/bize-katilin`** (mentor başvurusu, `lib/validation/mentor-application.ts`):
```
firstName, lastName, phone (min 6), email,
germanyExperience (min 10 karakter), motivation (min 10 karakter),
message (opsiyonel, max 2000)
```

## 8. Supabase bağlantı noktaları (kaldırılacak envanteri)

| Dosya | Rol |
|---|---|
| `lib/supabase/client.ts` | Browser client (`createBrowserClient`) — sadece `AdminLoginForm.tsx` kullanıyor |
| `lib/supabase/server.ts` | Server client, cookie tabanlı session |
| `lib/supabase/require-admin.ts` | `/admin/*` sayfalarında auth+role guard |
| `lib/supabase/types.ts` | DB tipleri |
| `proxy.ts` | Next 16'nın middleware karşılığı — sadece `/admin/:path*` için session cookie yeniliyor |
| `app/admin/**/actions.ts` (4 dosya) | Admin CRUD Server Actions |
| `app/basvuru/actions.ts`, `app/bize-katilin/actions.ts` | Lead/mentor-application insert — CP5'te Apps Script'e taşınacak |
| `lib/site-settings.ts` | `unstable_cache`+`revalidateTag` ile DB'den site ayarı okuma — CP1 kararınca statik `lib/site-config.ts`'e dönüşecek |
| `supabase/migrations/*.sql` (4 dosya) | Şema — yeni projeye taşınmayacak |

**Canlı veri kontrolü (Supabase MCP ile sorgulandı, proje id `lnajnmwmdpiukkxtlshi`):** `site_settings` ve `social_links` tabloları tek satırlık singleton kayıtları içeriyor ama **tüm alanlar `null`** (whatsapp, e-posta, şirket bilgisi, LinkedIn/Instagram/X hiçbiri girilmemiş). `leads` tablosu 0 satır. Yani taşınacak gerçek bir iletişim/sosyal medya değeri yok — yeni projede de bu alanlar boş başlayacak, uydurulmayacak.

## 9. Environment variables (mevcut proje)

| Değişken | Not |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Kaldırılacak |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kaldırılacak |
| `NEXT_PUBLIC_SITE_URL` | Korunacak (fallback domain deseni) |
| `NEXT_PUBLIC_SHOW_DEMO_CONTENT` | Korunacak |
| `NEXT_PUBLIC_SHOW_SOCIAL_LINKS` | Korunacak (demo sosyal link fallback flag'i) |

## 10. SEO / metadata envanteri

- `app/layout.tsx`: `generateMetadata()` — `metadataBase`, title template, OpenGraph, Twitter card, `robots:{index:true,follow:true}`.
- `app/sitemap.ts`: route listesi + `resolveSiteUrl()`.
- `app/robots.ts`: `/admin` disallow (admin kaldırılınca bu satır da kalkacak).
- `app/opengraph-image.tsx`: `next/og` + Node `fs` ile build-time font okuma, dinamik OG görseli.
- `lib/structured-data.ts`: Organization JSON-LD — **sadece gerçekten configure edilmiş alanları içerir**, demo sosyal linkleri `sameAs`'a asla eklemiyor (bilinçli tasarım, korunacak).

## 11. Accessibility envanteri

- Skip link (`#main-content`) `app/layout.tsx`.
- `NavLink.tsx`: gerçek `aria-current="page"`.
- `MobileMenu.tsx`: `aria-expanded`, `aria-label` (aç/kapat), Escape ile kapanma + focus dönüşü, dışarı tıklamayla kapanma.
- Header dropdown: `aria-haspopup`, `group-focus-within` (klavye erişimi mouse'tan ayrı sağlanıyor).
- Form alanları: her input'ta gerçek `<label htmlFor>`, hata mesajlarında `role="alert"`.
- Sosyal ikonlar: `aria-label`+`title`, demo hesaplarda "(örnek hesap)" açıkça belirtiliyor.
- Reduced motion: hem Tailwind `motion-reduce:` varyantları hem global CSS fallback hem de `Reveal.tsx`'te programatik bypass — üç katmanlı.

## 12. CP1 mimari kararları (plan dosyasıyla birebir, referans için burada da özetleniyor)

1. `/admin` bu rebuild'e taşınmayacak; CRM işlevi Google Sheets'e devrediliyor.
2. `/basvuru` ve `/bize-katilin` submit uçları Google Apps Script Web App'e bağlanacak (Google Forms'a yönlendirme yok, mevcut UI korunuyor).
3. `lib/site-settings.ts` (Supabase+cache) yerine statik `lib/site-config.ts` (typed config, env'den okunan `NEXT_PUBLIC_WHATSAPP_NUMBER` dahil) gelecek — değişiklik artık redeploy gerektirecek, bu bilinen bir trade-off.
4. Gerçek WhatsApp numarası / e-posta / sosyal linkler şu an hiçbir yerde mevcut değil (madde 8) — yeni proje de boş başlayacak, kullanıcı gerçek değerleri kendi girecek.

Tam checkpoint planı ve gerekçeler için: `/Users/muusty/.claude/plans/hidden-splashing-lampson.md` (onaylanmış plan).
