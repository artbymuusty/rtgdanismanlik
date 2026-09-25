/**
 * Regression suite for the security hardening applied to the public,
 * unauthenticated lead (/basvuru) and mentor-application (/bize-katilin)
 * write paths in the real Code.gs:
 *   - every cell they write is neutralized against Sheets formula
 *     injection (crmNeutralizeFormula), same as every other write path
 *     in this file (crmApplyChanges, crmCreate, crmAppendAudit, and now
 *     snapshotLeadProfileToRaw's RAW row too);
 *   - every field is length/format-validated server-side, never trusting
 *     the Next.js zod schema was actually the caller;
 *   - the shared API_SECRET comparison is constant-time.
 * A normal, legitimate submission must behave exactly as before.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const H = require("./helpers/gas-harness.cjs");

const MET = "İlk görüşme yapıldı";
const NOT = "İlk görüşme yapılmadı";

function meet(env, row = 2) {
  H.uiEdit(env, row, "Durum", MET, NOT);
}

test("formula-like lead fields are neutralized in LEADS_CRM (not executed on open)", () => {
  const e = H.fresh();
  const evil = "=IMPORTXML(\"https://evil.example/x\",\"//a\")";
  const r = H.post(
    e,
    H.leadBody({
      payload: H.payload({ firstName: evil, background: "+HYPERLINK(\"https://evil.example\")", message: "@SUM(A1:A9)" }),
    }),
  );
  assert.ok(r.ok);
  const row = H.dataRows(e.sheets.LEADS_CRM)[0];
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Ad"), "'" + evil);
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Hakkında / Deneyim"), "'+HYPERLINK(\"https://evil.example\")");
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Mesaj"), "'@SUM(A1:A9)");
  // None of the raw formula strings appear un-prefixed anywhere in the row.
  assert.ok(!row.some((v) => v === evil));
});

test("formula-like referralSourceOther is neutralized once it reaches LEADS_RAW (via the first-meeting snapshot)", () => {
  const e = H.fresh();
  const evil = "-cmd|' /C calc'!A1";
  H.post(e, H.leadBody({ payload: H.payload({ referralSource: "other", referralSourceOther: evil }) }));
  meet(e);
  const raw = H.dataRows(e.sheets.LEADS_RAW)[0];
  const idx = e.RAW.indexOf("Kaynak Detayı");
  assert.equal(raw[idx], "'" + evil);
});

test("formula-like mentor-application fields are neutralized", () => {
  const e = H.fresh();
  const evil = "=1+1";
  const r = H.post(e, {
    secret: H.SECRET,
    type: "mentor_application",
    submissionId: "m-evil",
    payload: { firstName: evil, lastName: "b", phone: "+491511234567", email: "e@example.com", germanyExperience: "x", motivation: "y" },
  });
  assert.ok(r.ok);
  const sheet = e.sheets.MENTOR_APPLICATIONS;
  const headerRow = sheet.rows[0];
  const adIdx = headerRow.indexOf("Ad");
  assert.equal(sheet.rows[1][adIdx], "'" + evil);
});

test("normal names/phones/URLs are never altered by the new sanitization", () => {
  const e = H.fresh();
  const r = H.post(
    e,
    H.leadBody({
      payload: H.payload({ firstName: "Anne-Marie", phone: "+90 555 123 45 67", background: "I study at TU-Berlin, see tu.berlin/info" }),
    }),
  );
  assert.ok(r.ok);
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Ad"), "Anne-Marie");
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Telefon"), "+90 555 123 45 67");
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Hakkında / Deneyim"), "I study at TU-Berlin, see tu.berlin/info");
});

test("lead: invalid e-mail is rejected server-side, without ever reaching the sheet", () => {
  const e = H.fresh();
  const r = H.post(e, H.leadBody({ payload: H.payload({ email: "not-an-email" }) }));
  assert.deepEqual(r, { ok: false, error: "invalid_field:email" });
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 0);
});

test("lead: an over-length field is rejected server-side", () => {
  const e = H.fresh();
  const r = H.post(e, H.leadBody({ payload: H.payload({ background: "x".repeat(2001) }) }));
  assert.deepEqual(r, { ok: false, error: "invalid_field:background" });
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 0);
});

test("mentor application: invalid e-mail is rejected server-side", () => {
  const e = H.fresh();
  const r = H.post(e, {
    secret: H.SECRET,
    type: "mentor_application",
    submissionId: "m-bad-email",
    payload: { firstName: "a", lastName: "b", phone: "1", email: "nope", germanyExperience: "x", motivation: "y" },
  });
  assert.deepEqual(r, { ok: false, error: "invalid_field:email" });
  // Rejected before getSheet() ever ran — the sheet isn't even created.
  assert.equal(e.sheets.MENTOR_APPLICATIONS, undefined);
});

test("mentor application: an over-length field is rejected server-side", () => {
  const e = H.fresh();
  const r = H.post(e, {
    secret: H.SECRET,
    type: "mentor_application",
    submissionId: "m-too-long",
    payload: { firstName: "a", lastName: "b", phone: "1", email: "e@example.com", germanyExperience: "x".repeat(3001), motivation: "y" },
  });
  assert.deepEqual(r, { ok: false, error: "invalid_field:germanyExperience" });
});

test("secret comparison: correct secret still authenticates, wrong secret still rejected (constant-time compare)", () => {
  const e = H.fresh();
  assert.ok(H.post(e, H.leadBody()).ok);
  assert.deepEqual(H.post(e, H.leadBody({ secret: H.WRONG }, H.SID(2))), { ok: false, error: "unauthorized" });
  assert.deepEqual(H.post(e, H.leadBody({ secret: "" }, H.SID(3))), { ok: false, error: "unauthorized" });
  assert.deepEqual(H.post(e, H.leadBody({ secret: H.SECRET + "x" }, H.SID(4))), { ok: false, error: "unauthorized" });
  assert.deepEqual(H.post(e, H.leadBody({ secret: undefined }, H.SID(5))), { ok: false, error: "unauthorized" });
});

test("no PII or secret is ever leaked in logs by the new validation/neutralization paths", () => {
  const e = H.fresh();
  H.post(e, H.leadBody({ payload: H.payload({ firstName: "=EVIL()", email: "not-an-email" }) }, H.SID(1)));
  H.post(e, H.leadBody({ payload: H.payload({ background: "x".repeat(3000) }) }, H.SID(2)));
  const logs = e.logs.join("\n");
  assert.ok(!logs.includes("=EVIL()"));
  assert.ok(!logs.includes("not-an-email"));
  assert.ok(!logs.includes(H.SECRET));
});
