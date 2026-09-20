# LEADS_RAW / LEADS_CRM — Canlı Migration Kurulum Rehberi

Bu doküman, `integrations/google-apps-script/Code.gs`'in yeni LEADS_RAW/LEADS_CRM mimarisini **canlı** Google Sheet'e uygulamak için gereken adımları anlatır. Bu dosyanın yazıldığı anda **hiçbir canlı işlem yapılmamıştır** — hepsi senin onayınla, kontrollü şekilde yapılacak.

Sıra önemli: adımları atlama veya sırayı değiştirme.

## 0. Ön kontrol — canlı `LEADS` sekmesinde ne var? (yapıldı)

`LEADS` sekmesinde 27 kolonluk eski header var, 2. satırdan itibaren hiçbir veri satırı yok — **DURUM A** (basit, veri kaybı riski olmayan migration).

## 1. Google Sheet yedeği

Google Sheet'te **Dosya → Kopya oluştur** — tüm spreadsheet'in bağımsız bir kopyasını oluşturur. Bir şey ters giderse anında geri dönüş imkanı sağlar.

## 2. Güncellenmiş Code.gs'i yapıştır

`integrations/google-apps-script/Code.gs`'in **tamamını** kopyala, Apps Script editöründeki mevcut kodun üzerine yapıştır, kaydet (Ctrl/Cmd+S).

## 3. `setupRTGCRM()`'i BİR KEZ çalıştır

Apps Script editöründe üstteki fonksiyon açılır listesinden **`setupRTGCRM`**'i seç, **Run**'a bas (ilk çalıştırmada ek yetki isteyebilir, kendi hesabınla onayla).

Bu fonksiyon **tek başına** şunları yapar (kodun kendi güvenlik kontrolleriyle):
- `LEADS` sekmesini kontrol eder; veri satırı **varsa hiçbir şeye dokunmadan durur** (`abort_data_present` hatası döner) — bizim durumumuzda veri olmadığı için bu adım sorunsuz geçecek.
- `LEADS` → `LEADS_RAW` olarak yeniden adlandırır.
- `LEADS_RAW` header'ını yeni 20 kolonluk şemaya günceller (eski 27 kolonun fazladan 7'sini de temizler).
- `LEADS_CRM` sekmesini 23 kolonluk header'la oluşturur.
- `TEAM` sekmesini sadece `İsim` başlığıyla oluşturur (isim eklemez).
- `LEADS_CRM`'in "Sorumlu" ve "Durum" kolonlarına Data Validation kurallarını uygular ("Girişi reddet" aktif).

**İdempotent'tir** — yanlışlıkla iki kez çalıştırırsan hiçbir şeyi bozmaz/kopyalamaz/temizlemez, sadece "zaten mevcut, dokunulmadı" der.

Çalıştırdıktan sonra **View → Logs** (veya "Execution log") ekranındaki JSON özetini oku — her adımın ne yaptığını/atladığını gösterir. Bu çıktıyı bana yapıştır, birlikte doğrularız.

## 4. TEAM isimlerini gir

`setupRTGCRM()` çalıştıktan sonra, `TEAM` sekmesinin A2'sinden itibaren gerçek ekip üyelerinin isimlerini gir (bir isim = bir satır).

## 5. Filter View'lar (elle, UI üzerinden)

**Neden elle:** Google Sheets'in "Filter Views" (birden fazla adlandırılmış, kalıcı filtre görünümü) özelliği, Apps Script'in standart `SpreadsheetApp` servisinde YOK — sadece "Advanced Sheets Service" (Sheets API v4) üzerinden programatik olarak oluşturulabiliyor, bu da Apps Script projesine ekstra bir servis etkinleştirmeyi gerektiriyor. Bunu sessizce eklemedim; en basit ve ek bağımlılık gerektirmeyen yol, bu iki görünümü Sheets UI'dan elle kurmak:

`LEADS_CRM` sekmesinde:
1. **Veri → Filtre görünümleri → Yeni filtre görünümü oluştur.**
2. "Durum" kolonuna filtre uygula: sadece `İlk görüşme yapılmadı` göster. İsim: **"İLK GÖRÜŞME BEKLEYENLER"**.
3. İkinci görünüm: "Durum" **eşit değil** `İlk görüşme yapılmadı`. İsim: **"İLK GÖRÜŞME SONRASI"**.

Bu görünümler aynı hücrelere bakar — veri kopyalanmaz, düzenlemeler gerçek `LEADS_CRM` hücrelerine yazılır.

## 6. `onEdit` tetikleyicisinin doğrulanması

`onEdit(e)`, proje spreadsheet'e bağlı (container-bound) olduğu için ek bir "Trigger" kurulumu gerektirmez — kod yapıştırılır yapıştırılmaz otomatik aktiftir. Doğrulamak için:

1. `LEADS_CRM`'de herhangi bir satırın "Durum" hücresine tıkla, doğrudan `Süreçte` seçmeyi dene (İlk Görüşme Tarihi boşken).
2. Değerin **otomatik olarak eski haline döndüğünü** ve ekranın altında kısa bir **toast bildirimi** ("Önce 'İlk görüşme yapıldı' durumuna geçmelisin.") gördüğünü doğrula.
3. Aynı hücreye `İlk görüşme yapıldı` seç — "İlk Görüşme Tarihi" hücresine otomatik tarih/saat yazıldığını doğrula.
4. Durumu tekrar değiştir (ör. `Süreçte`) — İlk Görüşme Tarihi'nin **değişmediğini** doğrula.

## 7. Gerçek test

`/basvuru`'dan açıkça test olduğu belli bir kayıt (`TEST RTG`, `test@example.invalid`) gönder:
- `LEADS_RAW`'da yeni bir satır oluştu mu?
- `LEADS_CRM`'de **aynı ID**'yle bir satır oluştu mu?
- `LEADS_CRM`'de Durum = "İlk görüşme yapılmadı", diğer CRM alanları boş mu?
- Aynı `submissionId` ile tekrar gönderim → duplicate satır oluşmuyor mu?

## Notlar

- `LEADS_CRM`'in "Kaynak Detayı" (referralSourceOther) kolonu **yok** — bu bilinçli, sadece `LEADS_RAW`'da tutuluyor.
- Mentor tarafı (`MENTOR_APPLICATIONS` → `MENTOR_RAW`/`MENTORLAR`) bu migrasyonun kapsamında **değil** — ayrı bir tur.
- `setupRTGCRM()` sadece **elle, bir kez** çalıştırılır — `doPost`/`onEdit` akışının bir parçası değildir, otomatik tetiklenmez.
