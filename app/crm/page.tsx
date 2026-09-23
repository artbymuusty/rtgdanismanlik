import type { Metadata } from "next";
import { requireCrmSession } from "@/lib/crm/auth";
import { crmListAction } from "./actions";
import { nextSearchParamsToQuery } from "@/lib/crm/url-state";
import { CrmWorkspace } from "@/components/crm/CrmWorkspace";

export const metadata: Metadata = { title: "RTG CRM" };

// Server Actions read the session cookie themselves, so this page never
// needs to be static; always render it fresh for the signed-in visitor.
export const dynamic = "force-dynamic";

/**
 * Parsing the URL's own query string into the initial CrmQuery (rather
 * than always starting from DEFAULT_QUERY) is what makes a refresh, a
 * bookmark, or a shared /crm?... link land on the exact same filtered/
 * sorted/paged view — CrmWorkspace then keeps the URL in sync as the
 * visitor keeps working (see its own useEffect).
 */
export default async function CrmPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireCrmSession(); // redirects to /crm/login if there is no valid session

  const initialQuery = nextSearchParamsToQuery(await searchParams);
  const initial = await crmListAction(initialQuery);

  return <CrmWorkspace initialQuery={initialQuery} initialResult={initial} />;
}
