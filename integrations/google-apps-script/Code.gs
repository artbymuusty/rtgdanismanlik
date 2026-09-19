/**
 * RTG Danışmanlık — Apps Script Web App backend for /basvuru (student
 * leads) and /bize-katilin (mentor applications).
 *
 * This file is NOT deployed by any build step — Apps Script projects live
 * in Google's own editor (script.google.com), not in this Git repo. Copy
 * this file's contents into that project's Code.gs. See
 * GOOGLE_APPS_SCRIPT_SETUP.md at the repo root for the full manual setup
 * (creating the spreadsheet, the script project, Script Properties, the
 * secret, and the Web App deployment), and CRM_MIGRATION_SETUP.md for the
 * LEADS_RAW/LEADS_CRM/TEAM/Filter View setup this file assumes.
 *
 * ARCHITECTURE — raw form data vs. CRM state, kept in separate sheets:
 *
 *   LEADS_RAW  — append-only. Exactly what the website submitted. Never
 *                edited by staff, never overwritten by this script after
 *                the first write.
 *   LEADS_CRM  — one row per lead (same ID as LEADS_RAW), created once at
 *                submission time with CRM fields defaulted to empty /
 *                "İlk görüşme yapılmadı". Staff edits THIS sheet by hand
 *                (Sorumlu, Durum, Notlar, İlk Görüşme Tarihi, Mentor ID,
 *                Drive Folder) — those edits never touch LEADS_RAW.
 *   TEAM       — single column of staff names, manually maintained. Not
 *                written by this script; only referenced by a Data
 *                Validation rule on LEADS_CRM's "Sorumlu" column (set up
 *                once in the Sheets UI, no code involved).
 *
 * "İLK GÖRÜŞME BEKLEYENLER" / "İLK GÖRÜŞME SONRASI" are Google Sheets
 * Filter Views on top of LEADS_CRM (Durum = / != "İlk görüşme yapılmadı")
 * — not separate sheets, no duplicated rows, same editable cells. Filter
 * Views are NOT created by this file (see setupRTGCRM() below for why) —
 * set them up once by hand in the Sheets UI, per CRM_MIGRATION_SETUP.md.
 *
 * ONE-TIME SETUP: run setupRTGCRM() manually from the Apps Script editor
 * (select it in the function dropdown, click Run) exactly once against
 * the live spreadsheet. It renames the legacy flat "LEADS" sheet to
 * LEADS_RAW, normalizes its header to the new schema, creates LEADS_CRM
 * and TEAM if missing, and applies the Sorumlu/Durum data validation
 * rules — see the function's own doc comment for its exact safety
 * guarantees (it refuses to touch anything if real data is present, and
 * is idempotent — safe to re-run).
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

var LEADS_RAW_SHEET_NAME = "LEADS_RAW";
var LEADS_CRM_SHEET_NAME = "LEADS_CRM";
var TEAM_SHEET_NAME = "TEAM";
var MENTOR_SHEET_NAME = "MENTOR_APPLICATIONS";

// LEADS_RAW: form + system data at submission time, PLUS (from columns
// 21-22 on) the lead's independent post-first-meeting profile. No CRM
// MANAGEMENT field (Sorumlu/Durum/İlk Görüşme Tarihi/Mentor ID/Drive
// Folder) ever belongs here — those stay CRM-only.
//
//   "Notlar"                  — the lead's own long-lived tracking notes
//                                (staff-edited, independent from
//                                LEADS_CRM's own "Notlar" — never synced).
//   "Profil Snapshot Tarihi"  — set exactly once, by the one-time CRM ->
//                                RAW profile snapshot that fires when
//                                Durum first reaches STATUS_MET (see
//                                snapshotLeadProfileToRaw()). Empty means
//                                "no first meeting yet"; once set, never
//                                changed again by any automation.
var LEADS_RAW_COLUMNS = [
  "ID", "Created At",
  "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
  "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
  "Almanya Hedefi", "Zaman Çizelgesi",
  "Hakkında / Deneyim", "Mesaj",
  "Bizi Nereden Duydunuz", "Kaynak Detayı",
  "Source", "Submission ID",
  "Notlar", "Profil Snapshot Tarihi"
];

// LEADS_CRM: columns 1-17 mirror the form data (minus "Kaynak Detayı",
// which stays raw-only) so staff can see context without opening
// LEADS_RAW; columns 18-23 are CRM-only, never sent by the form, never
// overwritten by a resubmission.
var LEADS_CRM_COLUMNS = [
  "ID", "Başvuru Tarihi",
  "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
  "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
  "Almanya Hedefi", "Zaman Çizelgesi",
  "Hakkında / Deneyim", "Mesaj",
  "Bizi Nereden Duydunuz",
  "Sorumlu", "Durum", "İlk Görüşme Tarihi", "Notlar",
  "Mentor ID", "Drive Folder"
];

// Not written by this script — staff maintains this list by hand in the
// Sheets UI. Documented here only so the constant name is the single
// source of truth for setup docs / future code that needs the sheet name.
var TEAM_COLUMNS = ["İsim"];

var MENTOR_COLUMNS = [
  "ID", "Created At", "Durum", "Ad", "Soyad", "Email", "Telefon",
  "Almanya Deneyimi", "Motivasyon", "Ek Mesaj",
  "Notlar", "Sorumlu", "Görüşme Tarihi",
  "Source", "Submission ID"
];

// Status lifecycle for LEADS_CRM's "Durum" column. A new lead always
// starts at STATUS_NOT_MET. Only onEdit() (below) may move it to
// STATUS_MET, which is also the only transition allowed to happen before
// "İlk Görüşme Tarihi" has a value — every other status requires that
// timestamp to already be set (enforced in onEdit, not just by convention).
var STATUS_NOT_MET = "İlk görüşme yapılmadı";
var STATUS_MET = "İlk görüşme yapıldı";
var STATUS_OUTCOMES = ["İletişim Kuruldu", "Süreçte", "Olumsuz Sonuçlandı", "Olumlu Sonuçlandı"];

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
    "target", "timeline", "background",
    "firstName", "lastName", "phone", "email", "preferredContact", "referralSource"
  ];
  for (var i = 0; i < required.length; i++) {
    if (!payload[required[i]]) return { ok: false, error: "missing_field:" + required[i] };
  }

  if (payload.referralSource === "other" && !payload.referralSourceOther) {
    return { ok: false, error: "missing_field:referralSourceOther" };
  }

  var rawSheet = getSheet(LEADS_RAW_SHEET_NAME, LEADS_RAW_COLUMNS);
  var crmSheet = getSheet(LEADS_CRM_SHEET_NAME, LEADS_CRM_COLUMNS);

  if (!validateSheetHeaders(rawSheet, LEADS_RAW_COLUMNS)) {
    return { ok: false, error: "sheet_header_mismatch:" + LEADS_RAW_SHEET_NAME };
  }
  if (!validateSheetHeaders(crmSheet, LEADS_CRM_COLUMNS)) {
    return { ok: false, error: "sheet_header_mismatch:" + LEADS_CRM_SHEET_NAME };
  }

  var referralLabel = REFERRAL_LABELS[payload.referralSource] || payload.referralSource;
  // Shared between LEADS_RAW and LEADS_CRM (their columns 3-17 are
  // identical) so the two writes can never silently drift apart.
  var commonFields = [
    payload.firstName, payload.lastName, payload.email, payload.phone, payload.preferredContact,
    payload.stage, payload.educationStatus, payload.interestArea,
    payload.englishLevel, payload.germanLevel,
    payload.target, payload.timeline,
    payload.background, payload.message || "",
    referralLabel
  ];

  var existingId = findBySubmissionId(rawSheet, body.submissionId);
  if (existingId) {
    // Idempotent retry — never append to LEADS_RAW again. Self-heals the
    // rare case where a prior call wrote LEADS_RAW but failed before
    // reaching LEADS_CRM (e.g. a transient Sheets error): if the CRM row
    // is missing, create it now with fresh defaults; if it already
    // exists, it is never touched or re-created.
    if (!rowExistsById(crmSheet, existingId)) {
      appendCrmRow(crmSheet, existingId, body.submittedAt || new Date().toISOString(), commonFields);
    }
    return { ok: true, id: existingId };
  }

  var id = generateId("L", body.submissionId);
  var submittedAt = body.submittedAt || new Date().toISOString();
  var kaynakDetayi = payload.referralSource === "other" ? (payload.referralSourceOther || "") : "";

  rawSheet.appendRow(
    [id, submittedAt].concat(commonFields).concat([
      kaynakDetayi, body.source || "rtg-website", body.submissionId,
      "", "" // Notlar, Profil Snapshot Tarihi — both start empty
    ])
  );

  if (!rowExistsById(crmSheet, id)) {
    appendCrmRow(crmSheet, id, submittedAt, commonFields);
  }

  return { ok: true, id: id };
}

/** Appends one new LEADS_CRM row with all CRM-only fields at their
 * defaults — Sorumlu/İlk Görüşme Tarihi/Notlar/Mentor ID/Drive Folder
 * empty, Durum = STATUS_NOT_MET. Column order matches LEADS_CRM_COLUMNS
 * exactly (23 columns: id, submittedAt, 15 commonFields, then 6 CRM
 * defaults). */
