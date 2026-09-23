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
 *   LEADS_CRM  — the ONLY sheet written when the website form is
 *                submitted: one row per lead, created once at submission
 *                time with CRM fields defaulted to empty /
 *                "İlk görüşme yapılmadı". Staff edits THIS sheet by hand
 *                (Sorumlu, Durum, Notlar, İlk Görüşme Tarihi, Mentor ID,
 *                Drive Folder) — those edits never touch LEADS_RAW.
 *   LEADS_RAW  — NOT written at submission. A lead's RAW row is created
 *                exactly once, by snapshotLeadProfileToRaw(), when its CRM
 *                Durum first goes STATUS_NOT_MET -> STATUS_MET: a snapshot
 *                of the CRM profile, using the CRM row's own ID as the RAW
 *                ID. After that RAW and CRM are fully independent (no
 *                automatic sync in either direction), and an existing RAW
 *                row for that ID is never rewritten or duplicated.
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
 * Web CRM (Next.js /crm) actions — same secret, no submissionId, LEADS_CRM
 * only: crm_list, crm_get, crm_update, crm_bulk_update, crm_create. See the
 * "WEB CRM MANAGEMENT API" section at the bottom of this file. They never
 * delete rows, never write LEADS_RAW directly (the first-meeting snapshot
 * goes through runFirstMeetingLifecycle(), the same function onEdit uses),
 * and never change the public lead / mentor code paths.
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

// LEADS_RAW: one row per lead, created at the first-meeting transition as a
// snapshot of the CRM profile (see snapshotLeadProfileToRaw()). No CRM
// MANAGEMENT field (Sorumlu/Durum/İlk Görüşme Tarihi/Mentor ID/Drive
// Folder) ever belongs here — those stay CRM-only.
//
//   "Notlar"                  — the lead's own long-lived tracking notes
//                                (staff-edited, independent from
//                                LEADS_CRM's own "Notlar" — never synced).
//   "Profil Snapshot Tarihi"  — stamped when the RAW row is created by the
//                                CRM -> RAW snapshot (Durum first reaches
//                                STATUS_MET); never changed again by any
//                                automation. Legacy rows that were written
//                                at submission time may have it empty.
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
    // The client only ever sees the generic "internal_error" code below —
    // never err.message/err.stack, which could in principle echo back
    // something derived from the request. Full detail goes ONLY to the
    // Apps Script Execution log (Logger.log), visible solely to whoever
    // has access to this script project, never to the website or its
    // visitors. Never logs body/payload/secret — just the exception's own
    // name/message/stack, which describe the CODE fault, not user data.
    Logger.log("[RTG doPost] EXCEPTION name: " + (err && err.name));
    Logger.log("[RTG doPost] EXCEPTION message: " + (err && err.message));
    Logger.log("[RTG doPost] EXCEPTION stack: " + (err && err.stack));
    result = { ok: false, error: "internal_error" };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  if (!e || !e.postData || !e.postData.contents) {
    Logger.log("[RTG handleRequest] rejected: invalid_request");
    return { ok: false, error: "invalid_request" };
  }

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    Logger.log("[RTG handleRequest] rejected: invalid_json");
    return { ok: false, error: "invalid_json" };
  }
  if (!body || typeof body !== "object") {
    Logger.log("[RTG handleRequest] rejected: invalid_json (body is not an object)");
    return { ok: false, error: "invalid_json" };
  }

  // Never logs the secret itself (expected or received) — only whether
  // each side had one at all, which is enough to tell a genuinely missing
  // Script Property apart from a value mismatch, without exposing either
  // value in a log any script-project collaborator could read.
  var expectedSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  if (!expectedSecret || body.secret !== expectedSecret) {
    Logger.log(
      "[RTG handleRequest] rejected: unauthorized (API_SECRET " +
      (expectedSecret ? "is set" : "is MISSING") + " in Script Properties; request " +
      (body.secret ? "sent a secret" : "sent NO secret") + ")"
    );
    return { ok: false, error: "unauthorized" };
  }

  // Web CRM management actions (crm_list / crm_get / crm_update / ...). They
  // carry no submissionId, so they are routed here — before the public-form
  // check below — and never touch the public lead / mentor code paths.
  if (typeof body.type === "string" && body.type.indexOf("crm_") === 0) {
    return handleCrmRequest(body);
  }

  // Contact page's "Bize yaz" composer (see the CONTACT COMPOSER section
  // below). Entirely isolated from CRM/lead/mentor routing, lifecycle and
  // sheets — it never touches LEADS_CRM/LEADS_RAW and carries no
  // submissionId, so — like crm_* — it is routed here, before the
  // public-form submissionId check.
  if (body.type === "contact") {
    return handleContactRequest(body);
  }

  if (!body.submissionId || typeof body.submissionId !== "string") {
    Logger.log("[RTG handleRequest] rejected: missing_submission_id");
    return { ok: false, error: "missing_submission_id" };
  }

  if (body.type === "lead") {
    return writeLead(body);
  }
  if (body.type === "mentor_application") {
    return writeMentorApplication(body);
  }
  // Only the JS type of the value — never the value itself, which is
  // client-controlled input.
  Logger.log("[RTG handleRequest] rejected: unknown_type (typeof type = " + typeof body.type + ")");
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
    if (!payload[required[i]]) {
      Logger.log("[RTG writeLead] rejected: missing_field:" + required[i]);
      return { ok: false, error: "missing_field:" + required[i] };
    }
  }

  if (payload.referralSource === "other" && !payload.referralSourceOther) {
    Logger.log("[RTG writeLead] rejected: missing_field:referralSourceOther");
    return { ok: false, error: "missing_field:referralSourceOther" };
  }

  // LEADS_RAW is deliberately NOT touched at submission time (see the
  // architecture note at the top) — only LEADS_CRM's header is checked.
  var crmSheet = getSheet(LEADS_CRM_SHEET_NAME, LEADS_CRM_COLUMNS);

  // On a mismatch, ensureSheetHeaders() logs sheet name + column number +
  // expected + found header for every differing column — header TITLES
  // only (never row data) — and, only when the sheet has no data rows,
  // repairs the header in place (see its doc comment).
  if (!ensureSheetHeaders(crmSheet, LEADS_CRM_SHEET_NAME, LEADS_CRM_COLUMNS)) {
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

  // Fail before writing anything if this file's own row builder ever drifts
  // from the 23-column LEADS_CRM schema (2 + common + 6 CRM defaults).
  if (2 + commonFields.length + 6 !== LEADS_CRM_COLUMNS.length) {
    throw new Error("row_builder_schema_mismatch: commonFields has " + commonFields.length + " cells");
  }

  // Idempotency. LEADS_CRM has no "Submission ID" column, so a retry is
  // recognized two ways: (1) LEADS_RAW's "Submission ID" — leads submitted
  // before this behavior change, and leads already snapshotted to RAW; (2)
  // the submissionId -> ID entry saved in Script Properties when the CRM
  // row was created (see saveLeadMeta()).
  var existingId = findExistingLeadId(body.submissionId);
  if (existingId) {
    // Never creates a second CRM row for a known lead. Self-heals only the
    // rare case where the ID is known but its CRM row is missing (a prior
    // call failed midway); an existing CRM row is never touched.
    if (!rowExistsById(crmSheet, existingId)) {
      appendCrmRow(crmSheet, existingId, body.submittedAt || new Date().toISOString(), commonFields);
      Logger.log("[RTG writeLead] idempotent retry: LEADS_CRM row was missing, created it (id=" + existingId + ")");
    } else {
      Logger.log("[RTG writeLead] idempotent retry: nothing written (id=" + existingId + ")");
    }
    return { ok: true, id: existingId };
  }

  var id = generateId("L", body.submissionId);
  // LEADS_CRM's ID is now the lead's only key, so it must be unique: on the
  // (~1 in 16 million per same-second pair) chance two submissions share
  // timestamp + 6-char prefix, disambiguate with the next characters.
  if (rowExistsById(crmSheet, id)) {
    id += "-" + String(body.submissionId).replace(/-/g, "").slice(6, 12).toUpperCase();
  }
  var submittedAt = body.submittedAt || new Date().toISOString();
  var kaynakDetayi = payload.referralSource === "other" ? (payload.referralSourceOther || "") : "";

  appendCrmRow(crmSheet, id, submittedAt, commonFields);

  // The CRM row is already saved; a failure here only loses idempotency
  // for a retry and the RAW-only fields (Kaynak Detayı/Source/Submission
  // ID), which would then be blank in the eventual RAW snapshot. Never
  // fail a submission that has already been written for this.
  try {
    saveLeadMeta(id, body.submissionId, kaynakDetayi, body.source || "rtg-website");
  } catch (err) {
    Logger.log("[RTG writeLead] WARNING: lead saved to LEADS_CRM but saveLeadMeta failed: " + (err && err.message));
  }

  Logger.log("[RTG writeLead] ok: 1 row written to " + LEADS_CRM_SHEET_NAME + ", " + LEADS_RAW_SHEET_NAME + " untouched (id=" + id + ")");
  return { ok: true, id: id };
}

