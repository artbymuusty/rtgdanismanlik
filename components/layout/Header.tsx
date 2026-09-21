import Link from "next/link";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MoreMenu } from "@/components/layout/MoreMenu";
import { NavLink } from "@/components/layout/NavLink";

export function Header({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const primaryLinks = [
    { href: localizedPath(lang, "services"), label: t.nav.services },
    { href: localizedPath(lang, "mentorship"), label: t.nav.mentorship },
    { href: localizedPath(lang, "pricing"), label: t.nav.pricing },
    { href: localizedPath(lang, "joinUs"), label: t.nav.joinUs },
  ];

  const moreLinks = [
    { href: localizedPath(lang, "stories"), label: t.nav.studentStories },
    { href: localizedPath(lang, "about"), label: t.nav.about },
    { href: localizedPath(lang, "faq"), label: t.nav.faq },
    { href: localizedPath(lang, "contact"), label: t.nav.contact },
  ];

  const applyHref = localizedPath(lang, "apply");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href={localizedPath(lang, "home")}
          className="-my-2 shrink-0 py-2 font-display text-lg font-semibold text-ink transition-colors hover:text-accent active:opacity-60 sm:text-xl"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label={t.common.mainNavLabel} className="hidden items-center gap-7 xl:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href} className="py-2.5">
              {link.label}
            </NavLink>
          ))}

          <MoreMenu label={t.nav.more} navLabel={t.common.moreNavLabel} links={moreLinks} />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher lang={lang} label={t.common.languageLabel} names={t.common.languageNames} />
          </div>
          <div className="hidden xl:block">
            <Button href={applyHref} className="!px-4 !py-2.5 text-sm">
              {t.nav.ctaPrimary}
            </Button>
          </div>
          <MobileMenu
            links={[...primaryLinks, ...moreLinks]}
            ctaLabel={t.nav.ctaPrimary}
            ctaHref={applyHref}
            languageSwitcher={<LanguageSwitcher lang={lang} label={t.common.languageLabel} names={t.common.languageNames} />}
            labels={{
              open: t.common.menuOpenLabel,
              close: t.common.menuCloseLabel,
              buttonOpen: t.common.menuButtonOpen,
              buttonClose: t.common.menuButtonClose,
              nav: t.common.mobileNavLabel,
            }}
          />
        </div>
      </Container>
    </header>
  );
}
