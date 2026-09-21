/**
 * The real LEADS_CRM schema (integrations/google-apps-script/Code.gs,
 * LEADS_CRM_COLUMNS) — 23 columns, in this exact order. Never invent a
 * field name here that doesn't exist in the Sheet.
 */
export const CRM_COLUMNS = [
  "ID",
  "Başvuru Tarihi",
  "Ad",
  "Soyad",
  "Email",
  "Telefon",
  "Tercih Edilen İletişim",
  "Aşama",
  "Eğitim Durumu",
  "İlgi Alanı",
  "İngilizce Seviyesi",
  "Almanca Seviyesi",
  "Almanya Hedefi",
  "Zaman Çizelgesi",
  "Hakkında / Deneyim",
  "Mesaj",
  "Bizi Nereden Duydunuz",
  "Sorumlu",
  "Durum",
  "İlk Görüşme Tarihi",
  "Notlar",
  "Mentor ID",
  "Drive Folder",
] as const;

export type CrmColumn = (typeof CRM_COLUMNS)[number];

export const STATUS_NOT_MET = "İlk görüşme yapılmadı";
export const STATUS_MET = "İlk görüşme yapıldı";
export const STATUS_OUTCOMES = ["İletişim Kuruldu", "Süreçte", "Olumsuz Sonuçlandı", "Olumlu Sonuçlandı"] as const;
export const CRM_STATUSES = [STATUS_NOT_MET, STATUS_MET, ...STATUS_OUTCOMES] as const;
export type CrmStatus = (typeof CRM_STATUSES)[number];

/** One LEADS_CRM row, keyed by column name — mirrors the Sheet, not a
 * reshaped/renamed model. `version` is a content hash from Apps Script,
 * used for optimistic-concurrency (crm_update's expectedVersion). */
export type CrmLead = { [K in CrmColumn]: string } & { version: string };

export function rowToLead(values: readonly string[], version: string): CrmLead {
  const lead = { version } as CrmLead;
  CRM_COLUMNS.forEach((col, i) => {
    (lead as Record<string, string>)[col] = values[i] ?? "";
  });
  return lead;
}

export interface SnapshotInfo {
  exists: boolean;
  legacy: boolean;
  date: string;
  submissionId: string;
  source: string;
  sourceDetail: string;
}

export interface ActivityEntry {
  at: string;
  action: string;
  field: string;
  from: string;
  to: string;
  by: string;
}

export type SortDirection = "asc" | "desc";

/** `column` is which date column the range applies to — the Filtrele panel
 * always uses "Başvuru Tarihi"; the "Bugün" panel's "İlk görüşme bugün"
 * shortcut is the same mechanism pointed at "İlk Görüşme Tarihi" instead,
 * so both go through the one filter/query implementation. */
export interface DateRangeFilter {
  column: CrmColumn;
  from?: string; // yyyy-mm-dd
  to?: string; // yyyy-mm-dd
}

/** One value-equality filter per column, plus the shared search/sort/paging.
 * Multiple filters combine with AND, matching the brief's example
 * (Durum + Almanca + İlgi Alanı at once). */
export interface CrmQuery {
  search: string;
  filters: Partial<Record<CrmColumn, string[]>>;
  dateFilter?: DateRangeFilter;
  sortBy: CrmColumn;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
}

export const DEFAULT_QUERY: CrmQuery = {
  search: "",
  filters: {},
  sortBy: "Başvuru Tarihi",
  sortDir: "desc",
  page: 1,
  pageSize: 50,
};