// Script Properties entries bridging submission time and the first-meeting
// snapshot, because LEADS_CRM has no column for them:
//   RTG_LEAD_META_<id>  -> JSON { s: submissionId, k: Kaynak Detayı, o: Source }
//   RTG_LEAD_SUB_<sid>  -> <id>   (submission-time idempotency lookup)
// Both are deleted when the RAW row is created (RAW then carries Submission
// ID itself). Holds no secret; Kaynak Detayı is user free text, never logged.
var LEAD_META_PREFIX = "RTG_LEAD_META_";
var LEAD_SUB_PREFIX = "RTG_LEAD_SUB_";

function saveLeadMeta(id, submissionId, kaynakDetayi, source) {
  var entries = {};
  entries[LEAD_META_PREFIX + id] = JSON.stringify({ s: submissionId, k: kaynakDetayi, o: source });
  entries[LEAD_SUB_PREFIX + submissionId] = id;
  PropertiesService.getScriptProperties().setProperties(entries);
}

function readLeadMeta(id) {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(LEAD_META_PREFIX + id);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function clearLeadMeta(id, meta) {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty(LEAD_META_PREFIX + id);
  if (meta && meta.s) props.deleteProperty(LEAD_SUB_PREFIX + meta.s);
}

/** ID of the lead already recorded for this submissionId, or null. Checks
 * LEADS_RAW (read-only — never creates the sheet) then the Script
 * Properties entry saved at CRM-row creation. */
function findExistingLeadId(submissionId) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  var rawSheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(LEADS_RAW_SHEET_NAME);
  if (rawSheet) {
    var rawId = findBySubmissionId(rawSheet, submissionId);
    if (rawId) return rawId;
  }
  return PropertiesService.getScriptProperties().getProperty(LEAD_SUB_PREFIX + submissionId) || null;
}

/** Appends one new LEADS_CRM row with all CRM-only fields at their
 * defaults — Sorumlu/İlk Görüşme Tarihi/Notlar/Mentor ID/Drive Folder
 * empty, Durum = STATUS_NOT_MET. Column order matches LEADS_CRM_COLUMNS
 * exactly (23 columns: id, submittedAt, 15 commonFields, then 6 CRM
 * defaults). Verified after the write (cell count before, lookup by ID after). */
function appendCrmRow(crmSheet, id, submittedAt, commonFields) {
  appendVerifiedRow(
    crmSheet, LEADS_CRM_SHEET_NAME, LEADS_CRM_COLUMNS.length, id,
    [id, submittedAt].concat(commonFields).concat(["", STATUS_NOT_MET, "", "", "", ""])
  );
}

