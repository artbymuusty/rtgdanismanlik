import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";
import { whatsappLinkFor } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialPhoto } from "@/components/ui/EditorialPhoto";
import { ContactComposer } from "@/components/contact/ContactComposer";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).contact;
  return pageMetadata(lang, "contact", { title: t.title, description: t.intro });
}

export default async function ContactPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = getDictionary(lang).contact;
  const whatsapp = whatsappLinkFor();

  // No mailto: channel: the visitor writes directly through the composer
  // below (Server Action -> Apps Script MailApp), never leaving the site
  // or needing a mail client. WhatsApp stays — it's a real chat channel,
  // not a "we couldn't build this properly" fallback.
  const channels = [
    whatsapp
      ? { key: "whatsapp", title: t.whatsapp.title, description: t.whatsapp.description, cta: t.whatsapp.cta, href: whatsapp }
      : null,
  ].filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="py-16 sm:py-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
          <p className="mt-4 text-lg text-muted">{t.intro}</p>

          {channels.length > 0 ? (
            <div className="mt-10 flex flex-col gap-6">
              {channels.map((channel) => (
                <div key={channel.key} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
                  <h2 className="font-display text-lg font-semibold">{channel.title}</h2>
                  <p className="mt-2 text-sm text-muted">{channel.description}</p>
                  <Button href={channel.href} variant="secondary" className="mt-4 !px-4 !py-2.5 text-sm">
                    {channel.cta}
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-10 rounded-[3px] border border-accent bg-paper-raised p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">{t.formCta.title}</h2>
            <p className="mt-2 text-muted">{t.formCta.description}</p>
            <Button href={localizedPath(lang, "apply")} className="mt-5">
              {t.formCta.cta}
            </Button>
          </div>

          <div className="mt-10">
            <ContactComposer dict={t.composer} lang={lang} />
          </div>
        </div>

        <div className="relative hidden lg:block">
          <EditorialPhoto src="/images/cities/frankfurt.jpg" alt={t.photoAlt} ratio="4 / 5" sizes="35vw" priority />
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">
            {t.photoCaption}
          </span>
        </div>
      </Container>
    </div>
  );
}