function appendCrmRow(crmSheet, id, submittedAt, commonFields) {
  crmSheet.appendRow(
    [id, submittedAt].concat(commonFields).concat(["", STATUS_NOT_MET, "", "", "", ""])
  );
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

/**
 * ONE-TIME, MANUALLY-TRIGGERED setup — never called from doPost/onEdit,
 * only run by hand from the Apps Script editor. Idempotent: safe to run
 * more than once, never duplicates or clears an existing sheet.
 *
 * What it does, in order:
 *   1. If LEADS_RAW already exists: leaves it and any legacy "LEADS"
 *      sheet completely alone (already migrated, nothing to do).
 *   2. Else if a legacy "LEADS" sheet exists: refuses to touch it if it
 *      has ANY data row (getLastRow() > 1) — returns an error instead.
 *      Only renames it to LEADS_RAW when it is header-only or empty.
 *   3. Only when LEADS_RAW has zero data rows, (re)writes its header to
 *      the current 20-column LEADS_RAW_COLUMNS schema — this is what
 *      upgrades the legacy 27-column flat header. Never touches the
 *      header if any data row exists.
 *   4. Creates LEADS_CRM with its 23-column header if missing; does
 *      nothing if it already exists (no clearing, no header rewrite).
 *   5. Creates TEAM with just the "İsim" header if missing; never adds
 *      names, never touches it if it already exists.
 *   6. (Re)applies Data Validation on LEADS_CRM's Sorumlu (list from
 *      TEAM!A2:A1000) and Durum (fixed 6-value list) columns — safe to
 *      reapply any number of times: a validation rule only constrains
 *      *future* edits, it never clears or rejects values already in
 *      the sheet.
 *
 * Does NOT create Filter Views — Google Sheets Filter Views (as opposed
 * to a sheet's single shared "basic filter") are only programmatically
 * creatable through the Advanced Sheets Service (Sheets API v4), which
 * requires enabling an extra service in this Apps Script project and its
 * linked Google Cloud project. That is a real extra dependency, not
 * something to add silently — set up the two Filter Views by hand in the
 * Sheets UI instead (Data → Filter views), per CRM_MIGRATION_SETUP.md.
 *
 * Logs a step-by-step summary via Logger.log and also returns it, so the
 * result is visible both in the Apps Script "Execution log" and to any
 * caller.
 */
function setupRTGCRM() {
  var result = { ok: true, steps: [] };
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  var ss = SpreadsheetApp.openById(spreadsheetId);

  var rawSheet = ss.getSheetByName(LEADS_RAW_SHEET_NAME);
  if (rawSheet) {
    result.steps.push("LEADS_RAW zaten mevcut — rename adımı atlandı, eski LEADS sekmesine (varsa) dokunulmadı.");
  } else {
    var legacyLeads = ss.getSheetByName("LEADS");
    if (legacyLeads) {
      if (legacyLeads.getLastRow() > 1) {
        result.ok = false;
        result.error = "abort_data_present";
        result.steps.push(
          "DURDURULDU: mevcut \"LEADS\" sekmesinde " + (legacyLeads.getLastRow() - 1) +
          " veri satırı var görünüyor. Güvenlik gereği hiçbir şeye dokunulmadı."
        );
        Logger.log(JSON.stringify(result, null, 2));
        return result;
      }
      legacyLeads.setName(LEADS_RAW_SHEET_NAME);
      rawSheet = legacyLeads;
      result.steps.push("\"LEADS\" -> \"LEADS_RAW\" olarak yeniden adlandırıldı (veri satırı yoktu).");
    } else {
      rawSheet = ss.insertSheet(LEADS_RAW_SHEET_NAME);
      result.steps.push("Mevcut \"LEADS\" sekmesi bulunamadı, LEADS_RAW sıfırdan oluşturuldu.");
    }
  }

  if (rawSheet.getLastRow() <= 1) {
    var currentLastCol = rawSheet.getLastColumn();
    if (currentLastCol > 0) rawSheet.getRange(1, 1, 1, currentLastCol).clearContent();
    rawSheet.getRange(1, 1, 1, LEADS_RAW_COLUMNS.length).setValues([LEADS_RAW_COLUMNS]);
    if (currentLastCol > LEADS_RAW_COLUMNS.length) {
      // Legacy 27-column header was wider than the new 20-column schema —
      // shrink the sheet so no blank trailing columns linger. Safe: we
      // already confirmed zero data rows above.
      rawSheet.deleteColumns(LEADS_RAW_COLUMNS.length + 1, currentLastCol - LEADS_RAW_COLUMNS.length);
    }
    rawSheet.setFrozenRows(1);
    result.steps.push("LEADS_RAW header'ı güncel " + LEADS_RAW_COLUMNS.length + " kolonluk şemaya yazıldı.");
  } else {
    result.steps.push(
      "LEADS_RAW'da veri satırı bulundu, header'a DOKUNULMADI (güvenlik). " +
      "Mevcut header farklıysa writeLead() sheet_header_mismatch hatası verecektir."
    );
  }

  var crmSheet = ss.getSheetByName(LEADS_CRM_SHEET_NAME);
  if (!crmSheet) {
    crmSheet = ss.insertSheet(LEADS_CRM_SHEET_NAME);
    crmSheet.getRange(1, 1, 1, LEADS_CRM_COLUMNS.length).setValues([LEADS_CRM_COLUMNS]);
    crmSheet.setFrozenRows(1);
    result.steps.push("LEADS_CRM oluşturuldu (" + LEADS_CRM_COLUMNS.length + " kolon, sadece header).");
  } else {
    result.steps.push("LEADS_CRM zaten mevcut — dokunulmadı.");
  }

  var teamSheet = ss.getSheetByName(TEAM_SHEET_NAME);
  if (!teamSheet) {
    teamSheet = ss.insertSheet(TEAM_SHEET_NAME);
    teamSheet.getRange(1, 1, 1, TEAM_COLUMNS.length).setValues([TEAM_COLUMNS]);
    teamSheet.setFrozenRows(1);
    result.steps.push("TEAM oluşturuldu (sadece \"İsim\" başlığı, isimler elle eklenecek).");
  } else {
    result.steps.push("TEAM zaten mevcut — dokunulmadı, mevcut isimler korunuyor.");
  }

  applyLeadsCrmValidation(crmSheet, teamSheet);
  result.steps.push("LEADS_CRM üzerinde Sorumlu/Durum veri doğrulama kuralları uygulandı.");

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Applies (or re-applies — idempotent) Data Validation to LEADS_CRM:
 *   - "Sorumlu": list sourced from TEAM!A2:A1000, invalid input rejected.
 *   - "Durum": fixed list of the 6 lifecycle values, invalid input
 *     rejected.
 * Column positions are looked up by header name, never hardcoded, so a
 * manually reordered column never silently validates the wrong one.
 */
function applyLeadsCrmValidation(crmSheet, teamSheet) {
  var headers = crmSheet.getRange(1, 1, 1, crmSheet.getLastColumn()).getValues()[0];
  var sorumluCol = headers.indexOf("Sorumlu") + 1;
  var durumCol = headers.indexOf("Durum") + 1;
  var maxDataRows = 1000;

  if (sorumluCol > 0) {
    var teamRange = teamSheet.getRange("A2:A1000");
    var sorumluRule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(teamRange, true)
      .setAllowInvalid(false)
      .build();
    crmSheet.getRange(2, sorumluCol, maxDataRows, 1).setDataValidation(sorumluRule);
  }

  if (durumCol > 0) {
    var durumValues = [STATUS_NOT_MET, STATUS_MET].concat(STATUS_OUTCOMES);
    var durumRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(durumValues, true)
      .setAllowInvalid(false)
      .build();
    crmSheet.getRange(2, durumCol, maxDataRows, 1).setDataValidation(durumRule);
  }
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
 * Defensive check: confirms an EXISTING sheet's header row still matches
 * the schema this code expects, before appending anything positionally.
 * A brand-new sheet (just created by getSheet() with these exact
 * headers) always passes. Only matters for catching drift on a sheet
 * that already existed with a different/stale header row — writeLead()
 * returns a clear error instead of silently misaligning columns.
 */
function validateSheetHeaders(sheet, expectedColumns) {
  if (sheet.getLastColumn() < expectedColumns.length) return false;
  var actual = sheet.getRange(1, 1, 1, expectedColumns.length).getValues()[0];
  for (var i = 0; i < expectedColumns.length; i++) {
    if (actual[i] !== expectedColumns[i]) return false;
  }
  return true;
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

/** Whether a row with this "ID" already exists — used to check LEADS_CRM,
 * which has no "Submission ID" column of its own (it shares LEADS_RAW's
 * ID instead). */
function rowExistsById(sheet, id) {
  return findRowIndexById(sheet, id) > 0;
}

/** 1-based sheet row number of the row whose "ID" column matches `id`,
 * looked up by header name — or 0 if not found. Shared by
 * rowExistsById() and snapshotLeadProfileToRaw(), which both need to
 * locate a lead's row across sheets using the one key they have in
 * common (never name/email/row-position). */
function findRowIndexById(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idCol = headers.indexOf("ID") + 1;
  if (idCol < 1) return 0;

  var values = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === id) return i + 2;
  }
  return 0;
}

function generateId(typeCode, submissionId) {
  var ts = Utilities.formatDate(new Date(), "Etc/UTC", "yyyyMMdd'T'HHmmss");
  var shortId = String(submissionId).replace(/-/g, "").slice(0, 6).toUpperCase();
  return "RTG-" + typeCode + "-" + ts + "-" + shortId;
}

/**
 * Simple trigger — fires automatically on any manual edit to the bound
 * spreadsheet (no installable-trigger setup needed, since the Apps
 * Script project is container-bound to the sheet). Wrapped in try/catch
 * because a simple trigger has no caller to report an error to; a
 * failure here must never leave the sheet in a broken-looking state, it
 * just skips the automation for that edit.
 */
function onEdit(e) {
  try {
    handleLeadsCrmStatusEdit(e);
  } catch (err) {
    // Intentionally silent — see comment above.
  }
}

/**
 * Enforces the LEADS_CRM status lifecycle:
 *   - Durum -> STATUS_MET stamps "İlk Görüşme Tarihi" with now(), but only
 *     the first time (never overwrites an existing timestamp).
 *   - Durum -> one of STATUS_OUTCOMES is BLOCKED (reverted + a toast)
 *     unless "İlk Görüşme Tarihi" is already set — this is what stops a
 *     lead from skipping straight from STATUS_NOT_MET to an outcome.
 *
 * Only handles single-cell edits on LEADS_CRM's "Durum" column — a
 * multi-cell edit (paste/fill) is skipped entirely rather than guessing,
 * since e.oldValue is not reliably available for those and an incorrect
 * revert would be worse than no enforcement for that one edit.
 */
function handleLeadsCrmStatusEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  if (sheet.getName() !== LEADS_CRM_SHEET_NAME) return;
  if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1) return;

  var row = e.range.getRow();
  if (row < 2) return; // header row, ignore

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusCol = headers.indexOf("Durum") + 1;
  var firstMeetingCol = headers.indexOf("İlk Görüşme Tarihi") + 1;
  if (statusCol < 1 || firstMeetingCol < 1) return;
  if (e.range.getColumn() !== statusCol) return;

  var newValue = e.value;
  var firstMeetingCell = sheet.getRange(row, firstMeetingCol);
  var firstMeetingValue = firstMeetingCell.getValue();
  var alreadyMet = firstMeetingValue !== "" && firstMeetingValue !== null;

  if (newValue === STATUS_MET) {
    if (!alreadyMet) {
      var tz = e.source.getSpreadsheetTimeZone();
      firstMeetingCell.setValue(Utilities.formatDate(new Date(), tz, "dd.MM.yyyy HH:mm"));

      // One-time CRM -> RAW profile snapshot. Gated on !alreadyMet so a
      // later re-selection of STATUS_MET (CRM's own timestamp already
      // set) never re-enters this branch at all — snapshotLeadProfileToRaw()
      // also re-checks RAW's own marker independently, so this stays safe
      // even if something ever calls it a second time some other way.
      var idCol = headers.indexOf("ID") + 1;
      var leadId = idCol > 0 ? sheet.getRange(row, idCol).getValue() : null;
      var rawSheet = e.source.getSheetByName(LEADS_RAW_SHEET_NAME);
      if (leadId && rawSheet) {
        snapshotLeadProfileToRaw(sheet, rawSheet, leadId, tz);
      }
    }
    return;
  }

  if (STATUS_OUTCOMES.indexOf(newValue) !== -1 && !alreadyMet) {
    e.range.setValue(e.oldValue !== undefined ? e.oldValue : STATUS_NOT_MET);
    e.source.toast("Önce “" + STATUS_MET + "” durumuna geçmelisin.", "RTG CRM", 6);
  }
}