function appendVerifiedRow(sheet, sheetName, expectedCells, id, row) {
  if (row.length !== expectedCells) {
    throw new Error("row_width_mismatch:" + sheetName + " built " + row.length + " cells, expected " + expectedCells);
  }
  sheet.appendRow(row);
  SpreadsheetApp.flush();
  if (!rowExistsById(sheet, id)) {
    throw new Error("append_not_verified:" + sheetName + " row for id " + id + " not found after appendRow");
  }
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

// ===========================================================================
// CONTACT COMPOSER  (type: "contact")
//
// The /iletisim page's "Bize yaz" form. Entirely isolated from the lead /
// mentor_application / CRM code above and below: no sheet is ever read or
// written here, no LEADS_CRM/LEADS_RAW row is created, no CRM lifecycle is
// touched. It only sends one e-mail via Apps Script's own MailApp service
// (built into the runtime — no external dependency, no new service to
// configure or pay for) to the address in the CONTACT_EMAIL Script
// Property — never hard-coded here, never sent by the client.
// ===========================================================================

var CONTACT_CATEGORIES = ["general", "consulting", "billing", "complaint", "technical", "website", "other"];

// The staff-facing e-mail is always in Turkish (RTG's own working
// language, same as CRM_AUDIT and every other internal artifact) —
// independent of whatever language the visitor's site UI was in. That is
// a separate, purely front-end concern (lib/content/*.ts's
// contact.composer.categories).
var CONTACT_CATEGORY_LABELS_TR = {
  general: "Genel soru",
  consulting: "Başvuru / Danışmanlık",
  billing: "Ödeme / Faturalandırma",
  complaint: "Şikayet",
  technical: "Teknik / Sistem Sorunu",
  website: "Web Sitesi Hatası",
  other: "Diğer"
};

/** Strips control characters and line breaks from a single-line field
 * (email, subject) — defense-in-depth against header-injection-style
 * input, even though MailApp.sendEmail's structured parameters (not raw
 * SMTP headers) already make that essentially impossible. The message
 * body is cleaned separately (crmCleanText keeps its intentional
 * newlines). */
function contactCleanLine(value) {
  return String(value).replace(/[\r\n\u0000-\u001F\u007F]/g, "").trim();
}

/**
 * Validates every field server-side (never trusts the client's own
 * validation), then sends the e-mail. Never writes to any sheet.
 *
 * Every error code is CONTACT_-prefixed and diagnosable WITHOUT Apps
 * Script Execution-log access: lib/contact/apps-script-client.ts logs
 * this exact code to Vercel's own function logs (`[contact] rejected:
 * ...`) on every failure, since a well-formed {ok:false} JSON response
 * is otherwise silently collapsed into one generic, locale-aware
 * message for the visitor (see that file) — no technical detail ever
 * reaches them, but the code always reaches Vercel's logs. A mail-send
 * failure additionally appends the exception's own name/a short,
 * PII-free slice of its message (Apps Script's own system text, e.g.
 * "authorization required" or "daily quota exceeded" — never anything
 * derived from the visitor's input) so the two most likely real causes —
 * missing MailApp authorization vs. exhausted quota — are distinguishable
 * from Vercel logs alone.
 */
function handleContactRequest(body) {
  var email = typeof body.email === "string" ? contactCleanLine(body.email) : "";
  var category = typeof body.category === "string" ? body.category : "";
  var subject = typeof body.subject === "string" ? contactCleanLine(body.subject) : "";
  var message = typeof body.message === "string" ? crmCleanText(body.message) : "";

  if (!email || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "CONTACT_INVALID_EMAIL" };
  }
  if (CONTACT_CATEGORIES.indexOf(category) === -1) {
    return { ok: false, error: "CONTACT_INVALID_CATEGORY" };
  }
  if (!subject || subject.length > 160) {
    return { ok: false, error: "CONTACT_INVALID_SUBJECT" };
  }
  if (!message || message.length > 5000) {
    return { ok: false, error: "CONTACT_INVALID_MESSAGE" };
  }

  var recipient = PropertiesService.getScriptProperties().getProperty("CONTACT_EMAIL");
  if (!recipient) {
    Logger.log("[RTG contact] rejected: CONTACT_NOT_CONFIGURED (CONTACT_EMAIL Script Property is not set)");
    return { ok: false, error: "CONTACT_NOT_CONFIGURED" };
  }

  var id = "RTG-CONTACT-" + Utilities.formatDate(new Date(), "Etc/UTC", "yyyyMMdd'T'HHmmss") +
    "-" + Utilities.getUuid().replace(/-/g, "").slice(0, 6).toUpperCase();
  var timestamp = Utilities.formatDate(new Date(), "Etc/UTC", "dd.MM.yyyy HH:mm '(UTC)'");
  var categoryLabel = CONTACT_CATEGORY_LABELS_TR[category] || category;

  var mailSubject = "[RTG İletişim] " + categoryLabel + " — " + subject;
  var mailBody = [
    "RTG DANIŞMANLIK",
    "Yeni iletişim mesajı",
    "",
    "Gönderen:",
    email,
    "",
    "Kategori:",
    categoryLabel,
    "",
    "Konu:",
    subject,
    "",
    "Mesaj:",
    message,
    "",
    "Gönderim zamanı:",
    timestamp,
    "",
    "Kaynak:",
    "RTG Web Sitesi / İletişim",
    "",
    "Mesaj ID:",
    id
  ].join("\n");

  try {
    MailApp.sendEmail({ to: recipient, subject: mailSubject, body: mailBody, replyTo: email });
  } catch (err) {
    // Full exception goes to the Execution log (for whoever does have
    // access to it), AND a short, PII-free diagnostic slice — the
    // exception's own name/system message, never anything derived from
    // email/subject/message — rides along in the returned code itself,
    // so it reaches Vercel's logs even without any Apps Script access.
    var exceptionName = (err && err.name) || "Error";
    var exceptionHint = contactCleanLine(String((err && err.message) || "")).slice(0, 120);
    Logger.log("[RTG contact] mail send failed: " + exceptionName + ": " + exceptionHint);
    return { ok: false, error: "CONTACT_MAIL_SEND_FAILED:" + exceptionName + (exceptionHint ? " " + exceptionHint : "") };
  }

  Logger.log("[RTG contact] sent ok id=" + id + " category=" + category);
  return { ok: true, id: id };
}

/**
 * MANUAL, DEVELOPER-ONLY diagnostic for MailApp authorization/delivery —
 * never called from doPost, never reachable through any public endpoint,
 * touches no production code path. Run it BY HAND from this editor
 * (select "testContactMailAuthorization" in the function dropdown at the
 * top, click Run) — that is the ONLY way to trigger Google's permission
 * consent dialog for a scope (sending mail as this project) the script
 * has never used before; an external Web App POST can never show that
 * dialog, so a brand-new MailApp usage silently fails with an
 * authorization error on every real request until this has been run
 * and approved once.
 *
 * What it does, in order — logged to THIS run's own Execution log:
 *   1. Confirms CONTACT_EMAIL is set (never logs its actual value).
 *   2. Calls MailApp.getRemainingDailyQuota() — a safe capability check
 *      that alone can trigger the authorization prompt.
 *   3. Sends one real test e-mail to CONTACT_EMAIL, so you can directly
 *      confirm delivery end-to-end, independent of the contact form.
 *
 * If step 2 or 3 pops up an authorization screen, approve it, then run
 * this function again to confirm it now succeeds — after that, the real
 * contact form will work too, since project-level authorization isn't
 * per-deployment.
 */
function testContactMailAuthorization() {
  var recipient = PropertiesService.getScriptProperties().getProperty("CONTACT_EMAIL");
  Logger.log("[RTG contact test] CONTACT_EMAIL is " + (recipient ? "set." : "NOT SET — add it in Project Settings > Script Properties first, then re-run this."));
  if (!recipient) return;

  try {
    var quota = MailApp.getRemainingDailyQuota();
    Logger.log("[RTG contact test] MailApp.getRemainingDailyQuota() ok — remaining quota: " + quota);
  } catch (err) {
    Logger.log("[RTG contact test] getRemainingDailyQuota() FAILED: " + (err && err.name) + ": " + (err && err.message));
    Logger.log("[RTG contact test] This is very likely an authorization prompt waiting for your approval — check for a permissions dialog, approve it, then run this function again.");
    return;
  }

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: "[RTG İletişim] Test — Apps Script yetkilendirme kontrolü",
      body: "Bu, testContactMailAuthorization() tarafından gönderilen manuel bir test e-postasıdır.\n\nBu e-postayı görüyorsan MailApp bu proje için doğru şekilde yetkilendirilmiş ve CONTACT_EMAIL'e teslimat çalışıyor demektir — production /iletisim formu da artık çalışmalı."
    });
    Logger.log("[RTG contact test] MailApp.sendEmail() succeeded — check the CONTACT_EMAIL inbox (and spam folder) now.");
  } catch (err) {
    Logger.log("[RTG contact test] MailApp.sendEmail() FAILED: " + (err && err.name) + ": " + (err && err.message));
    Logger.log("[RTG contact test] If this mentions authorization/permission, approve the consent dialog if one appeared, then re-run this function.");
  }
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
  var sorumluCol = headerIndex(headers, "Sorumlu") + 1;
  var durumCol = headerIndex(headers, "Durum") + 1;
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
 *
 * Both the actual AND the expected header cell are trimmed before
 * comparing. A hand-typed header (e.g. after manually completing a schema
 * migration in the Sheets UI) can easily pick up a stray leading/trailing
 * space that is invisible in the UI but fails a raw `!==` — that's noise
 * this check should not be sensitive to. A genuinely different column
 * name (typo, wrong Turkish character, wrong order) still fails, which is
 * the actual purpose of this guard.
 */
