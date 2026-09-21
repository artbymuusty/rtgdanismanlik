import type { Metadata } from "next";
import { requireCrmSession } from "@/lib/crm/auth";
import { crmListAction } from "./actions";
import { DEFAULT_QUERY } from "@/lib/crm/types";
import { CrmWorkspace } from "@/components/crm/CrmWorkspace";

export const metadata: Metadata = { title: "RTG CRM" };

// Server Actions read the session cookie themselves, so this page never
// needs to be static; always render it fresh for the signed-in visitor.
export const dynamic = "force-dynamic";

export default async function CrmPage() {
  await requireCrmSession(); // redirects to /crm/login if there is no valid session

  const initial = await crmListAction(DEFAULT_QUERY);

  return <CrmWorkspace initialQuery={DEFAULT_QUERY} initialResult={initial} />;
}
