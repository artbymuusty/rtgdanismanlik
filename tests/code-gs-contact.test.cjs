/**
 * Tests the REAL Code.gs's `type: "contact"` action (the /iletisim page's
 * "Bize yaz" composer) inside a Node vm — no network, no Google account.
 * Entirely isolated from LEADS_CRM/LEADS_RAW: these tests assert no sheet
 * row is ever created by a contact submission, alongside the mail-sending
 * behavior itself (captured by the harness's MailApp mock).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const H = require("./helpers/gas-harness.cjs");

function freshWithMail(opts = {}) {
  return H.fresh(Object.assign({ contactEmail: "destek@example.com" }, opts));
}

test("valid submission: sends exactly one e-mail, returns ok + a message ID", () => {
  const env = freshWithMail();
  const before = env.mails.length;
  const r = H.post(env, H.contactBody());
  assert.equal(r.ok, true);
  assert.match(r.id, /^RTG-CONTACT-\d{8}T\d{6}-[A-F0-9]{6}$/);
  assert.equal(env.mails.length, before + 1);
});

test("Reply-To is the visitor's own e-mail, recipient is CONTACT_EMAIL, never hard-coded", () => {
  const env = freshWithMail({ contactEmail: "another-address@example.com" });
  H.post(env, H.contactBody({ email: "visitor.reply@example.com" }));
  const mail = env.mails[env.mails.length - 1];
  assert.equal(mail.to, "another-address@example.com");
  assert.equal(mail.replyTo, "visitor.reply@example.com");
});

test("subject and body carry category, subject, message, timestamp and message ID — never a raw enum key", () => {
  const env = freshWithMail();
  const r = H.post(env, H.contactBody({ category: "technical", subject: "Login broken" }));
  const mail = env.mails[env.mails.length - 1];
  assert.match(mail.subject, /^\[RTG İletişim\] Teknik \/ Sistem Sorunu — Login broken$/);
  assert.match(mail.body, /RTG DANIŞMANLIK/);
  assert.match(mail.body, /Login broken/);
  assert.match(mail.body, new RegExp(r.id));
});

test("invalid email: rejected with a CONTACT_-prefixed diagnostic code, no mail sent", () => {
  const env = freshWithMail();
  const before = env.mails.length;
  const r = H.post(env, H.contactBody({ email: "not-an-email" }));
  assert.equal(r.ok, false);
  assert.equal(r.error, "CONTACT_INVALID_EMAIL");
  assert.equal(env.mails.length, before);
});

test("email over 254 characters: rejected", () => {
  const env = freshWithMail();
  const long = "a".repeat(250) + "@x.com"; // > 254 chars total
  const r = H.post(env, H.contactBody({ email: long }));
  assert.equal(r.ok, false);
  assert.equal(r.error, "CONTACT_INVALID_EMAIL");
});

test("empty fields: each required field rejected on its own, with its own diagnostic code", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ email: "" })).error, "CONTACT_INVALID_EMAIL");
  assert.equal(H.post(env, H.contactBody({ subject: "" })).error, "CONTACT_INVALID_SUBJECT");
  assert.equal(H.post(env, H.contactBody({ subject: "   " })).error, "CONTACT_INVALID_SUBJECT"); // whitespace-only
  assert.equal(H.post(env, H.contactBody({ message: "" })).error, "CONTACT_INVALID_MESSAGE");
});

test("category validation: only the fixed enum is accepted, arbitrary strings rejected", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ category: "not-a-real-category" })).error, "CONTACT_INVALID_CATEGORY");
  assert.equal(H.post(env, H.contactBody({ category: "" })).error, "CONTACT_INVALID_CATEGORY");
  for (const c of ["general", "consulting", "billing", "complaint", "technical", "website", "other"]) {
    assert.equal(H.post(env, H.contactBody({ category: c })).ok, true);
  }
});

test("character limits: subject > 160 and message > 5000 are rejected", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ subject: "s".repeat(161) })).error, "CONTACT_INVALID_SUBJECT");
  assert.equal(H.post(env, H.contactBody({ subject: "s".repeat(160) })).ok, true); // exactly at the limit is fine
  assert.equal(H.post(env, H.contactBody({ message: "m".repeat(5001) })).error, "CONTACT_INVALID_MESSAGE");
  assert.equal(H.post(env, H.contactBody({ message: "m".repeat(5000) })).ok, true);
});

test("secret check: wrong or missing secret is rejected before any validation runs (shared with lead/mentor/crm — unchanged)", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ secret: H.WRONG })).error, "unauthorized");
  assert.equal(H.post(env, Object.assign({}, H.contactBody(), { secret: undefined })).error, "unauthorized");
});

test("CONTACT_NOT_CONFIGURED: CONTACT_EMAIL missing from Script Properties never sends and never leaks the missing value", () => {
  const env = H.fresh(); // no contactEmail option -> CONTACT_EMAIL Script Property absent
  const before = env.mails.length;
  const r = H.post(env, H.contactBody());
  assert.equal(r.ok, false);
  assert.equal(r.error, "CONTACT_NOT_CONFIGURED");
  assert.equal(env.mails.length, before);
});

test("CONTACT_MAIL_SEND_FAILED: a MailApp exception (e.g. missing authorization or quota) is caught, never thrown, and the code carries a PII-free diagnostic hint", () => {
  const env = freshWithMail();
  env.state.failMail = true; // harness throws "Service invoked too many times for one day: sendEmail"
  const r = H.post(env, H.contactBody({ email: "should.never.appear@example.com", message: "should never appear either" }));
  assert.equal(r.ok, false);
  assert.match(r.error, /^CONTACT_MAIL_SEND_FAILED:/);
  assert.match(r.error, /Service invoked too many times/); // the exception's own system message rides along...
  assert.ok(!r.error.includes("should.never.appear@example.com")); // ...but never the visitor's own data
  assert.ok(!r.error.includes("should never appear either"));
});

test("testContactMailAuthorization(): a manual, isolated diagnostic — never reachable via doPost, never touches CRM/RAW", () => {
  const env = freshWithMail();
  const crmBefore = H.dataRows(env.sheets.LEADS_CRM).length;
  // No body.type value routes a public POST to this function — doPost only
  // ever dispatches to handleContactRequest() for the literal "contact"
  // type; anything else falls through to the ordinary public-form checks.
  const viaPost = H.post(env, Object.assign({}, H.contactBody(), { type: "testContactMailAuthorization" }));
  assert.equal(viaPost.error, "missing_submission_id");
  assert.equal(env.mails.length, 0);
  // Only callable directly (as a developer would from the Apps Script editor's Run button):
  H.run(env, "testContactMailAuthorization()");
  assert.equal(H.dataRows(env.sheets.LEADS_CRM).length, crmBefore);
  assert.equal(env.mails.length, 1); // sent its own real test e-mail, independent of the contact form
  assert.equal(env.mails[0].to, "destek@example.com");
});

test("testContactMailAuthorization(): a MailApp failure (e.g. authorization pending) is logged, never thrown", () => {
  const env = freshWithMail();
  env.state.failMail = true;
  H.run(env, "testContactMailAuthorization()"); // must not throw even though sendEmail() does
  assert.equal(env.mails.length, 0);
  assert.ok(env.logs.some((l) => l.includes("FAILED")));
});

test("testContactMailAuthorization(): does NOT early-return when only the quota check fails — still attempts sendEmail()", () => {
  const env = freshWithMail();
  env.state.failQuotaOnly = true; // reproduces the exact reported symptom: quota check throws, sendEmail is untouched
  H.run(env, "testContactMailAuthorization()");
  assert.equal(env.mails.length, 1); // sendEmail() was still attempted and succeeded
  assert.ok(env.logs.some((l) => l.includes("getRemainingDailyQuota() FAILED")));
  assert.ok(env.logs.some((l) => l.includes("MailApp.sendEmail() succeeded")));
});

test("isolation: a contact submission never touches LEADS_CRM or LEADS_RAW", () => {
  const env = freshWithMail();
  const crmBefore = H.dataRows(env.sheets.LEADS_CRM).length;
  const rawBefore = H.dataRows(env.sheets.LEADS_RAW).length;
  H.post(env, H.contactBody());
  assert.equal(H.dataRows(env.sheets.LEADS_CRM).length, crmBefore);
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, rawBefore);
});

test("logs never contain the visitor's e-mail or message body, only category/id/outcome", () => {
  const env = freshWithMail();
  const r = H.post(env, H.contactBody({ email: "secret.person@example.com", message: "very private message contents" }));
  const joined = env.logs.join("\n");
  assert.ok(!joined.includes("secret.person@example.com"));
  assert.ok(!joined.includes("very private message contents"));
  assert.ok(joined.includes(r.id));
});

test("public form (lead) and CRM routing are unaffected by the contact branch", () => {
  const env = freshWithMail({ team: ["Ayşe Kaya"] });
  const leadResult = H.post(env, H.leadBody());
  assert.equal(leadResult.ok, true);
  const listResult = H.crm(env, "crm_list");
  assert.equal(listResult.ok, true);
  assert.equal(listResult.total, 1);
});

test("testContactMailAuthorization(): never logs the real CONTACT_EMAIL value, only whether it is set", () => {
  const env = freshWithMail({ contactEmail: "genuinely-secret-inbox@example.com" });
  H.run(env, "testContactMailAuthorization()");
  const joined = env.logs.join("\n");
  assert.ok(!joined.includes("genuinely-secret-inbox@example.com"));
  assert.ok(joined.includes("CONTACT_EMAIL is set."));
});

test("appsscript.reference.json declares exactly the two scopes Code.gs's own service calls require — nothing missing, nothing extra", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "integrations", "google-apps-script", "appsscript.reference.json"), "utf8"));
  const scopes = manifest.oauthScopes;
  assert.ok(Array.isArray(scopes));
  assert.deepEqual(
    [...scopes].sort(),
    ["https://www.googleapis.com/auth/script.send_mail", "https://www.googleapis.com/auth/spreadsheets"].sort(),
  );
  // The webapp block must stay byte-for-byte what production already has —
  // this reference file must never suggest changing execute-as/access.
  assert.deepEqual(manifest.webapp, { executeAs: "USER_DEPLOYING", access: "ANYONE_ANONYMOUS" });
});