function validateSheetHeaders(sheet, expectedColumns) {
  return findHeaderMismatches(sheet, expectedColumns).length === 0;
}

/** Every column (1-based) whose trimmed header differs from the trimmed
 * expected one, as { col, expected, found }. A sheet with fewer columns
 * than expected reports the missing ones with found = "" . Header TITLES
 * only — never reads a data row. */
function findHeaderMismatches(sheet, expectedColumns) {
  var lastCol = sheet.getLastColumn();
  var actual = lastCol < 1 ? [] : sheet.getRange(1, 1, 1, Math.min(lastCol, expectedColumns.length)).getValues()[0];
  var mismatches = [];
  for (var i = 0; i < expectedColumns.length; i++) {
    var found = i < actual.length ? String(actual[i]) : "";
    if (found.trim() !== String(expectedColumns[i]).trim()) {
      mismatches.push({ col: i + 1, expected: expectedColumns[i], found: found });
    }
  }
  return mismatches;
}

/**
 * Header guard used by writeLead() (LEADS_CRM) and the CRM -> RAW snapshot
 * (LEADS_RAW). Returns true when the sheet's header
 * row is (after trim) the expected schema.
 *
 * On a mismatch it always logs, per differing column: sheet name, column
 * number, expected header, found header (JSON-quoted so invisible
 * whitespace is visible) — titles only, no user data.
 *
 * Then, ONLY if the sheet holds no data rows at all (getLastRow() <= 1,
 * i.e. header-only or empty), it repairs the header: it rewrites row 1,
 * columns 1..N, with the expected titles and re-validates. That is the
 * whole repair — it never clears the sheet, never deletes/inserts/reorders
 * columns, never touches columns beyond N, and never runs when any data
 * row exists (a sheet with data is only ever reported, returning false),
 * so Filter Views, data validation and existing rows are unaffected.
 */
function ensureSheetHeaders(sheet, sheetName, expectedColumns) {
  var mismatches = findHeaderMismatches(sheet, expectedColumns);
  if (mismatches.length === 0) return true;

  Logger.log(
    "[RTG headers] sheet_header_mismatch:" + sheetName + " — " + mismatches.length +
    " column(s) differ (sheet has " + sheet.getLastColumn() + " column(s), expected " + expectedColumns.length + ")"
  );
  for (var i = 0; i < mismatches.length; i++) {
    Logger.log(
      "[RTG headers] sheet_header_mismatch:" + sheetName + " column " + mismatches[i].col +
      ": expected " + JSON.stringify(mismatches[i].expected) +
      ", found " + JSON.stringify(mismatches[i].found)
    );
  }

  if (sheet.getLastRow() > 1) {
    Logger.log("[RTG headers] sheet_header_mismatch:" + sheetName + " — sheet has data rows, header NOT repaired");
    return false;
  }

  sheet.getRange(1, 1, 1, expectedColumns.length).setValues([expectedColumns]);
  SpreadsheetApp.flush();
  if (findHeaderMismatches(sheet, expectedColumns).length !== 0) {
    Logger.log("[RTG headers] sheet_header_mismatch:" + sheetName + " — header repair did not take effect");
    return false;
  }
  Logger.log("[RTG headers] sheet_header_mismatch:" + sheetName + " — sheet had no data rows, header repaired to the expected " + expectedColumns.length + "-column schema");
  return true;
}

/** 0-based index of the header cell whose TRIMMED text equals `name`, or -1.
 * Every by-name column lookup goes through this so it agrees with
 * validateSheetHeaders(), which tolerates stray leading/trailing spaces —
 * otherwise a header that passes validation (e.g. "Submission ID ") could
 * still be invisible to idempotency / snapshot lookups. */
function headerIndex(headers, name) {
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === name) return i;
  }
  return -1;
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
  var idCol = headerIndex(headers, "ID") + 1;
  var subCol = headerIndex(headers, "Submission ID") + 1;
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
  var idCol = headerIndex(headers, "ID") + 1;
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
  var statusCol = headerIndex(headers, "Durum") + 1;
  var firstMeetingCol = headerIndex(headers, "İlk Görüşme Tarihi") + 1;
  if (statusCol < 1 || firstMeetingCol < 1) return;
  if (e.range.getColumn() !== statusCol) return;

  var newValue = e.value;
  var firstMeetingCell = sheet.getRange(row, firstMeetingCol);
  var firstMeetingValue = firstMeetingCell.getValue();
  var alreadyMet = firstMeetingValue !== "" && firstMeetingValue !== null;

  if (newValue === STATUS_MET) {
    var tz = e.source.getSpreadsheetTimeZone();
    // The very same function the web CRM (crm_update) calls — one lifecycle,
    // one source of truth. Runs on every transition to STATUS_MET, so a first
    // attempt that failed can be retried by re-selecting the status; the RAW
    // snapshot itself no-ops when a RAW row for the ID already exists.
    var lifecycle = runFirstMeetingLifecycle(e.source, sheet, row, headers, tz, "[RTG onEdit]");
    if (lifecycle.snapshot === "failed") {
      e.source.toast("LEADS_RAW kaydı oluşturulamadı — Apps Script Executions logunu kontrol et.", "RTG CRM", 8);
    }
    return;
  }

  if (STATUS_OUTCOMES.indexOf(newValue) !== -1 && !alreadyMet) {
    e.range.setValue(e.oldValue !== undefined ? e.oldValue : STATUS_NOT_MET);
    e.source.toast("Önce “" + STATUS_MET + "” durumuna geçmelisin.", "RTG CRM", 6);
  }
}

/**
 * The first-meeting lifecycle for ONE LEADS_CRM row, run right AFTER its
 * "Durum" cell has been set to STATUS_MET. This is the single implementation
 * of the rule; it is called by both:
 *   - onEdit()            — a person changed Durum in the Sheets UI, and
 *   - crmApplyChanges()   — the web CRM changed Durum (script writes never
 *                           fire onEdit, so the web path must call it itself).
 *
 * 1. "İlk Görüşme Tarihi" is stamped with now() if — and only if — empty.
 * 2. snapshotLeadProfileToRaw() creates the lead's LEADS_RAW row if none
 *    exists for the ID (never a second row, never an overwrite).
 *
 * Returns { dateStamped, snapshot, error } where snapshot is one of
 * "created" | "exists" | "skipped" | "failed". Never throws.
 */