/**
 * The ONLY automatic transfer of data between LEADS_CRM and LEADS_RAW,
 * and it only ever runs once per lead: fires from handleLeadsCrmStatusEdit()
 * exactly when Durum first reaches STATUS_MET. Copies the lead's current
 * CRM profile fields into the matching LEADS_RAW row (matched by "ID"
 * only — never name/email/row position) and stamps
 * "Profil Snapshot Tarihi". After that, RAW and CRM are fully
 * independent: no CRM edit ever touches RAW again, and no RAW edit ever
 * touches CRM (RAW edits aren't even observed — onEdit only reacts to
 * LEADS_CRM in the first place).
 *
 * Idempotent by its own check (not just the caller's !alreadyMet gate):
 * if the RAW row already has a "Profil Snapshot Tarihi" value, this
 * returns immediately without writing anything — a lead's RAW profile,
 * once snapshotted, can only change through a direct manual edit on
 * LEADS_RAW from then on.
 */
function snapshotLeadProfileToRaw(crmSheet, rawSheet, id, tz) {
  var rawHeaders = rawSheet.getRange(1, 1, 1, rawSheet.getLastColumn()).getValues()[0];
  var rawIdCol = rawHeaders.indexOf("ID") + 1;
  var snapshotCol = rawHeaders.indexOf("Profil Snapshot Tarihi") + 1;
  if (rawIdCol < 1 || snapshotCol < 1) return; // RAW not on the expected schema — do nothing rather than guess

  var rawRow = findRowIndexById(rawSheet, id);
  if (rawRow > 0) {
    var existingSnapshot = rawSheet.getRange(rawRow, snapshotCol).getValue();
    if (existingSnapshot !== "" && existingSnapshot !== null) return; // already snapshotted — never touch again
  }

  var crmRow = findRowIndexById(crmSheet, id);
  if (crmRow < 1) return; // nothing to copy from

  var crmHeaders = crmSheet.getRange(1, 1, 1, crmSheet.getLastColumn()).getValues()[0];
  var crmValues = crmSheet.getRange(crmRow, 1, 1, crmSheet.getLastColumn()).getValues()[0];
  function crmValue(columnName) {
    var idx = crmHeaders.indexOf(columnName);
    return idx < 0 ? "" : crmValues[idx];
  }

  // The lead-profile fields LEADS_CRM and LEADS_RAW have in common —
  // deliberately excludes every CRM-management column (Sorumlu, Durum,
  // İlk Görüşme Tarihi, Notlar, Mentor ID, Drive Folder) and every
  // RAW-only column (Kaynak Detayı, Source, Submission ID, Notlar,
  // Profil Snapshot Tarihi).
  var profileFields = [
    "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
    "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
    "Almanya Hedefi", "Zaman Çizelgesi", "Hakkında / Deneyim", "Mesaj", "Bizi Nereden Duydunuz"
  ];
  var snapshotTimestamp = Utilities.formatDate(new Date(), tz, "dd.MM.yyyy HH:mm");

  if (rawRow < 1) {
    // Should not normally happen — writeLead() always creates the RAW row
    // up front. Never silently drop the lead's profile: build a minimal
    // RAW row from what CRM has. Kaynak Detayı/Source/Submission ID/Notlar
    // are unknown here and stay blank; this is an already-abnormal
    // recovery path, not the normal flow.
    var newRow = [];
    for (var i = 0; i < rawHeaders.length; i++) {
      var col = rawHeaders[i];
      if (col === "ID") newRow.push(id);
      else if (col === "Created At") newRow.push(snapshotTimestamp);
      else if (col === "Profil Snapshot Tarihi") newRow.push(snapshotTimestamp);
      else if (profileFields.indexOf(col) !== -1) newRow.push(crmValue(col));
      else newRow.push("");
    }
    rawSheet.appendRow(newRow);
    return;
  }

  for (var j = 0; j < profileFields.length; j++) {
    var rawCol = rawHeaders.indexOf(profileFields[j]) + 1;
    if (rawCol > 0) rawSheet.getRange(rawRow, rawCol).setValue(crmValue(profileFields[j]));
  }
  rawSheet.getRange(rawRow, snapshotCol).setValue(snapshotTimestamp);
}
