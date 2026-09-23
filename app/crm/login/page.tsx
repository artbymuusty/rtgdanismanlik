import type { Metadata } from "next";
import { hasCrmSession } from "@/lib/crm/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/crm/LoginForm";

export const metadata: Metadata = { title: "Giriş — RTG CRM" };

export default async function CrmLoginPage() {
  // Already signed in? Skip the form instead of showing it pointlessly.
  if (await hasCrmSession()) redirect("/crm");

  return (
    <div
      className="flex min-h-full items-center justify-center px-5 py-16"
      style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))", paddingTop: "max(4rem, env(safe-area-inset-top))" }}
    >
      <div className="w-full max-w-sm rounded-[3px] border border-line bg-paper-raised p-8 motion-safe:animate-[crm-scale-in_200ms_ease-out]">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">RTG CRM</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Yönetim paneline giriş</h1>
        <p className="mt-2 text-sm text-muted">Erişim anahtarını gir.</p>
        <LoginForm />
      </div>
    </div>
  );
}
