import { tr } from "@/lib/content/tr";
import type { AssessmentStep } from "@/lib/content/types";
import type { CrmColumn } from "./types";

/**
 * Human-readable labels for the raw values LEADS_CRM stores in a few
 * columns. Sourced from the SAME option lists the public assessment form
 * uses (lib/content/tr.ts) — never invented here — so a value like
 * "computer-it" or "b2" reads the same way it did to the applicant. Storage
 * values are never touched; this is display-only.
 *
 * Not every enum-looking column needs one: "Bizi Nereden Duydunuz" is
 * already written as a human label by Code.gs at submission time (see
 * REFERRAL_LABELS in Code.gs), and "Durum" values are already full Turkish
 * sentences.
 */
function stepOptions(id: string): Record<string, string> {
  const step = tr.assessment.steps.find((s: AssessmentStep) => s.id === id);
  const map: Record<string, string> = {};
  for (const opt of step?.options ?? []) map[opt.value] = opt.label;
  return map;
}

export const ENUM_LABELS: Partial<Record<CrmColumn, Record<string, string>>> = {
  Aşama: stepOptions("stage"),
  "Eğitim Durumu": stepOptions("educationStatus"),
  "İlgi Alanı": stepOptions("interestArea"),
  "İngilizce Seviyesi": stepOptions("englishLevel"),
  "Almanca Seviyesi": stepOptions("germanLevel"),
  "Almanya Hedefi": stepOptions("target"),
  "Zaman Çizelgesi": stepOptions("timeline"),
  "Tercih Edilen İletişim": Object.fromEntries(
    tr.assessment.contactStep.fields.preferredContactOptions.map((o) => [o.value, o.label]),
  ),
};

/** Value -> human label for one cell, or the raw value when there's no map
 * entry (an unmapped/legacy value is still shown, never hidden). */
export function enumLabel(column: CrmColumn, value: string): string {
  if (!value) return "";
  return ENUM_LABELS[column]?.[value] ?? value;
}

export type ColumnWidth = "xs" | "sm" | "md" | "lg" | "xl";
export type FieldGroup = "personal" | "application" | "notes" | "management" | "source";

export interface FieldMeta {
  column: CrmColumn;
  width: ColumnWidth;
  /** Shown in the compact table by default; the rest are opt-in via the Columns menu. */
  defaultVisible: boolean;
  /** Included in the free-text global search. */
  searchable: boolean;
  /** Has a fixed value set the filter panel can offer as checkboxes. */
  filterable: boolean;
  /** Editable from the table cell (Notlar/Mesaj/Hakkında are edited in the drawer only — too long for a cell). */
  inlineEditable: boolean;
  /** Editable anywhere at all (everything except the two Code.gs CRM_READONLY_FIELDS). */
  editable: boolean;
  group: FieldGroup;
  /** True for the two long free-text fields that get a textarea, not an input. */
  multiline?: boolean;
}

const F = (partial: Omit<FieldMeta, "editable">): FieldMeta => ({
  ...partial,
  editable: partial.column !== "ID" && partial.column !== "Başvuru Tarihi",
});

/** One row per LEADS_CRM column, in the Sheet's own order. This is the
 * single place that decides table width, default visibility, filterability
 * and where a field lives in the detail drawer. */
export const FIELDS: FieldMeta[] = [
  F({ column: "ID", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "source" }),
  F({ column: "Başvuru Tarihi", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "source" }),
  // "Ad" is the table's merged identity cell (avatar + Ad Soyad + Email —
  // see DataTable's special-cased render for this column) — Soyad/Email
  // stay real, independently sortable/filterable/searchable columns (a
  // power user can still show them via Sütunlar), just not shown twice by
  // default since the identity cell already surfaces both.
  F({ column: "Ad", width: "xl", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Soyad", width: "sm", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Email", width: "lg", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Telefon", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Tercih Edilen İletişim", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: true, group: "personal" }),
  F({ column: "Aşama", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "application" }),
  F({ column: "Eğitim Durumu", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "İlgi Alanı", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "İngilizce Seviyesi", width: "xs", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "Almanca Seviyesi", width: "xs", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "Almanya Hedefi", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "Zaman Çizelgesi", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "application" }),
  F({ column: "Hakkında / Deneyim", width: "xl", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "notes", multiline: true }),
  F({ column: "Mesaj", width: "xl", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "notes", multiline: true }),
  F({ column: "Bizi Nereden Duydunuz", width: "sm", defaultVisible: false, searchable: false, filterable: false, inlineEditable: false, group: "source" }),
  F({ column: "Sorumlu", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "management" }),
  F({ column: "Durum", width: "md", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "management" }),
  F({ column: "İlk Görüşme Tarihi", width: "sm", defaultVisible: true, searchable: false, filterable: false, inlineEditable: true, group: "management" }),
  F({ column: "Notlar", width: "xl", defaultVisible: true, searchable: true, filterable: false, inlineEditable: true, group: "notes", multiline: true }),
  F({ column: "Mentor ID", width: "sm", defaultVisible: false, searchable: true, filterable: true, inlineEditable: true, group: "management" }), // facet values come from the real Sheet (see computeFacets)
  F({ column: "Drive Folder", width: "sm", defaultVisible: false, searchable: false, filterable: false, inlineEditable: false, group: "management" }),
];

export const FIELD_BY_COLUMN: Record<CrmColumn, FieldMeta> = Object.fromEntries(FIELDS.map((f) => [f.column, f])) as Record<
  CrmColumn,
  FieldMeta
>;

export const DEFAULT_VISIBLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.defaultVisible).map((f) => f.column);
export const SEARCHABLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.searchable).map((f) => f.column);
export const FILTERABLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.filterable).map((f) => f.column);

/** "Lead Intelligence" columns — shown as a compact labeled pill (e.g. "DE
 * B2", "Hedef: Master") instead of plain truncated text, for at-a-glance
 * scanning in the dense table and on mobile cards. Display only — the
 * underlying stored value never changes. */
export const BADGE_COLUMNS: Partial<Record<CrmColumn, string>> = {
  "İngilizce Seviyesi": "EN",
  "Almanca Seviyesi": "DE",
  "Almanya Hedefi": "Hedef",
  "Zaman Çizelgesi": "Zaman",
};

export const GROUP_LABELS: Record<FieldGroup, string> = {
  personal: "Kimlik",
  application: "Başvuru",
  notes: "Notlar",
  management: "Yönetim",
  source: "Kaynak",
};
