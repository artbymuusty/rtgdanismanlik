import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/content";
import { dateLocale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { localizedPath } from "@/lib/i18n/routes";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).legal.privacy;
  return pageMetadata(lang, "privacy", { title: t.title, description: t.description });
}

export default async function PrivacyPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const legal = getDictionary(lang).legal;
  const t = legal.privacy;
  const controllerName = siteConfig.companyName || siteConfig.name;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">{t.title}</h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {legal.updatedLabel}: {new Date().toLocaleDateString(dateLocale[lang], { year: "numeric", month: "long" })}
        </p>
        <div className="prose mt-8 flex flex-col gap-5 text-ink">
          <div>
            <h2 className="font-display text-lg font-semibold">{t.controller.heading}</h2>
            <p className="mt-2 text-muted">
              {controllerName}
              {siteConfig.companyAddress ? `, ${siteConfig.companyAddress}` : ""}.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.collected.heading}</h2>
            <p className="mt-2 text-muted">{t.collected.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.purpose.heading}</h2>
            <p className="mt-2 text-muted">{t.purpose.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.retention.heading}</h2>
            <p className="mt-2 text-muted">
              {t.retention.bodyPrefix}{" "}
              {siteConfig.contactEmail ? (
                format(t.retention.withEmail, { email: siteConfig.contactEmail })
              ) : (
                <>
                  {t.retention.beforeLink}
                  <Link href={localizedPath(lang, "contact")} className="text-accent hover:underline">
                    {t.retention.linkText}
                  </Link>
                  {t.retention.afterLink}
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