function runFirstMeetingLifecycle(ss, crmSheet, row, headers, tz, logTag) {
  var result = { dateStamped: false, snapshot: "skipped", error: "" };

  var firstMeetingCol = headerIndex(headers, "İlk Görüşme Tarihi") + 1;
  if (firstMeetingCol < 1) return result;
  var firstMeetingCell = crmSheet.getRange(row, firstMeetingCol);
  var existing = firstMeetingCell.getValue();
  if (existing === "" || existing === null) {
    firstMeetingCell.setValue(Utilities.formatDate(new Date(), tz, "dd.MM.yyyy HH:mm"));
    result.dateStamped = true;
  }

  var idCol = headerIndex(headers, "ID") + 1;
  var leadId = idCol > 0 ? crmSheet.getRange(row, idCol).getValue() : null;
  var rawSheet = ss.getSheetByName(LEADS_RAW_SHEET_NAME);
  if (!leadId || !rawSheet) return result;

  try {
    var created = snapshotLeadProfileToRaw(crmSheet, rawSheet, leadId, tz);
    result.snapshot = created ? "created" : (findRowIndexById(rawSheet, leadId) > 0 ? "exists" : "skipped");
  } catch (err) {
    Logger.log(logTag + " snapshot failed: " + (err && err.name) + ": " + (err && err.message));
    result.snapshot = "failed";
    result.error = String((err && err.message) || "snapshot_failed");
  }
  return result;
}

/**
 * The ONLY automatic transfer of data between LEADS_CRM and LEADS_RAW, and
 * it happens at most once per lead: it CREATES the lead's LEADS_RAW row,
 * as a snapshot of the current CRM profile, the first time Durum reaches
 * STATUS_MET. Matched by "ID" only (never name/email/row position); the
 * new RAW row's ID is the CRM row's own ID.
 *
 * If a RAW row with this ID already exists — a legacy lead written at
 * submission time, or a prior snapshot — this returns without writing
 * anything: no second row, no re-snapshot, no overwrite. After creation
 * RAW and CRM are fully independent: no CRM edit ever touches RAW, and no
 * RAW edit ever touches CRM (onEdit only reacts to LEADS_CRM).
 *
 * The RAW row carries the 15 shared profile fields + Başvuru Tarihi (as
 * Created At) from CRM, Kaynak Detayı/Source/Submission ID from the Script
 * Properties entry saved at submission, an empty "Notlar" (RAW's own notes
 * are independent of CRM's), and "Profil Snapshot Tarihi" = now. CRM
 * management fields (Sorumlu, Durum, İlk Görüşme Tarihi, Mentor ID, Drive
 * Folder) are never copied.
 *
 * Returns true only when it created the row.
 */
function snapshotLeadProfileToRaw(crmSheet, rawSheet, id, tz) {
  // Only a RAW sheet on the expected schema is written to (header-only
  // sheets are repaired, sheets with data are never touched). If it is
  // not, do nothing rather than guess — and, because the "already exists"
  // lookup below is by header name, never risk a duplicate.
  if (!ensureSheetHeaders(rawSheet, LEADS_RAW_SHEET_NAME, LEADS_RAW_COLUMNS)) {
    Logger.log("[RTG snapshot] skipped: " + LEADS_RAW_SHEET_NAME + " header mismatch (see log above)");
    return false;
  }

  if (findRowIndexById(rawSheet, id) > 0) {
    Logger.log("[RTG snapshot] skipped: " + LEADS_RAW_SHEET_NAME + " already has a row for id=" + id);
    return false;
  }

  var crmRow = findRowIndexById(crmSheet, id);
  if (crmRow < 1) return false; // nothing to copy from

  var crmHeaders = crmSheet.getRange(1, 1, 1, crmSheet.getLastColumn()).getValues()[0];
  var crmValues = crmSheet.getRange(crmRow, 1, 1, crmSheet.getLastColumn()).getValues()[0];
  function crmValue(columnName) {
    var idx = headerIndex(crmHeaders, columnName);
    return idx < 0 ? "" : crmValues[idx];
  }

  var profileFields = [
    "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
    "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
    "Almanya Hedefi", "Zaman Çizelgesi", "Hakkında / Deneyim", "Mesaj", "Bizi Nereden Duydunuz"
  ];
  var meta = readLeadMeta(id);
  var snapshotTimestamp = Utilities.formatDate(new Date(), tz, "dd.MM.yyyy HH:mm");

  var newRow = [];
  for (var i = 0; i < LEADS_RAW_COLUMNS.length; i++) {
    var col = LEADS_RAW_COLUMNS[i];
    if (col === "ID") newRow.push(id);
    else if (col === "Created At") newRow.push(crmValue("Başvuru Tarihi"));
    else if (col === "Kaynak Detayı") newRow.push(meta.k || "");
    else if (col === "Source") newRow.push(meta.o || "rtg-website");
    else if (col === "Submission ID") newRow.push(meta.s || "");
    else if (col === "Notlar") newRow.push("");
    else if (col === "Profil Snapshot Tarihi") newRow.push(snapshotTimestamp);
    else if (profileFields.indexOf(col) !== -1) newRow.push(crmValue(col));
    else newRow.push("");
  }

  appendVerifiedRow(rawSheet, LEADS_RAW_SHEET_NAME, LEADS_RAW_COLUMNS.length, id, newRow);

  // RAW now carries Submission ID itself, which is what idempotency uses
  // from here on — the bridging Script Properties entries are done.
  try {
    clearLeadMeta(id, meta);
  } catch (err) {
    Logger.log("[RTG snapshot] WARNING: could not clear lead meta: " + (err && err.message));
  }
  Logger.log("[RTG snapshot] created " + LEADS_RAW_SHEET_NAME + " row for id=" + id);
  return true;
}


// ===========================================================================
// WEB CRM MANAGEMENT API  (crm_list / crm_get / crm_update / crm_bulk_update /
// crm_create)
//
// Used only by the Next.js server behind /crm (authenticated there with
// CRM_ADMIN_SECRET). Guarded here by the same API_SECRET as the public form.
//
// Guarantees:
//   - LEADS_CRM is the only sheet these actions read rows from or write rows
//     to. LEADS_RAW is touched ONLY through runFirstMeetingLifecycle() (the
//     same code onEdit uses), never by these actions directly.
//   - Rows are addressed by "ID", never by row number.
//   - Optimistic concurrency without a new column: every row carries a
//     `version` (a hash of its 23 values); crm_update rejects a stale
//     expectedVersion with `conflict`.
//   - No delete action exists.
//   - Text is stripped of control characters and neutralized against Sheets
//     formula injection ("=", "+", "-", "@" leading characters).
//   - Logs contain action names, IDs, field NAMES and counts — never cell
//     values (no names, e-mails, phone numbers, notes).
//   - A best-effort CRM_AUDIT sheet (created on first write; never blocks a
//     write, never stores personal-data values) records who changed what.
// ===========================================================================

