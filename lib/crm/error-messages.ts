/** Turkish messages for every error code app/crm/actions.ts or Code.gs's
 * crm_* actions can return, so the CRM UI never shows a bare code. */
const MESSAGES: Record<string, string> = {
  unauthorized: "Oturumun sona ermiş. Lütfen tekrar giriş yap.",
  not_configured: "Google Apps Script bağlantısı yapılandırılmamış.",
  apps_script_unavailable: "Google Apps Script şu anda yanıt vermiyor. Birkaç dakika sonra tekrar dene.",
  timeout: "İstek zaman aşımına uğradı. Bağlantını kontrol edip tekrar dene.",
  network_error: "Ağ hatası oluştu. Bağlantını kontrol edip tekrar dene.",
  crm_sheet_missing: "LEADS_CRM sayfası bulunamadı.",
  "sheet_header_mismatch:LEADS_CRM": "LEADS_CRM başlıkları beklenenden farklı görünüyor. Teknik ekiple iletişime geç.",
  missing_id: "Kayıt kimliği eksik.",
  not_found: "Bu kayıt bulunamadı — silinmiş veya taşınmış olabilir.",
  conflict: "Bu kayıt az önce başka biri tarafından güncellendi. Güncel veriyle tekrar dene.",
  busy: "Sistem şu anda yoğun. Birkaç saniye sonra tekrar dene.",
  invalid_status: "Geçersiz durum değeri.",
  invalid_responsible: "Bu isim Sorumlu listesinde (TEAM sayfası) yok.",
  invalid_value: "Girilen değer geçersiz.",
  invalid_email: "Geçerli bir e-posta adresi gir.",
  invalid_url: "Drive Folder yalnızca https:// ile başlayan bir bağlantı olabilir.",
  invalid_mentor_id: "Mentor ID yalnızca harf, rakam, boşluk, tire ve alt çizgi içerebilir.",
  invalid_date: "Geçersiz tarih biçimi.",
  value_too_long: "Girilen metin çok uzun.",
  first_meeting_required: "Önce “İlk görüşme yapıldı” durumuna geçmelisin.",
  first_meeting_date_required: "Bu durumda İlk Görüşme Tarihi boş bırakılamaz.",
  unknown_field: "Bilinmeyen alan.",
  field_not_editable: "Bu alan düzenlenemez.",
  invalid_changes: "Gönderilen değişiklikler geçersiz.",
  no_changes: "Değişiklik yok.",
  bulk_field_not_allowed: "Toplu işlemde yalnızca Sorumlu, Durum ve Mentor ID değiştirilebilir.",
  missing_ids: "Hiç kayıt seçilmedi.",
  too_many_ids: "Tek seferde en fazla 200 kayıt seçebilirsin.",
  invalid_id: "Geçersiz kayıt kimliği.",
  missing_name: "Ad ve soyad gerekli.",
  missing_contact: "E-posta veya telefon bilgilerinden en az biri gerekli.",
  invalid_request_id: "Beklenmeyen bir hata oluştu, sayfayı yenileyip tekrar dene.",
  unknown_type: "Beklenmeyen bir istek türü.",
  invalid_fields: "Gönderilen alanlar geçersiz.",
};

export function crmErrorMessage(code: string | undefined | null): string {
  if (!code) return "Beklenmeyen bir hata oluştu.";
  return MESSAGES[code] ?? "Beklenmeyen bir hata oluştu. Tekrar dene.";
}

export function isSessionError(code: string | undefined | null): boolean {
  return code === "unauthorized";
}
