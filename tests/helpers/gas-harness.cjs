/**
 * Runs the REAL integrations/google-apps-script/Code.gs inside a Node `vm`
 * against in-memory stand-ins for the Apps Script services (Sheets,
 * Properties, Lock, Utilities, ContentService). No network, no Google
 * account, no secrets: everything below is a fake used only by tests.
 */
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

const SRC = fs.readFileSync(path.join(__dirname, "..", "..", "integrations", "google-apps-script", "Code.gs"), "utf8");

// Test-only fake values (never real credentials).
const SECRET = "TEST-ONLY-APPS-SCRIPT-SECRET";
const WRONG = "TEST-ONLY-WRONG-SECRET";

class Sheet {
  constructor(name) {
    this.name = name;
    this.rows = [];
    this.frozen = 0;
    this.failAppend = false;
    this.setValuesCalls = 0;
    this.clearCalls = 0;
    this.deleteColumnsCalls = 0;
    this.deleteRowCalls = 0;
  }
  getName() { return this.name; }
  getLastRow() { let n = this.rows.length; while (n > 0 && this.rows[n - 1].every((v) => v === "")) n--; return n; }
  getLastColumn() {
    let m = 0;
    for (const r of this.rows) for (let i = r.length; i > 0; i--) if (r[i - 1] !== "") { m = Math.max(m, i); break; }
    return m;
  }
  getRange(r, c, nr = 1, nc = 1) {
    const s = this;
    return {
      getValues() {
        const out = [];
        for (let i = 0; i < nr; i++) {
          const row = [];
          for (let j = 0; j < nc; j++) { const v = (s.rows[r - 1 + i] || [])[c - 1 + j]; row.push(v === undefined ? "" : v); }
          out.push(row);
        }
        return out;
      },
      getValue() { return this.getValues()[0][0]; },
      setValue(v) { s._set(r, c, v); },
      setValues(vals) { s.setValuesCalls++; vals.forEach((row, i) => row.forEach((v, j) => s._set(r + i, c + j, v))); },
      clearContent() { s.clearCalls++; },
      getSheet() { return s; }, getRow() { return r; }, getColumn() { return c; },
      getNumRows() { return nr; }, getNumColumns() { return nc; },
    };
  }
  _set(r, c, v) {
    while (this.rows.length < r) this.rows.push([]);
    const row = this.rows[r - 1];
    while (row.length < c) row.push("");
    row[c - 1] = v;
  }
  appendRow(arr) { if (this.failAppend) return; this.rows.push(arr.slice()); }
  setFrozenRows(n) { this.frozen = n; }
  deleteColumns() { this.deleteColumnsCalls++; }
  deleteRow() { this.deleteRowCalls++; }
}

function pad(n) { return String(n).padStart(2, "0"); }

function makeEnv({ secretProp = SECRET, now = new Date("2026-09-21T10:30:00Z"), contactEmail } = {}) {
  const logs = [];
  const toasts = [];
  const sheets = {};
  const mails = [];
  const state = { now, lockBusy: false, locksTaken: 0, uuid: 0, failMail: false };
  const props = { SPREADSHEET_ID: "sid" };
  if (secretProp) props.API_SECRET = secretProp;
  if (contactEmail) props.CONTACT_EMAIL = contactEmail;

  const ss = {
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => (sheets[n] = new Sheet(n)),
    getSpreadsheetTimeZone: () => "Europe/Istanbul",
    toast: (m) => toasts.push(m),
  };
  const ctx = {
    Logger: { log: (m) => logs.push(String(m)) },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => (k in props ? props[k] : null),
        setProperties: (o) => { if (props.__failSet) throw new Error("quota"); Object.assign(props, o); },
        deleteProperty: (k) => { delete props[k]; },
      }),
    },
    SpreadsheetApp: { openById: () => ss, flush: () => {}, newDataValidation: () => { throw new Error("not mocked"); } },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => { if (state.lockBusy) return false; state.locksTaken++; return true; },
        releaseLock: () => {},
      }),
    },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ text: t, setMimeType() { return this; } }) },
    MailApp: {
      sendEmail: (opts) => {
        if (state.failMail) throw new Error("Service invoked too many times for one day: sendEmail");
        mails.push(Object.assign({}, opts));
      },
    },
    Utilities: {
      // Only the two patterns Code.gs uses; fixed to UTC so tests are deterministic.
      formatDate: (d, _tz, fmt) => {
        const dd = pad(d.getUTCDate()), mm = pad(d.getUTCMonth() + 1), yy = d.getUTCFullYear();
        const hh = pad(d.getUTCHours()), mi = pad(d.getUTCMinutes()), ss2 = pad(d.getUTCSeconds());
        if (fmt === "dd.MM.yyyy HH:mm") return `${dd}.${mm}.${yy} ${hh}:${mi}`;
        return `${yy}${mm}${dd}T${hh}${mi}${ss2}`;
      },
      getUuid: () => { state.uuid++; const h = state.uuid.toString(16).padStart(8, "0"); return `${h}-0000-4000-8000-${h}${h.slice(0, 4)}`; },
    },
  };
  vm.createContext(ctx);
  // Freeze "now" for `new Date()` / Date.now() inside the script so timestamps are assertable.
  ctx.__NOW__ = now.getTime();
  vm.runInContext(
    "(function(){var R=Date;globalThis.Date=class extends R{constructor(...a){if(a.length===0){super(globalThis.__NOW__)}else{super(...a)}}static now(){return globalThis.__NOW__}}})();",
    ctx,
  );
  vm.runInContext(SRC, ctx);
  return { ctx, logs, toasts, sheets, mails, ss, props, state };
}