var CRM_AUDIT_SHEET_NAME = "CRM_AUDIT";
var CRM_AUDIT_COLUMNS = ["Zaman", "ID", "Eylem", "Alan", "Eski Değer", "Yeni Değer", "Kullanıcı"];
var CRM_STATUSES = [STATUS_NOT_MET, STATUS_MET].concat(STATUS_OUTCOMES);
var CRM_READONLY_FIELDS = ["ID", "Başvuru Tarihi"];
var CRM_BULK_FIELDS = ["Sorumlu", "Durum", "Mentor ID"];
// Fields whose VALUES are personal data or free text: the audit log records
// that they changed, never what they changed from/to.
var CRM_AUDIT_MASKED = ["Notlar", "Ad", "Soyad", "Email", "Telefon", "Hakkında / Deneyim", "Mesaj"];
var CRM_MAX_LENGTH = { "Notlar": 10000, "Hakkında / Deneyim": 5000, "Mesaj": 5000, "Drive Folder": 1000 };
var CRM_DEFAULT_MAX_LENGTH = 500;
var CRM_MAX_BULK = 200;
var CRM_DATE_PATTERN = /^\d{2}\.\d{2}\.\d{4}( \d{2}:\d{2})?$/;
var CRM_CREATE_FIELDS = [
  "Ad", "Soyad", "Email", "Telefon", "Tercih Edilen İletişim",
  "Aşama", "Eğitim Durumu", "İlgi Alanı", "İngilizce Seviyesi", "Almanca Seviyesi",
  "Almanya Hedefi", "Zaman Çizelgesi", "Hakkında / Deneyim", "Mesaj", "Sorumlu", "Notlar"
];

function handleCrmRequest(body) {
  var type = body.type;
  if (type === "crm_list") return crmList();
  if (type === "crm_get") return crmGet(body);
  if (type === "crm_update") return crmWithLock(function () { return crmUpdate(body); });
  if (type === "crm_bulk_update") return crmWithLock(function () { return crmBulkUpdate(body); });
  if (type === "crm_create") return crmWithLock(function () { return crmCreate(body); });
  Logger.log("[RTG crm] rejected: unknown_type");
  return { ok: false, error: "unknown_type" };
}

/** Serializes CRM writes so two staff members (or a bulk run) never
 * interleave read-modify-write cycles on the same rows. */
function crmWithLock(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    Logger.log("[RTG crm] busy: could not obtain the script lock");
    return { ok: false, error: "busy" };
  }
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

/** Opens LEADS_CRM read-only-ish: never creates or repairs anything. */
function crmOpen() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(LEADS_CRM_SHEET_NAME);
  if (!sheet) return { error: "crm_sheet_missing" };
  var mismatches = findHeaderMismatches(sheet, LEADS_CRM_COLUMNS);
  if (mismatches.length > 0) {
    Logger.log("[RTG crm] sheet_header_mismatch:" + LEADS_CRM_SHEET_NAME + " (" + mismatches.length + " column(s))");
    return { error: "sheet_header_mismatch:" + LEADS_CRM_SHEET_NAME };
  }
  return { ss: ss, sheet: sheet, tz: ss.getSpreadsheetTimeZone() };
}

function crmCellToString(v) {
  if (v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Date]") {
    return isNaN(v.getTime()) ? "" : v.toISOString();
  }
  return String(v);
}

/** 32-bit FNV-1a over the row's values: a cheap, dependency-free version
 * stamp. A change to ANY of the 23 cells changes it. */
function crmRowVersion(values) {
  var text = values.join("\u0001");
  var h = 0x811c9dc5;
  for (var i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16);
}

function crmRowPayload(values) {
  return { v: values, ver: crmRowVersion(values) };
}

function crmReadRowValues(sheet, sheetRow) {
  return sheet.getRange(sheetRow, 1, 1, LEADS_CRM_COLUMNS.length).getValues()[0].map(crmCellToString);
}

function crmReadAllRows(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var raw = sheet.getRange(2, 1, lastRow - 1, LEADS_CRM_COLUMNS.length).getValues();
  var rows = [];
  for (var i = 0; i < raw.length; i++) {
    var values = raw[i].map(crmCellToString);
    if (values[0] === "") continue; // blank line
    rows.push(values);
  }
  return rows;
}

function crmReadTeam(ss) {
  var team = ss.getSheetByName(TEAM_SHEET_NAME);
  if (!team || team.getLastRow() < 2) return [];
  var values = team.getRange(2, 1, team.getLastRow() - 1, 1).getValues();
  var names = [];
  for (var i = 0; i < values.length; i++) {
    var name = String(values[i][0] === null || values[i][0] === undefined ? "" : values[i][0]).trim();
    if (name && names.indexOf(name) === -1) names.push(name);
  }
  return names;
}

