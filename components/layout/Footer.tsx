import Link from "next/link";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { siteConfig, getSocialLinks, whatsappLinkFor } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const social = getSocialLinks();
  const whatsapp = whatsappLinkFor();

  const navLinks = [
    { href: localizedPath(lang, "services"), label: t.nav.services },
    { href: localizedPath(lang, "mentorship"), label: t.nav.mentorship },
    { href: localizedPath(lang, "stories"), label: t.nav.studentStories },
    { href: localizedPath(lang, "about"), label: t.nav.about },
    { href: localizedPath(lang, "pricing"), label: t.nav.pricing },
    { href: localizedPath(lang, "faq"), label: t.nav.faq },
    { href: localizedPath(lang, "contact"), label: t.nav.contact },
    { href: localizedPath(lang, "joinUs"), label: t.nav.joinUs },
  ];

  const socialLinks = [
    social.linkedinUrl
      ? { platform: "linkedin" as const, href: social.linkedinUrl, label: social.demo.linkedin ? `LinkedIn (${t.common.sampleAccount})` : "LinkedIn" }
      : null,
    social.instagramUrl
      ? { platform: "instagram" as const, href: social.instagramUrl, label: social.demo.instagram ? `Instagram (${t.common.sampleAccount})` : "Instagram" }
      : null,
    social.xUrl
      ? { platform: "x" as const, href: social.xUrl, label: social.demo.x ? `X (${t.common.sampleAccount})` : "X" }
      : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <footer className="border-t border-line bg-paper-raised">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{t.footer.description}</p>
          <div className="mt-4 flex flex-col gap-1 text-sm">
            {whatsapp ? (
              <a href={whatsapp} className="text-accent transition-opacity hover:underline active:opacity-60">
                WhatsApp
              </a>
            ) : null}
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent transition-opacity hover:underline active:opacity-60">
                {siteConfig.contactEmail}
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{t.footer.navTitle}</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink/80 transition-colors hover:text-accent active:opacity-60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{t.footer.legalTitle}</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {t.footer.legalLinks.map((link) => (
              <li key={link.route}>
                <Link href={localizedPath(lang, link.route)} className="text-ink/80 transition-colors hover:text-accent active:opacity-60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-line py-5">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted">{t.footer.rights}</p>
          {socialLinks.length > 0 ? (
            <div className="flex items-center gap-2" aria-label={t.common.socialLinksLabel}>
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:bg-accent/8 hover:text-accent active:translate-y-0 active:scale-95 active:bg-accent/12 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                >
                  <SocialIcon platform={s.platform} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}
