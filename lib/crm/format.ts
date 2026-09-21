import { parseCrmDate } from "./query";

/** Display formatting for a CRM date cell — always dd.MM.yyyy (+ HH:mm when
 * the value carries a time), regardless of whether the value came in as
 * Apps Script's "dd.MM.yyyy HH:mm" or the public form's ISO string. Falls
 * back to the raw value rather than hiding an unparseable date. */
export function formatCrmDate(value: string): string {
  const date = parseCrmDate(value);
  if (!date) return value;
  const hasTime = /\d{2}:\d{2}/.test(value) || /T\d{2}:\d{2}/.test(value);
  const datePart = date.toLocaleDateString("tr-TR");
  if (!hasTime) return datePart;
  return `${datePart} ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
}
