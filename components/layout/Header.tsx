import Link from "next/link";
import { getDictionary } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLink } from "@/components/layout/NavLink";

export function Header() {
  const t = getDictionary();

  const primaryLinks = [
    { href: "/nasil-yardimci-oluyoruz", label: t.nav.services },
    { href: "/mentorluk", label: t.nav.mentorship },
    { href: "/fiyatlar", label: t.nav.pricing },
    { href: "/bize-katilin", label: t.nav.joinUs },
  ];

  const moreLinks = [
    { href: "/ogrenci-hikayeleri", label: t.nav.studentStories },
    { href: "/hakkimizda", label: t.nav.about },
    { href: "/sss", label: t.nav.faq },
    { href: "/iletisim", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-ink transition-colors hover:text-accent active:opacity-60"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-7 lg:flex">
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
              <nav className="flex flex-col p-2" aria-label="Diğer sayfalar">
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

        <div className="hidden lg:block">
          <Button href="/basvuru" className="!px-4 !py-2.5 text-sm">
            {t.nav.ctaPrimary}
          </Button>
        </div>

        <MobileMenu primaryLinks={[...primaryLinks, ...moreLinks]} moreLinks={[]} ctaLabel={t.nav.ctaPrimary} />
      </Container>
    </header>
  );
}
