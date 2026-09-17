# Google Apps Script Kurulumu — /basvuru ve /bize-katilin backend'i

Bu doküman, `integrations/google-apps-script/Code.gs` dosyasını gerçek bir Google hesabında çalışır hale getirmek için **manuel olarak** (senin tarafından) yapılması gereken adımları anlatır. Apps Script projeleri Git'e bağlı değildir — bu repo'ya `git push` yapmak bir Apps Script'i deploy etmez.

Tahmini süre: 15-20 dakika.

---

## 1. Google Sheet'i oluştur

1. [sheets.google.com](https://sheets.google.com) → yeni boş bir spreadsheet oluştur.
2. Adını örneğin **"RTG Danışmanlık — Başvurular"** koy.
3. Adres çubuğundaki URL'den **Spreadsheet ID**'yi al:
   ```
   https://docs.google.com/spreadsheets/d/BURASI_SPREADSHEET_ID/edit
   ```
4. Sheet isimlerini kendin oluşturmana gerek yok — `Code.gs` ilk çalıştığında `LEADS` ve `MENTOR_APPLICATIONS` sheet'lerini (başlık satırıyla birlikte) otomatik oluşturur. İstersen boş "Sheet1"i silebilirsin.

## 2. Apps Script projesini oluştur

1. Spreadsheet açıkken: **Uzantılar → Apps Script**.
2. Açılan editördeki varsayılan `Code.gs` içeriğini tamamen sil.
3. Bu repodaki `integrations/google-apps-script/Code.gs` dosyasının **tüm içeriğini** kopyala, Apps Script editörüne yapıştır.
4. Projeyi kaydet (Ctrl/Cmd+S). Proje adını örneğin **"RTG Başvuru Backend"** yap.

## 3. Script Properties (SPREADSHEET_ID + secret)

1. Apps Script editöründe sol menüden **Project Settings** (dişli ikonu) → **Script Properties**.
2. **Add script property** ile iki değer ekle:
   - `SPREADSHEET_ID` → adım 1'de aldığın Spreadsheet ID.
   - `API_SECRET` → kendi oluşturacağın uzun rastgele bir string. Terminalde:
     ```bash
     openssl rand -hex 32
     ```
     komutuyla üretebilirsin. Bu değeri bir şifre yöneticisine kaydet — hem burada (Script Properties) hem Vercel'de (`GOOGLE_APPS_SCRIPT_SECRET`) **aynı** değer olacak.

**Bu secret'ı hiçbir zaman bu repo'ya commit etme, koda yazma veya paylaşma.**

## 4. Web App olarak deploy et

1. Apps Script editöründe sağ üstten **Deploy → New deployment**.
2. Deployment type: **Web app** seç (dişli ikonuna tıklayıp seçmen gerekebilir).
3. Ayarlar:
   - **Execute as:** `Me` (senin hesabın — script her zaman senin yetkinle çalışır, çağıran tarafın Google hesabı olması gerekmez).
   - **Who has access:** `Anyone` (Next.js sunucusu Google'a giriş yapmadan POST atacağı için bu şart — secret kontrolü zaten `doPost` içinde yapılıyor, bu yüzden herkese açık olması güvenlik açığı değil).
4. **Deploy** → Google seni yetkilendirmeni isteyecek (kendi projen olduğu için "Google doğrulamadı" uyarısı normal — **Advanced → Go to [proje adı] (unsafe)** ile devam et).
5. Deploy sonunda sana bir **Web App URL** verilecek, şuna benzer:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   Bu URL'i kopyala — bu, `GOOGLE_APPS_SCRIPT_URL` değerin.

**Not:** `Code.gs`'i ileride güncellersen, her seferinde **Deploy → Manage deployments → düzenle (kalem ikonu) → New version** yapman gerekir; URL aynı kalır ama kod güncellenmez, sen yeni bir version yayınlamazsan.

## 5. Vercel'e environment variable ekle

Vercel proje ayarları → **Environment Variables**:

| Key | Value | Environment |
|---|---|---|
| `GOOGLE_APPS_SCRIPT_URL` | adım 4'teki Web App URL | Production (+ Preview istersen) |
| `GOOGLE_APPS_SCRIPT_SECRET` | adım 3'teki `API_SECRET` ile **birebir aynı** değer | Production (+ Preview istersen) |

Bu ikisi `NEXT_PUBLIC_` önekli **değildir** — Vercel panelinde "sensitive/secret" olarak işaretleyebilirsin, tarayıcıya asla gönderilmezler.

Değişkenleri ekledikten sonra Vercel'de **Redeploy** yapman gerekir (env değişikliği otomatik yansımaz).

## 6. Gerçek uçtan uca test

1. `/basvuru` sayfasını aç, formu **açıkça test olduğu belli bir veriyle** doldur (ör. ad: `TEST RTG`, e-posta: `test@example.invalid`) — gerçek bir aday bilgisi kullanma.
2. Gönder.
3. RTG sitesinde "Teşekkürler" / başarı ekranını gör.
4. Google Sheet'i aç, **LEADS** sekmesinde yeni satırın gerçekten oluştuğunu doğrula:
   - `ID` sütunu `RTG-L-...` formatında dolu mu?
   - `Created At` doğru zaman damgası mı?
   - `Durum` = `Yeni` mi?
   - Girdiğin test verileri doğru sütunlara mı yazılmış?
5. Aynısını `/bize-katilin` için **MENTOR_APPLICATIONS** sekmesinde tekrarla.
6. Test satırlarını gerçek adaylarla karışmasın diye silebilir ya da "TEST" olarak işaretli bıraktığın için ayırt edebilirsin.

**Bu adım tamamlanmadan sistem "çalışıyor" sayılmamalıdır** — sadece HTTP 200 veya `ok:true` görmek yeterli değildir, Sheet'te gerçek satırı görmen gerekir.

## 7. Sheet'i operasyonel hale getir (opsiyonel ama önerilir)

- **Durum** sütununa: seç → Veri → Veri Doğrulama → açılır liste: `Yeni, İnceleniyor, İlk İletişim, Görüşme Planlandı, Görüşme Yapıldı, Takipte, Başvuru Sürecinde, Tamamlandı, Olumsuz`.
- Başlık satırını dondur: Görünüm → Dondur → 1 satır (Code.gs zaten bunu otomatik yapıyor).
- Filtre ekle: Veri → Filtre oluştur.
- **Şehir / Üniversite / Bölüm / Son İletişim / Sonraki Aksiyon / Notlar / Sorumlu / Görüşme Tarihi / Drive Folder / Meet Link** sütunları formdan gelmez, bilinçli olarak boş bırakılmıştır — bunlar CRM kullanımı sırasında elle (veya ileride ayrı bir otomasyonla) doldurulacak operasyonel alanlardır.

## 8. Bir şey ters giderse

- Formda "Başvuru şu anda tamamlanamadı" hatası görüyorsan: Vercel env değişkenlerini kontrol et, `API_SECRET` ile `GOOGLE_APPS_SCRIPT_SECRET`'ın birebir aynı olduğundan emin ol, deployment'ı yeniden yayınla.
- Apps Script tarafında hata ayıklamak için: Apps Script editöründe **Executions** (sol menü) sekmesinden son çalıştırmaların loglarını görebilirsin.
- Kod güncellediysen **New version** deploy etmeyi unutma (adım 4'teki not).
