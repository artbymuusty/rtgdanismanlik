/**
 * Regression suite for the public form + CRM-first lifecycle in the real Code.gs.
 * These behaviours are what the CRM UI must never break:
 *   form -> LEADS_CRM only (RAW +0); "İlk görüşme yapıldı" -> date + ONE RAW
 *   snapshot; RAW/CRM independent afterwards; idempotent; outcome gating.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const H = require("./helpers/gas-harness.cjs");

const MET = "İlk görüşme yapıldı";
const NOT = "İlk görüşme yapılmadı";
const OUTCOMES = ["İletişim Kuruldu", "Süreçte", "Olumsuz Sonuçlandı", "Olumlu Sonuçlandı"];
const meet = (env, row = 2) => H.uiEdit(env, row, "Durum", MET, NOT);
const noLeaks = (env) => {
  const logs = env.logs.join("\n");
  for (const bad of [H.SECRET, H.WRONG, "Testvorname", "Testnachname", "test.person@example.com", "+491511234567", "Test message text", "GIZLI-KAYNAK"]) {
    assert.ok(!logs.includes(bad), `log leaks ${bad}`);
  }
};

test("new application: CRM +1, RAW +0, 23-cell row with defaults", () => {
  const e = H.fresh();
  const rawBefore = JSON.stringify(e.sheets.LEADS_RAW.rows);
  const r = H.post(e, H.leadBody());
  assert.ok(r.ok && /^RTG-L-/.test(r.id));
  assert.deepEqual(Object.keys(r).sort(), ["id", "ok"]);
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 1);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 0);
  assert.equal(JSON.stringify(e.sheets.LEADS_RAW.rows), rawBefore);
  const crm = e.sheets.LEADS_CRM;
  assert.equal(crm.rows[1].length, 23);
  assert.equal(H.cell(crm, 2, "Durum"), NOT);
  for (const c of ["Sorumlu", "İlk Görüşme Tarihi", "Notlar", "Mentor ID", "Drive Folder"]) assert.equal(H.cell(crm, 2, c), "", c);
  noLeaks(e);
});

test("form works with no RAW sheet at all and never creates one", () => {
  const e = H.makeEnv();
  const crm = e.ss.insertSheet("LEADS_CRM"); crm.rows.push(H.plain(H.run(e, "LEADS_CRM_COLUMNS")));
  assert.ok(H.post(e, H.leadBody()).ok);
  assert.equal(e.sheets.LEADS_RAW, undefined);
});

test("idempotency: same submissionId never duplicates, retry heals a missing CRM row, staff edits survive", () => {
  const e = H.fresh();
  const a = H.post(e, H.leadBody()), b = H.post(e, H.leadBody());
  assert.equal(a.id, b.id);
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 1);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 0);
  e.sheets.LEADS_CRM.rows[1][H.col(e.sheets.LEADS_CRM, "Sorumlu")] = "Ayşe";
  H.post(e, H.leadBody());
  assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Sorumlu"), "Ayşe");
  e.sheets.LEADS_CRM.rows.length = 1;
  assert.equal(H.post(e, H.leadBody()).id, a.id);
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 1);
  assert.notEqual(H.post(e, H.leadBody({}, H.SID(2))).id, a.id);
});

test("Durum -> 'İlk görüşme yapıldı': date stamped, exactly one RAW snapshot with the CRM ID", () => {
  const e = H.fresh();
  const r = H.post(e, H.leadBody());
  const crm = e.sheets.LEADS_CRM;
  crm.rows[1][H.col(crm, "Almanca Seviyesi")] = "b2"; // profile edited before the meeting
  meet(e);
  assert.equal(H.cell(crm, 2, "İlk Görüşme Tarihi"), "21.09.2026 10:30");
  const raw = e.sheets.LEADS_RAW;
  assert.equal(H.dataRows(raw).length, 1);
  assert.equal(raw.rows[1].length, 22);
  assert.equal(H.cell(raw, 2, "ID"), r.id);
  assert.equal(H.cell(raw, 2, "Almanca Seviyesi"), "b2", "snapshot = CRM profile at that moment");
  assert.equal(H.cell(raw, 2, "Created At"), H.cell(crm, 2, "Başvuru Tarihi"));
  assert.equal(H.cell(raw, 2, "Profil Snapshot Tarihi"), "21.09.2026 10:30");
  assert.equal(H.cell(raw, 2, "Notlar"), "");
  assert.equal(H.dataRows(crm).length, 1);
});

test("snapshot carries Kaynak Detayı / Source / Submission ID and never CRM management fields", () => {
  const e = H.fresh();
  H.post(e, H.leadBody({ payload: H.payload({ referralSource: "other", referralSourceOther: "GIZLI-KAYNAK" }) }, H.SID(7)));
  const crm = e.sheets.LEADS_CRM;
  for (const [k, v] of [["Sorumlu", "SORUMLU-X"], ["Mentor ID", "MENTOR-X"], ["Drive Folder", "DRIVE-X"], ["Notlar", "CRM-NOTU"]]) crm.rows[1][H.col(crm, k)] = v;
  meet(e);
  const raw = e.sheets.LEADS_RAW;
  assert.equal(H.cell(raw, 2, "Kaynak Detayı"), "GIZLI-KAYNAK");
  assert.equal(H.cell(raw, 2, "Source"), "rtg-website");
  assert.equal(H.cell(raw, 2, "Submission ID"), H.SID(7));
  const flat = JSON.stringify(raw.rows[1]);
  for (const bad of ["SORUMLU-X", "MENTOR-X", "DRIVE-X", "CRM-NOTU"]) assert.ok(!flat.includes(bad), bad);
  assert.ok(!Object.keys(e.props).some((k) => k.startsWith("RTG_LEAD_")), "bridging properties cleaned up");
});

test("same transition again: RAW +0 and the snapshot is untouched", () => {
  const e = H.fresh();
  H.post(e, H.leadBody());
  meet(e);
  const snap = JSON.stringify(e.sheets.LEADS_RAW.rows);
  meet(e); meet(e);
  H.uiEdit(e, 2, "Durum", NOT, MET); meet(e);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 1);
  assert.equal(JSON.stringify(e.sheets.LEADS_RAW.rows), snap);
});

test("CRM and RAW are independent after the snapshot", () => {
  const e = H.fresh();
  H.post(e, H.leadBody());
  meet(e);
  const rawSnap = JSON.stringify(e.sheets.LEADS_RAW.rows);
  H.uiEdit(e, 2, "Almanca Seviyesi", "b2", "b1");
  assert.equal(JSON.stringify(e.sheets.LEADS_RAW.rows), rawSnap, "CRM edit must not reach RAW");
  const crmSnap = JSON.stringify(e.sheets.LEADS_CRM.rows);
  e.sheets.LEADS_RAW.rows[1][H.col(e.sheets.LEADS_RAW, "Almanca Seviyesi")] = "c1";
  assert.equal(JSON.stringify(e.sheets.LEADS_CRM.rows), crmSnap, "RAW edit must not reach CRM");
});

test("outcome statuses are reverted before the first meeting and free afterwards", () => {
  for (const o of OUTCOMES) {
    const e = H.fresh();
    H.post(e, H.leadBody());
    H.uiEdit(e, 2, "Durum", o, NOT);
    assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Durum"), NOT, o);
    assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "İlk Görüşme Tarihi"), "");
    assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 0);
  }
  const e = H.fresh();
  H.post(e, H.leadBody());
  meet(e);
  let prev = MET;
  for (const o of [...OUTCOMES, "Süreçte", "Olumlu Sonuçlandı"]) { H.uiEdit(e, 2, "Durum", o, prev); assert.equal(H.cell(e.sheets.LEADS_CRM, 2, "Durum"), o); prev = o; }
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 1);
});

test("matches by ID only: identical name/e-mail leads, re-sorted rows", () => {
  const e = H.fresh();
  const same = { firstName: "Ayni", lastName: "Kisi", email: "ayni@example.com" };
  const a = H.post(e, H.leadBody({ payload: H.payload(same) }, H.SID(1)));
  const b = H.post(e, H.leadBody({ payload: H.payload({ ...same, germanLevel: "c2" }) }, H.SID(2)));
  const crm = e.sheets.LEADS_CRM;
  [crm.rows[1], crm.rows[2]] = [crm.rows[2], crm.rows[1]]; // b now first
  meet(e, 2);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 1);
  assert.equal(H.cell(e.sheets.LEADS_RAW, 2, "ID"), b.id);
  assert.equal(H.cell(e.sheets.LEADS_RAW, 2, "Almanca Seviyesi"), "c2");
  assert.notEqual(H.cell(e.sheets.LEADS_RAW, 2, "ID"), a.id);
});

test("a legacy RAW row (written at submission time) is never overwritten or duplicated", () => {
  const e = H.fresh();
  const id = "RTG-L-20260919T100000-LEGACY";
  const raw = e.sheets.LEADS_RAW, crm = e.sheets.LEADS_CRM;
  const rr = e.RAW.map(() => "");
  rr[H.col(raw, "ID")] = id; rr[H.col(raw, "Ad")] = "LEGACY-RAW-AD"; rr[H.col(raw, "Submission ID")] = H.SID(9);
  raw.rows.push(rr);
  const cr = e.CRM.map(() => "");
  cr[H.col(crm, "ID")] = id; cr[H.col(crm, "Ad")] = "CRM-AD"; cr[H.col(crm, "Durum")] = NOT;
  crm.rows.push(cr);
  const before = JSON.stringify(raw.rows);
  meet(e);
  assert.equal(JSON.stringify(raw.rows), before);
  assert.equal(H.dataRows(raw).length, 1);
  assert.equal(H.cell(crm, 2, "İlk Görüşme Tarihi"), "21.09.2026 10:30", "CRM date is still stamped");
  assert.deepEqual(H.post(e, H.leadBody({}, H.SID(9))), { ok: true, id }, "legacy submission retry: same id, no duplicate");
  assert.equal(H.dataRows(crm).length, 1);
  for (const sh of [raw, crm]) { assert.equal(sh.clearCalls, 0); assert.equal(sh.deleteColumnsCalls, 0); assert.equal(sh.setValuesCalls, 0); }
});

test("snapshot resilience: RAW append failure is logged, never throws, retry succeeds", () => {
  const e = H.fresh();
  H.post(e, H.leadBody());
  e.sheets.LEADS_RAW.failAppend = true;
  meet(e);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 0);
  assert.ok(/snapshot failed: Error: append_not_verified:LEADS_RAW/.test(e.logs.join("\n")));
  assert.ok(e.toasts.some((m) => m.includes("LEADS_RAW")));
  e.sheets.LEADS_RAW.failAppend = false;
  H.uiEdit(e, 2, "Durum", NOT, MET); meet(e);
  assert.equal(H.dataRows(e.sheets.LEADS_RAW).length, 1);
});

test("rejected requests: unauthorized / invalid input are logged without leaking secrets or personal data", () => {
  const e = H.fresh();
  assert.deepEqual(H.post(e, H.leadBody({ secret: H.WRONG })), { ok: false, error: "unauthorized" });
  assert.equal(H.post(e, "{not json").error, "invalid_json");
  assert.equal(H.post(e, "null").error, "invalid_json");
  assert.equal(JSON.parse(e.ctx.doPost({}).text).error, "invalid_request");
  assert.equal(H.post(e, H.leadBody({ submissionId: undefined })).error, "missing_submission_id");
  assert.equal(H.post(e, H.leadBody({ type: "SNEAKY" })).error, "unknown_type");
  const p = H.payload(); delete p.phone;
  assert.equal(H.post(e, H.leadBody({ payload: p })).error, "missing_field:phone");
  assert.equal(H.dataRows(e.sheets.LEADS_CRM).length, 0);
  assert.ok(!e.logs.join("\n").includes("SNEAKY"));
  noLeaks(e);
});

test("CRM header typo with data blocks writes with a detailed log; padded headers are tolerated", () => {
  const e = H.fresh();
  H.post(e, H.leadBody());
  e.sheets.LEADS_CRM.rows[0][22] = "Drive Klasör";
  assert.deepEqual(H.post(e, H.leadBody({}, H.SID(2))), { ok: false, error: "sheet_header_mismatch:LEADS_CRM" });
  assert.ok(/column 23: expected "Drive Folder", found "Drive Klasör"/.test(e.logs.join("\n")));
  const e2 = H.fresh(); e2.sheets.LEADS_CRM.rows[0][0] = " ID "; e2.sheets.LEADS_CRM.rows[0][18] = "Durum ";
  const a = H.post(e2, H.leadBody()); assert.ok(a.ok);
  assert.equal(H.post(e2, H.leadBody()).id, a.id);
});

test("mentor applications are unaffected", () => {
  const e = H.fresh();
  const r = H.post(e, { secret: H.SECRET, type: "mentor_application", submissionId: "m-1", payload: { firstName: "a", lastName: "b", phone: "1", email: "e@example.com", germanyExperience: "x", motivation: "y" } });
  assert.ok(r.ok && /^RTG-M-/.test(r.id));
});
