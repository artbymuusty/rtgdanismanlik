# Hukuki İnceleme Gereken Noktalar

Bu doküman hukuki tavsiye değildir. Sadece CP5'te yapılan teknik mimari değişikliğin (Supabase → Google Apps Script/Sheets), mevcut `/gizlilik` ve `/kvkk` sayfalarındaki metinlerle **teknik olarak tutarsız hale gelebilecek** noktalarını, bir avukatın/uzmanın gözden geçirmesi için işaretler. Metinlerin kendisi burada değiştirilmemiştir ve değiştirilmeyecektir — bu, hukuki bir karardır.

## 1. Kişisel verinin yurt dışına aktarımı (KVKK md. 9)

- `/basvuru` ve `/bize-katilin` formlarından toplanan kişisel veriler (ad, soyad, telefon, e-posta, eğitim durumu, Almanya deneyimi vb.) artık Google'ın altyapısında (Google Sheets + Apps Script) saklanıyor.
- Google'ın veri merkezleri Türkiye dışında (ör. AB/ABD) olabilir; bu durum 6698 sayılı KVKK'nın **yurt dışına veri aktarımı** (madde 9) hükümleri kapsamına girebilir.
- Mevcut `/kvkk` sayfası, verinin yurt dışına aktarıldığından veya Google'ın bir veri işleyen (data processor) olduğundan **bahsetmiyor**.
- **İncelenmesi gereken soru:** KVKK md. 9 kapsamında (yeterli korumaya sahip ülke, açık rıza, taahhütname vb.) bir aktarım dayanağı gerekiyor mu, ve `/kvkk` metnine Google'ın veri işleyen sıfatıyla adının eklenmesi gerekiyor mu?

## 2. "Veri işleyen" (processor) ilişkisi açıklanmıyor

- `/gizlilik` sayfası "erişimi yalnızca yetkili ekip üyeleriyle sınırlı olan güvenli bir ortamda saklanır" diyor — bu ifade teknik olarak hâlâ doğru (Google Sheets'e erişim Google hesap izinleriyle kontrol edilir) ama **Google'ın bir üçüncü taraf veri işleyen olduğunu açıkça belirtmiyor**.
- KVKK ve genel şeffaflık ilkesi gereği, verinin hangi üçüncü taraf altyapısında işlendiğinin (Google Workspace/Apps Script/Sheets) açıkça belirtilmesi gerekebilir.

## 3. Google'ın kendi hizmet şartları/gizlilik politikası

- Google Workspace/Apps Script kullanımı, Google'ın kendi veri işleme şartlarına (Google Cloud/Workspace Data Processing Terms) tabi olabilir.
- **İncelenmesi gereken soru:** RTG'nin kullandığı Google hesap türü (kişisel Gmail mi, Google Workspace mi) bu şartların hangi versiyonunun geçerli olduğunu belirler; bu, KVKK uyumluluğu için ayrıca değerlendirilmelidir.

## 4. Veri saklama süresi ve silme mekanizması

- Eski Supabase mimarisinde veri silme talebi bir veritabanı sorgusuyla teknik olarak yürütülebiliyordu.
- Google Sheets'te bir satırın silinmesi manuel bir işlemdir (otomatik bir "sil" API'si bu CP kapsamında kurulmadı).
- **İncelenmesi gereken soru:** KVKK md. 11 kapsamındaki silme taleplerinin operasyonel olarak nasıl karşılanacağı (kim, ne sürede, hangi sheet'te) yazılı bir prosedüre bağlanmalı mı?

---

Bu maddelerin hiçbiri kod içinde otomatik olarak "çözülmedi" — sadece mimari değişikliğin doğurduğu gerçek teknik farkı burada kayıt altına aldım. Nihai metin değişikliği, bir hukuk danışmanının onayından sonra yapılmalıdır.