/** Strips control characters (keeps \n and \t), normalizes line breaks, trims. */
function crmCleanText(value) {
  return String(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/** Sheets evaluates a string starting with = + - @ as a formula (e.g.
 * =IMPORTXML(...) can exfiltrate data). Prefixing an apostrophe stores it as
 * plain text. Phone-like values ("+90 555 123 45 67") are left alone. */
function crmNeutralizeFormula(value) {
  var v = String(value);
  if (/^[=+\-@]/.test(v) && !/^[+\-]?[0-9][0-9 ()\-.]*$/.test(v)) return "'" + v;
  return v;
}

function crmActor(body) {
  var actor = String(body && body.actor ? body.actor : "").replace(/[^A-Za-zÇĞİÖŞÜçğıöşü0-9 ._-]/g, "").trim().slice(0, 40);
  return actor || "crm-admin";
}

function crmList() {
  var c = crmOpen();
  if (c.error) return { ok: false, error: c.error };
  var rows = crmReadAllRows(c.sheet);
  var out = [];
  for (var i = 0; i < rows.length; i++) out.push(crmRowPayload(rows[i]));
  Logger.log("[RTG crm] list ok rows=" + out.length);
  return {
    ok: true,
    columns: LEADS_CRM_COLUMNS,
    statuses: CRM_STATUSES,
    team: crmReadTeam(c.ss),
    rows: out,
    total: out.length,
    fetchedAt: new Date().toISOString()
  };
}

/** Snapshot / source facts for the detail panel. Read-only: never creates or
 * repairs LEADS_RAW. Before the first meeting, Submission ID / Source /
 * Kaynak Detayı live in Script Properties (see saveLeadMeta); afterwards in
 * the RAW row. */
function crmSnapshotInfo(ss, id) {
  var meta = readLeadMeta(id);
  var info = {
    exists: false,
    legacy: false,
    date: "",
    submissionId: meta.s || "",
    source: meta.o || "",
    sourceDetail: meta.k || ""
  };
  var raw = ss.getSheetByName(LEADS_RAW_SHEET_NAME);
  if (!raw || raw.getLastRow() < 2 || raw.getLastColumn() < 1) return info;
  var rawRow = findRowIndexById(raw, id);
  if (rawRow < 1) return info;
  var headers = raw.getRange(1, 1, 1, raw.getLastColumn()).getValues()[0];
  var values = raw.getRange(rawRow, 1, 1, raw.getLastColumn()).getValues()[0];
  function rawValue(name) {
    var idx = headerIndex(headers, name);
    return idx < 0 ? "" : crmCellToString(values[idx]);
  }
  info.exists = true;
  info.date = rawValue("Profil Snapshot Tarihi");
  info.legacy = info.date === ""; // written at submission time by the old flow
  info.submissionId = rawValue("Submission ID") || info.submissionId;
  info.source = rawValue("Source") || info.source;
  info.sourceDetail = rawValue("Kaynak Detayı") || info.sourceDetail;
  return info;
}

function crmReadActivity(ss, id, limit) {
  var sheet = ss.getSheetByName(CRM_AUDIT_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var n = sheet.getLastRow() - 1;
  var ids = sheet.getRange(2, 2, n, 1).getValues();
  var hits = [];
  for (var i = n - 1; i >= 0 && hits.length < limit; i--) {
    if (ids[i][0] === id) hits.push(i + 2);
  }
  var out = [];
  for (var j = 0; j < hits.length; j++) {
    var v = sheet.getRange(hits[j], 1, 1, CRM_AUDIT_COLUMNS.length).getValues()[0].map(crmCellToString);
    out.push({ at: v[0], action: v[2], field: v[3], from: v[4], to: v[5], by: v[6] });
  }
  return out;
}

function crmGet(body) {
  var c = crmOpen();
  if (c.error) return { ok: false, error: c.error };
  if (typeof body.id !== "string" || !body.id) return { ok: false, error: "missing_id" };
  var sheetRow = findRowIndexById(c.sheet, body.id);
  if (sheetRow < 1) return { ok: false, error: "not_found" };
  return {
    ok: true,
    row: crmRowPayload(crmReadRowValues(c.sheet, sheetRow)),
    snapshot: crmSnapshotInfo(c.ss, body.id),
    activity: crmReadActivity(c.ss, body.id, 15)
  };
}

/** Best-effort audit trail. Never throws, never blocks the write it records. */
function crmAppendAudit(ss, entries) {
  if (!entries.length) return;
  try {
    var sheet = ss.getSheetByName(CRM_AUDIT_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CRM_AUDIT_SHEET_NAME);
      sheet.appendRow(CRM_AUDIT_COLUMNS);
      sheet.setFrozenRows(1);
    }
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      sheet.appendRow([e.at, e.id, e.action, e.field, crmNeutralizeFormula(e.from), crmNeutralizeFormula(e.to), e.by]);
    }
  } catch (err) {
    Logger.log("[RTG crm] WARNING: audit log write failed: " + (err && err.message));
  }
}

function crmAuditValue(field, value) {
  return CRM_AUDIT_MASKED.indexOf(field) !== -1 ? "(gizli)" : value;
}

/** Returns "" when valid, otherwise an error code. `current` is the cell's
 * present value: an unchanged legacy value is never rejected. */
function crmValidateField(field, value, current, team) {
  if (field === "Durum") return CRM_STATUSES.indexOf(value) === -1 ? "invalid_status" : "";
  if (field === "Sorumlu") {
    if (value !== "" && value !== current && team.length > 0 && team.indexOf(value) === -1) return "invalid_responsible";
    return "";
  }
  if (field === "Tercih Edilen İletişim") {
    if (value !== "" && value !== current && value !== "whatsapp" && value !== "phone") return "invalid_value";
    return "";
  }
  if (field === "İlk Görüşme Tarihi") {
    if (value !== "" && !CRM_DATE_PATTERN.test(value) && !/^\d{4}-\d{2}-\d{2}T/.test(value)) return "invalid_date";
    return "";
  }
  if (field === "Email") {
    if (value !== "" && value !== current && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "invalid_email";
    return "";
  }
  if (field === "Drive Folder") {
    // Only https links: a stored "javascript:" URL must never become a live link.
    if (value !== "" && value !== current && !/^https:\/\//i.test(value)) return "invalid_url";
    return "";
  }
  if (field === "Mentor ID") {
    if (value !== "" && value !== current && !/^[A-Za-z0-9_.\- ]{1,64}$/.test(value)) return "invalid_mentor_id";
    return "";
  }
  if ((field === "Ad" || field === "Soyad") && value === "") return "invalid_value";
  return "";
}

/**
 * Applies validated changes to ONE lead, addressed by ID.
 *
 * Order matters: every non-Durum field is written first, then Durum, then —
 * only when Durum is STATUS_MET — runFirstMeetingLifecycle(), so a RAW
 * snapshot taken by this very request already contains the profile edits
 * made in the same request.
 *
 * Workflow rule (mirrors onEdit): an outcome status is rejected while the
 * lead's stored "İlk Görüşme Tarihi" is empty. Nothing is written when any
 * part of the request is invalid.
 */
function crmApplyChanges(c, id, changes, expectedVersion, actor, action) {
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) return { ok: false, error: "invalid_changes" };
  var fields = Object.keys(changes);
  if (fields.length === 0) return { ok: false, error: "no_changes" };

  var sheetRow = findRowIndexById(c.sheet, id);
  if (sheetRow < 1) return { ok: false, error: "not_found" };

  var before = crmReadRowValues(c.sheet, sheetRow);
  if (expectedVersion && expectedVersion !== crmRowVersion(before)) {
    return { ok: false, error: "conflict", row: crmRowPayload(before) };
  }

  var team = crmReadTeam(c.ss);
  var clean = {};
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    var idx = LEADS_CRM_COLUMNS.indexOf(field);
    if (idx < 0) return { ok: false, error: "unknown_field", field: field };
    if (CRM_READONLY_FIELDS.indexOf(field) !== -1) return { ok: false, error: "field_not_editable", field: field };
    if (typeof changes[field] !== "string") return { ok: false, error: "invalid_value", field: field };
    var value = crmCleanText(changes[field]);
    if (value.length > (CRM_MAX_LENGTH[field] || CRM_DEFAULT_MAX_LENGTH)) return { ok: false, error: "value_too_long", field: field };
    var problem = crmValidateField(field, value, before[idx], team);
    if (problem) return { ok: false, error: problem, field: field };
    clean[field] = value;
  }

  var durumIdx = LEADS_CRM_COLUMNS.indexOf("Durum");
  var dateIdx = LEADS_CRM_COLUMNS.indexOf("İlk Görüşme Tarihi");
  var newDurum = Object.prototype.hasOwnProperty.call(clean, "Durum") ? clean["Durum"] : null;
  var effectiveDurum = newDurum !== null ? newDurum : before[durumIdx];

  if (newDurum !== null && STATUS_OUTCOMES.indexOf(newDurum) !== -1 && before[dateIdx] === "") {
    return { ok: false, error: "first_meeting_required" };
  }
  if (Object.prototype.hasOwnProperty.call(clean, "İlk Görüşme Tarihi") && clean["İlk Görüşme Tarihi"] === "" && effectiveDurum !== STATUS_NOT_MET) {
    return { ok: false, error: "first_meeting_date_required" };
  }

  for (var f in clean) {
    if (f === "Durum" || !Object.prototype.hasOwnProperty.call(clean, f)) continue;
    c.sheet.getRange(sheetRow, LEADS_CRM_COLUMNS.indexOf(f) + 1).setValue(crmNeutralizeFormula(clean[f]));
  }
  if (newDurum !== null) c.sheet.getRange(sheetRow, durumIdx + 1).setValue(newDurum);

  var lifecycle = null;
  if (newDurum === STATUS_MET) {
    lifecycle = runFirstMeetingLifecycle(c.ss, c.sheet, sheetRow, LEADS_CRM_COLUMNS, c.tz, "[RTG crm]");
  }
  SpreadsheetApp.flush();

  var after = crmReadRowValues(c.sheet, sheetRow);
  var at = new Date().toISOString();
  var audit = [];
  for (var g in clean) {
    if (!Object.prototype.hasOwnProperty.call(clean, g)) continue;
    var gi = LEADS_CRM_COLUMNS.indexOf(g);
    if (before[gi] !== after[gi]) {
      audit.push({ at: at, id: id, action: action, field: g, from: crmAuditValue(g, before[gi]), to: crmAuditValue(g, after[gi]), by: actor });
    }
  }
  if (lifecycle && lifecycle.dateStamped) {
    audit.push({ at: at, id: id, action: "lifecycle", field: "İlk Görüşme Tarihi", from: "", to: after[dateIdx], by: actor });
  }
  if (lifecycle && lifecycle.snapshot === "created") {
    audit.push({ at: at, id: id, action: "lifecycle", field: "LEADS_RAW", from: "", to: "snapshot oluşturuldu", by: actor });
  }
  crmAppendAudit(c.ss, audit);

  Logger.log("[RTG crm] " + action + " ok id=" + id + " fields=" + fields.join(",") +
    (lifecycle ? " snapshot=" + lifecycle.snapshot : ""));
  return { ok: true, row: crmRowPayload(after), lifecycle: lifecycle };
}

function crmUpdate(body) {
  var c = crmOpen();
  if (c.error) return { ok: false, error: c.error };
  if (typeof body.id !== "string" || !body.id) return { ok: false, error: "missing_id" };
  var expected = typeof body.expectedVersion === "string" ? body.expectedVersion : "";
  return crmApplyChanges(c, body.id, body.changes, expected, crmActor(body), "update");
}

function crmBulkUpdate(body) {
  var c = crmOpen();
  if (c.error) return { ok: false, error: c.error };
  var ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0) return { ok: false, error: "missing_ids" };
  if (ids.length > CRM_MAX_BULK) return { ok: false, error: "too_many_ids" };
  if (!body.changes || typeof body.changes !== "object" || Array.isArray(body.changes)) return { ok: false, error: "invalid_changes" };
  var changeFields = Object.keys(body.changes);
  if (changeFields.length === 0) return { ok: false, error: "no_changes" };
  for (var i = 0; i < changeFields.length; i++) {
    if (CRM_BULK_FIELDS.indexOf(changeFields[i]) === -1) return { ok: false, error: "bulk_field_not_allowed", field: changeFields[i] };
  }

  var actor = crmActor(body);
  var seen = {};
  var results = [];
  var updated = 0;
  for (var j = 0; j < ids.length; j++) {
    var id = ids[j];
    if (typeof id !== "string" || !id || seen[id]) { results.push({ id: String(id), ok: false, error: "invalid_id" }); continue; }
    seen[id] = true;
    var r = crmApplyChanges(c, id, body.changes, "", actor, "bulk_update");
    if (r.ok) { updated++; results.push({ id: id, ok: true, row: r.row, lifecycle: r.lifecycle }); }
    else results.push({ id: id, ok: false, error: r.error });
  }
  Logger.log("[RTG crm] bulk_update done requested=" + ids.length + " updated=" + updated + " fields=" + changeFields.join(","));
  return { ok: true, results: results, updated: updated, failed: results.length - updated };
}

