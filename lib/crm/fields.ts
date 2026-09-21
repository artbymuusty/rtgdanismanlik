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
export type FieldGroup = "personal" | "education" | "goal" | "application" | "crm" | "system";

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
  F({ column: "ID", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "system" }),
  F({ column: "Başvuru Tarihi", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "system" }),
  F({ column: "Ad", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Soyad", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Email", width: "lg", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Telefon", width: "sm", defaultVisible: true, searchable: true, filterable: false, inlineEditable: false, group: "personal" }),
  F({ column: "Tercih Edilen İletişim", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: true, group: "personal" }),
  F({ column: "Aşama", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "education" }),
  F({ column: "Eğitim Durumu", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "education" }),
  F({ column: "İlgi Alanı", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "education" }),
  F({ column: "İngilizce Seviyesi", width: "xs", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "education" }),
  F({ column: "Almanca Seviyesi", width: "xs", defaultVisible: true, searchable: false, filterable: true, inlineEditable: false, group: "education" }),
  F({ column: "Almanya Hedefi", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "goal" }),
  F({ column: "Zaman Çizelgesi", width: "sm", defaultVisible: false, searchable: false, filterable: true, inlineEditable: false, group: "goal" }),
  F({ column: "Hakkında / Deneyim", width: "xl", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "application", multiline: true }),
  F({ column: "Mesaj", width: "xl", defaultVisible: false, searchable: true, filterable: false, inlineEditable: false, group: "application", multiline: true }),
  F({ column: "Bizi Nereden Duydunuz", width: "sm", defaultVisible: false, searchable: false, filterable: false, inlineEditable: false, group: "application" }),
  F({ column: "Sorumlu", width: "sm", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "crm" }),
  F({ column: "Durum", width: "md", defaultVisible: true, searchable: false, filterable: true, inlineEditable: true, group: "crm" }),
  F({ column: "İlk Görüşme Tarihi", width: "sm", defaultVisible: true, searchable: false, filterable: false, inlineEditable: true, group: "crm" }),
  F({ column: "Notlar", width: "xl", defaultVisible: true, searchable: true, filterable: false, inlineEditable: true, group: "crm", multiline: true }),
  F({ column: "Mentor ID", width: "sm", defaultVisible: false, searchable: true, filterable: true, inlineEditable: true, group: "crm" }), // facet values come from the real Sheet (see computeFacets)
  F({ column: "Drive Folder", width: "sm", defaultVisible: false, searchable: false, filterable: false, inlineEditable: false, group: "crm" }),
];

export const FIELD_BY_COLUMN: Record<CrmColumn, FieldMeta> = Object.fromEntries(FIELDS.map((f) => [f.column, f])) as Record<
  CrmColumn,
  FieldMeta
>;

export const DEFAULT_VISIBLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.defaultVisible).map((f) => f.column);
export const SEARCHABLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.searchable).map((f) => f.column);
export const FILTERABLE_COLUMNS: CrmColumn[] = FIELDS.filter((f) => f.filterable).map((f) => f.column);

export const GROUP_LABELS: Record<FieldGroup, string> = {
  personal: "Kişisel",
  education: "Eğitim",
  goal: "Almanya Hedefi",
  application: "Başvuru",
  crm: "CRM",
  system: "Sistem",
};
