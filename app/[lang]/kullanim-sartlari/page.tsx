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
  const t = getDictionary(lang).legal.terms;
  return pageMetadata(lang, "terms", { title: t.title, description: t.description });
}

export default async function TermsPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = getDictionary(lang).legal.terms;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">{t.title}</h1>
        <div className="mt-8 flex flex-col gap-5 text-ink">
          <div>
            <h2 className="font-display text-lg font-semibold">{t.scope.heading}</h2>
            <p className="mt-2 text-muted">{t.scope.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.liability.heading}</h2>
            <p className="mt-2 text-muted">{t.liability.body}</p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{t.contact.heading}</h2>
            <p className="mt-2 text-muted">
              {siteConfig.contactEmail ? (
                format(t.contact.withEmail, { email: siteConfig.contactEmail })
              ) : (
                <>
                  {t.contact.beforeLink}
                  <Link href={localizedPath(lang, "contact")} className="text-accent hover:underline">
                    {t.contact.linkText}
                  </Link>
                  {t.contact.afterLink}
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
