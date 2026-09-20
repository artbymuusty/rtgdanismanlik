import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/content";
import { format } from "@/lib/i18n/format";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { localizedPath } from "@/lib/i18n/routes";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).legal.kvkk;
  return pageMetadata(lang, "kvkk", { title: t.title, description: t.description });
}

export default async function KvkkPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = getDictionary(lang).legal.kvkk;
  const { companyName, companyAddress, mersisNo, taxOffice, taxNumber } = siteConfig;
  const controllerName = companyName || siteConfig.name;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">{t.title}</h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">{t.subtitle}</p>
        <div className="mt-8 flex flex-col gap-5 text-ink">
          <div>
            <h2 className="font-display text-lg font-semibold">{t.controller.heading}</h2>
            <p className="mt-2 text-muted">
              {controllerName}
              {companyAddress ? `, ${companyAddress}` : ""}
              {mersisNo ? ` — ${t.controller.mersis}: ${mersisNo}` : ""}
              {taxOffice && taxNumber ? ` — ${taxOffice} ${t.controller.taxOffice} ${taxNumber}` : ""}.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.data.heading}</h2>
            <p className="mt-2 text-muted">{t.data.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.purpose.heading}</h2>
            <p className="mt-2 text-muted">{t.purpose.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.rights.heading}</h2>
            <p className="mt-2 text-muted">
              {siteConfig.contactEmail ? (
                format(t.rights.withEmail, { email: siteConfig.contactEmail })
              ) : (
                <>
                  {t.rights.beforeLink}
                  <Link href={localizedPath(lang, "contact")} className="text-accent hover:underline">
                    {t.rights.linkText}
                  </Link>
                  {t.rights.afterLink}
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