const run = (env, expr) => vm.runInContext(expr, env.ctx);
const plain = (v) => JSON.parse(JSON.stringify(v));

function fresh(opts = {}) {
  const env = makeEnv(opts);
  const RAW = plain(run(env, "LEADS_RAW_COLUMNS"));
  const CRM = plain(run(env, "LEADS_CRM_COLUMNS"));
  env.RAW = RAW;
  env.CRM = CRM;
  env.sheets.LEADS_RAW = env.ss.insertSheet("LEADS_RAW"); env.sheets.LEADS_RAW.rows.push(RAW.slice());
  env.sheets.LEADS_CRM = env.ss.insertSheet("LEADS_CRM"); env.sheets.LEADS_CRM.rows.push(CRM.slice());
  if (opts.team) {
    env.sheets.TEAM = env.ss.insertSheet("TEAM");
    env.sheets.TEAM.rows.push(["İsim"]);
    for (const n of opts.team) env.sheets.TEAM.rows.push([n]);
  }
  return env;
}

const payload = (o = {}) => Object.assign({
  stage: "researching", educationStatus: "university-student", interestArea: "computer-it", englishLevel: "b2", germanLevel: "b1",
  target: "masters", timeline: "6-months", background: "Test background text",
  firstName: "Testvorname", lastName: "Testnachname", phone: "+491511234567", email: "test.person@example.com",
  preferredContact: "whatsapp", referralSource: "instagram", message: "Test message text",
}, o);
const SID = (n) => `a${n}cdef12-0000-0000-0000-000000000000`;
const leadBody = (o = {}, sid = SID(1)) => Object.assign({ secret: SECRET, type: "lead", submissionId: sid, submittedAt: "2026-09-19T10:00:00Z", source: "rtg-website", payload: payload() }, o);
const contactBody = (o = {}) =>
  Object.assign({ secret: SECRET, type: "contact", email: "visitor@example.com", category: "general", subject: "Test subject", message: "Test message body." }, o);

/** Simulates Apps Script receiving a POST: the same doPost() the web app runs. */
function post(env, body) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return JSON.parse(env.ctx.doPost({ postData: { contents: raw } }).text);
}
const crm = (env, type, extra = {}) => post(env, Object.assign({ secret: SECRET, type }, extra));

const col = (sheet, name) => sheet.rows[0].findIndex((h) => String(h).trim() === name);
const cell = (sheet, row1, name) => sheet.rows[row1 - 1][col(sheet, name)];
const dataRows = (s) => s.rows.slice(1);

/** Simulates a person editing one CRM cell in the Sheets UI, then onEdit firing. */
function uiEdit(env, row, name, value, oldValue) {
  const sheet = env.sheets.LEADS_CRM;
  const c = col(sheet, name) + 1;
  sheet._set(row, c, value);
  env.ctx.onEdit({ range: sheet.getRange(row, c), value, oldValue, source: env.ss });
}

module.exports = { SECRET, WRONG, Sheet, makeEnv, fresh, run, plain, payload, SID, leadBody, contactBody, post, crm, col, cell, dataRows, uiEdit };
