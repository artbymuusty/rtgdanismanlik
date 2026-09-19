/**
 * RTG Danışmanlık — Apps Script Web App backend for /basvuru (leads) and
 * /bize-katilin (mentor applications).
 *
 * This file is NOT deployed by any build step — Apps Script projects live
 * in Google's own editor (script.google.com), not in this Git repo. Copy
 * this file's contents into that project's Code.gs. See
 * GOOGLE_APPS_SCRIPT_SETUP.md at the repo root for the full manual setup
 * (creating the spreadsheet, the script project, Script Properties, the
 * secret, and the Web App deployment).
 *
 * Request shape (sent by lib/google-apps-script.ts on the Next.js side):
 * {
 *   "secret": "...",
 *   "type": "lead" | "mentor_application",
 *   "submissionId": "...",
 *   "submittedAt": "2026-...T...Z",
 *   "source": "rtg-website",
 *   "payload": { ...validated fields, see lib/validation/*.ts }
 * }
 *
 * Response: always HTTP 200 with a JSON body — either
 * { "ok": true, "id": "RTG-L-..." } or { "ok": false, "error": "..." }.
 * Apps Script Web Apps don't expose custom request headers to doPost(e),
 * so the shared secret travels inside the JSON body instead of a header.
 */

var LEADS_SHEET_NAME = "LEADS";
var MENTOR_SHEET_NAME = "MENTOR_APPLICATIONS";

// Column order for each sheet. Kept in one place so writeLead/
// writeMentorApplication and the auto-created header row can never drift
// apart. "Submission ID" is last so a manually-added CRM column earlier
// in the row never shifts the idempotency lookup.
var LEADS_COLUMNS = [
  "ID", "Created At", "Durum",
  "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
  "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
  "Almanya Hedefi", "Zaman Çizelgesi",
  "Hakkında / Deneyim", "Mesaj",
  "Bizi Nereden Duydunuz", "Kaynak Detayı",
  "Son İletişim", "Sonraki Aksiyon", "Notlar", "Sorumlu",
  "Mentor ID", "Drive Folder",
  "Source", "Submission ID"
];

var MENTOR_COLUMNS = [
  "ID", "Created At", "Durum", "Ad", "Soyad", "Email", "Telefon",
  "Almanya Deneyimi", "Motivasyon", "Ek Mesaj",
  "Notlar", "Sorumlu", "Görüşme Tarihi",
  "Source", "Submission ID"
];

// "Son İletişim", "Sonraki Aksiyon", "Notlar", "Sorumlu" are CRM-only —
// never sent by the form, always written blank, filled in manually as
// part of running the CRM. "Mentor ID" and "Drive Folder" are likewise
// always written blank for now — reserved so a future LEAD->MENTOR
// relation and Drive automation don't require a schema change later.

function doPost(e) {
  var result;
  try {
    result = handleRequest(e);
  } catch (err) {
    result = { ok: false, error: "internal_error" };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return { ok: false, error: "invalid_request" };
  }

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return { ok: false, error: "invalid_json" };
  }

  var expectedSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  if (!expectedSecret || body.secret !== expectedSecret) {
    return { ok: false, error: "unauthorized" };
  }

  if (!body.submissionId || typeof body.submissionId !== "string") {
    return { ok: false, error: "missing_submission_id" };
  }

  if (body.type === "lead") {
    return writeLead(body);
  }
  if (body.type === "mentor_application") {
    return writeMentorApplication(body);
  }
  return { ok: false, error: "unknown_type" };
}

var REFERRAL_LABELS = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  google_search: "Google / İnternet araması",
  university_campus: "Üniversite / Kampüs",
  friend_referral: "Bir arkadaşım / Tanıdığım",
  event_booth: "Etkinlik / Stand",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
  other: "Diğer"
};

function writeLead(body) {
  var payload = body.payload || {};
  var required = [
    "stage", "educationStatus", "interestArea", "englishLevel", "germanLevel",
    "target", "timeline", "referralSource",
    "firstName", "lastName", "phone", "email", "preferredContact"
  ];
  for (var i = 0; i < required.length; i++) {
    if (!payload[required[i]]) return { ok: false, error: "missing_field:" + required[i] };
  }

  if (payload.referralSource === "other" && !payload.referralSourceOther) {
    return { ok: false, error: "missing_field:referralSourceOther" };
  }

  var sheet = getSheet(LEADS_SHEET_NAME, LEADS_COLUMNS);

  var existingId = findBySubmissionId(sheet, body.submissionId);
  if (existingId) return { ok: true, id: existingId };

  var id = generateId("L", body.submissionId);
  var row = [
    id,
    body.submittedAt || new Date().toISOString(),
    "Yeni",
    payload.firstName, payload.lastName, payload.email, payload.phone,
    payload.preferredContact, payload.stage, payload.educationStatus,
    payload.interestArea,
    payload.englishLevel, payload.germanLevel,
    payload.target, payload.timeline,
    payload.background || "", payload.message || "",
    REFERRAL_LABELS[payload.referralSource] || payload.referralSource,
    payload.referralSource === "other" ? (payload.referralSourceOther || "") : "",
    // Son İletişim, Sonraki Aksiyon, Notlar, Sorumlu — CRM tarafından elle doldurulur
    "", "", "", "",
    // Mentor ID, Drive Folder — ileride LEAD->MENTOR ilişkisi / Drive otomasyonu için ayrılmış, şimdilik boş
    "", "",
    body.source || "rtg-website", body.submissionId
  ];
  sheet.appendRow(row);
  return { ok: true, id: id };
}

function writeMentorApplication(body) {
  var payload = body.payload || {};
  var required = ["firstName", "lastName", "phone", "email", "germanyExperience", "motivation"];
  for (var i = 0; i < required.length; i++) {
    if (!payload[required[i]]) return { ok: false, error: "missing_field:" + required[i] };
  }

  var sheet = getSheet(MENTOR_SHEET_NAME, MENTOR_COLUMNS);

  var existingId = findBySubmissionId(sheet, body.submissionId);
  if (existingId) return { ok: true, id: existingId };

  var id = generateId("M", body.submissionId);
  var row = [
    id,
    body.submittedAt || new Date().toISOString(),
    "Yeni",
    payload.firstName, payload.lastName, payload.email, payload.phone,
    payload.germanyExperience, payload.motivation, payload.message || "",
    "", "", "",
    body.source || "rtg-website", body.submissionId
  ];
  sheet.appendRow(row);
  return { ok: true, id: id };
}

function getSheet(name, columns) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(columns);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Idempotency: looks up the "Submission ID" column by header name (not a
 * hardcoded index) so a manually reordered/inserted column never breaks
 * this. Returns the existing row's own "ID" (the human-facing application
 * ID) when the submissionId has already been recorded, so a retried
 * request gets back the same ID instead of creating a duplicate row.
 */
function findBySubmissionId(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idCol = headers.indexOf("ID") + 1;
  var subCol = headers.indexOf("Submission ID") + 1;
  if (subCol < 1) return null;

  var values = sheet.getRange(2, subCol, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === submissionId) {
      return sheet.getRange(i + 2, idCol, 1, 1).getValue();
    }
  }
  return null;
}

function generateId(typeCode, submissionId) {
  var ts = Utilities.formatDate(new Date(), "Etc/UTC", "yyyyMMdd'T'HHmmss");
  var shortId = String(submissionId).replace(/-/g, "").slice(0, 6).toUpperCase();
  return "RTG-" + typeCode + "-" + ts + "-" + shortId;
}
