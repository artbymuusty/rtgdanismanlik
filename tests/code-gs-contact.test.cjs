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

test("invalid email: rejected, no mail sent", () => {
  const env = freshWithMail();
  const before = env.mails.length;
  const r = H.post(env, H.contactBody({ email: "not-an-email" }));
  assert.equal(r.ok, false);
  assert.equal(r.error, "invalid_email");
  assert.equal(env.mails.length, before);
});

test("email over 254 characters: rejected", () => {
  const env = freshWithMail();
  const long = "a".repeat(250) + "@x.com"; // > 254 chars total
  const r = H.post(env, H.contactBody({ email: long }));
  assert.equal(r.ok, false);
  assert.equal(r.error, "invalid_email");
});

test("empty fields: each required field rejected on its own", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ email: "" })).error, "invalid_email");
  assert.equal(H.post(env, H.contactBody({ subject: "" })).error, "invalid_subject");
  assert.equal(H.post(env, H.contactBody({ subject: "   " })).error, "invalid_subject"); // whitespace-only
  assert.equal(H.post(env, H.contactBody({ message: "" })).error, "invalid_message");
});

test("category validation: only the fixed enum is accepted, arbitrary strings rejected", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ category: "not-a-real-category" })).error, "invalid_category");
  assert.equal(H.post(env, H.contactBody({ category: "" })).error, "invalid_category");
  for (const c of ["general", "consulting", "billing", "complaint", "technical", "website", "other"]) {
    assert.equal(H.post(env, H.contactBody({ category: c })).ok, true);
  }
});

test("character limits: subject > 160 and message > 5000 are rejected", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ subject: "s".repeat(161) })).error, "invalid_subject");
  assert.equal(H.post(env, H.contactBody({ subject: "s".repeat(160) })).ok, true); // exactly at the limit is fine
  assert.equal(H.post(env, H.contactBody({ message: "m".repeat(5001) })).error, "invalid_message");
  assert.equal(H.post(env, H.contactBody({ message: "m".repeat(5000) })).ok, true);
});

test("secret check: wrong or missing secret is rejected before any validation runs", () => {
  const env = freshWithMail();
  assert.equal(H.post(env, H.contactBody({ secret: H.WRONG })).error, "unauthorized");
  assert.equal(H.post(env, Object.assign({}, H.contactBody(), { secret: undefined })).error, "unauthorized");
});

test("not_configured: CONTACT_EMAIL missing from Script Properties never sends and never leaks the missing value", () => {
  const env = H.fresh(); // no contactEmail option -> CONTACT_EMAIL Script Property absent
  const before = env.mails.length;
  const r = H.post(env, H.contactBody());
  assert.equal(r.ok, false);
  assert.equal(r.error, "not_configured");
  assert.equal(env.mails.length, before);
});

test("mail_send_failed: a MailApp exception (e.g. quota) is caught and reported without throwing", () => {
  const env = freshWithMail();
  env.state.failMail = true;
  const r = H.post(env, H.contactBody());
  assert.equal(r.ok, false);
  assert.equal(r.error, "mail_send_failed");
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
