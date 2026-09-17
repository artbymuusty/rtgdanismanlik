import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: `${siteConfig.name} kullanım şartları.`,
  alternates: { canonical: "/kullanim-sartlari" },
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">Kullanım Şartları</h1>
        <div className="mt-8 flex flex-col gap-5 text-ink">
          <div>
            <h2 className="font-display text-lg font-semibold">Hizmetin kapsamı</h2>
            <p className="mt-2 text-muted">
              {siteConfig.name}, Almanya&apos;da eğitim süreci konusunda yönlendirme ve mentorluk desteği sunar.
              Üniversite kabulü, vize onayı veya başka bir resmi kararın garantisini vermez; bu kararlar
              ilgili üniversite, konsolosluk ve resmi kurumların yetkisindedir.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Sorumluluk</h2>
            <p className="mt-2 text-muted">
              Paylaştığımız bilgi ve yönlendirmeler, görüşme anındaki bilgilere dayanır; resmi kurumların
              güncel gereksinimlerini teyit etmek kullanıcının sorumluluğundadır.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">İletişim</h2>
            <p className="mt-2 text-muted">
              {siteConfig.contactEmail ? (
                <>Sorularınız için {siteConfig.contactEmail} adresinden bize ulaşabilirsiniz.</>
              ) : (
                <>
                  Sorularınız için{" "}
                  <Link href="/iletisim" className="text-accent hover:underline">
                    iletişim sayfasındaki
                  </Link>{" "}
                  kanallardan bize ulaşabilirsiniz.
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
