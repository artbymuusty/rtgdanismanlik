import { STATUS_MET, STATUS_NOT_MET, STATUS_OUTCOMES, type CrmQuery } from "./types";

/**
 * Built-in quick views, mirroring the Sheet's own Filter Views ("İlk
 * Görüşme Bekleyenler" / "İlk Görüşme Sonrası" are Durum = / != "İlk
 * görüşme yapılmadı" — see CRM_MIGRATION_SETUP.md) plus the outcome
 * breakdown. Filters only; nothing here ever runs against the Sheet, so
 * adding/renaming a view never touches the Filter Views themselves.
 */
export interface CrmView {
  id: string;
  label: string;
  filters: CrmQuery["filters"];
}

export const BUILTIN_VIEWS: CrmView[] = [
  { id: "all", label: "Tüm Leadler", filters: {} },
  { id: "awaiting-first-meeting", label: "İlk Görüşme Bekleyenler", filters: { Durum: [STATUS_NOT_MET] } },
  { id: "first-meeting-done", label: "İlk Görüşme Yapılanlar", filters: { Durum: [STATUS_MET] } },
  { id: "in-progress", label: "Süreçtekiler", filters: { Durum: ["Süreçte", "İletişim Kuruldu"] } },
  { id: "positive", label: "Olumlu Sonuçlananlar", filters: { Durum: [STATUS_OUTCOMES[3]] } },
  { id: "negative", label: "Olumsuz Sonuçlananlar", filters: { Durum: [STATUS_OUTCOMES[2]] } },
];

export const DEFAULT_VIEW_ID = BUILTIN_VIEWS[0].id;

/** A user-defined view — saved client-side (localStorage; see
 * components/crm/use-saved-views.ts), scoped to this browser only. No
 * server storage is added for this: it is a personal UI shortcut, not
 * shared CRM data. */
export interface CustomView {
  id: string;
  label: string;
  query: Pick<CrmQuery, "search" | "filters" | "dateFilter">;
}