/** Manual lead. Its own action and its own validation — not the public form
 * endpoint. Source is stored as "manual" (Script Properties, shown in the
 * detail panel and copied to the RAW snapshot later). */
function crmCreate(body) {
  var c = crmOpen();
  if (c.error) return { ok: false, error: c.error };
  var fields = body.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return { ok: false, error: "invalid_fields" };
  var requestId = typeof body.requestId === "string" ? body.requestId : "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(requestId)) return { ok: false, error: "invalid_request_id" };

  var clean = {};
  var keys = Object.keys(fields);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (CRM_CREATE_FIELDS.indexOf(key) === -1) return { ok: false, error: "unknown_field", field: key };
    if (typeof fields[key] !== "string") return { ok: false, error: "invalid_value", field: key };
    var value = crmCleanText(fields[key]);
    if (value.length > (CRM_MAX_LENGTH[key] || CRM_DEFAULT_MAX_LENGTH)) return { ok: false, error: "value_too_long", field: key };
    var problem = crmValidateField(key, value, "", crmReadTeam(c.ss));
    if (problem) return { ok: false, error: problem, field: key };
    clean[key] = value;
  }
  if (!clean["Ad"] || !clean["Soyad"]) return { ok: false, error: "missing_name" };
  if (!clean["Email"] && !clean["Telefon"]) return { ok: false, error: "missing_contact" };

  var subId = "manual:" + requestId;
  var existingId = findExistingLeadId(subId);
  if (existingId) {
    var existingRow = findRowIndexById(c.sheet, existingId);
    return { ok: true, id: existingId, existing: true, row: existingRow > 0 ? crmRowPayload(crmReadRowValues(c.sheet, existingRow)) : null };
  }

  var id = generateId("L", Utilities.getUuid());
  if (rowExistsById(c.sheet, id)) id += "-" + String(Utilities.getUuid()).replace(/-/g, "").slice(0, 6).toUpperCase();
  function v(name) { return Object.prototype.hasOwnProperty.call(clean, name) ? crmNeutralizeFormula(clean[name]) : ""; }
  var row = [id, new Date().toISOString()]
    .concat([
      v("Ad"), v("Soyad"), v("Email"), v("Telefon"), v("Tercih Edilen İletişim"),
      v("Aşama"), v("Eğitim Durumu"), v("İlgi Alanı"), v("İngilizce Seviyesi"), v("Almanca Seviyesi"),
      v("Almanya Hedefi"), v("Zaman Çizelgesi"), v("Hakkında / Deneyim"), v("Mesaj"),
      "Manuel giriş"
    ])
    .concat([v("Sorumlu"), STATUS_NOT_MET, "", v("Notlar"), "", ""]);
  appendVerifiedRow(c.sheet, LEADS_CRM_SHEET_NAME, LEADS_CRM_COLUMNS.length, id, row);

  try {
    saveLeadMeta(id, subId, "", "manual");
  } catch (err) {
    Logger.log("[RTG crm] WARNING: manual lead saved but saveLeadMeta failed: " + (err && err.message));
  }
  crmAppendAudit(c.ss, [{ at: new Date().toISOString(), id: id, action: "create", field: "(yeni lead)", from: "", to: "manuel", by: crmActor(body) }]);
  Logger.log("[RTG crm] create ok id=" + id);
  return { ok: true, id: id, existing: false, row: crmRowPayload(crmReadRowValues(c.sheet, findRowIndexById(c.sheet, id))) };
}
