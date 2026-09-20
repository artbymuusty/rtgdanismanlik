import Link from "next/link";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
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
          className="font-display text-xl font-semibold text-ink transition-colors hover:text-accent active:opacity-60"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label={t.common.mainNavLabel} className="hidden items-center gap-7 lg:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}

          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent active:opacity-60"
            >
              {t.nav.more}
              <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true" className="mt-px">
                <path d="M1 1L4.5 5L8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 -translate-y-1 rounded-[3px] border border-line bg-paper opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <nav className="flex flex-col p-2" aria-label={t.common.moreNavLabel}>
                {moreLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    underline={false}
                    className="rounded-[3px] px-3 py-2.5 hover:bg-paper-raised"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher lang={lang} label={t.common.languageLabel} names={t.common.languageNames} />
          <div className="hidden lg:block">
            <Button href={applyHref} className="!px-4 !py-2.5 text-sm">
              {t.nav.ctaPrimary}
            </Button>
          </div>
          <MobileMenu
            links={[...primaryLinks, ...moreLinks]}
            ctaLabel={t.nav.ctaPrimary}
            ctaHref={applyHref}
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
