import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${siteConfig.name} gizlilik politikası.`,
  alternates: { canonical: "/gizlilik" },
};

export default function PrivacyPage() {
  const controllerName = siteConfig.companyName || siteConfig.name;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">Gizlilik Politikası</h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          Son güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}
        </p>
        <div className="prose mt-8 flex flex-col gap-5 text-ink">
          <div>
            <h2 className="font-display text-lg font-semibold">Veri sorumlusu</h2>
            <p className="mt-2 text-muted">
              {controllerName}
              {siteConfig.companyAddress ? `, ${siteConfig.companyAddress}` : ""}.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Hangi bilgileri topluyoruz?</h2>
            <p className="mt-2 text-muted">
              &quot;Yolculuğunu Konuşalım&quot; formunu doldurduğunda ad, soyad, telefon/WhatsApp numarası, e-posta
              adresi ve paylaştığın eğitim durumu / hedef bilgilerini alıyoruz. İletişim sayfası üzerinden
              WhatsApp veya e-posta ile ulaştığında, ilgili platformun kendi gizlilik kuralları geçerlidir.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Bu bilgileri ne için kullanıyoruz?</h2>
            <p className="mt-2 text-muted">
              Yalnızca seninle iletişime geçmek ve görüşmeye hazırlanmak için kullanıyoruz. Bilgilerini
              üçüncü taraflara satmıyor veya pazarlama amacıyla paylaşmıyoruz.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Verilerin saklanması</h2>
            <p className="mt-2 text-muted">
              Bilgilerin, erişimi yalnızca yetkili ekip üyeleriyle sınırlı olan güvenli bir ortamda
              saklanır.{" "}
              {siteConfig.contactEmail ? (
                <>Bilgilerinin silinmesini istediğinde {siteConfig.contactEmail} adresine yazabilirsin.</>
              ) : (
                <>
                  Bilgilerinin silinmesini istediğinde{" "}
                  <Link href="/iletisim" className="text-accent hover:underline">
                    iletişim sayfasındaki
                  </Link>{" "}
                  kanallardan bize ulaşabilirsin.
                </>
              )}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
