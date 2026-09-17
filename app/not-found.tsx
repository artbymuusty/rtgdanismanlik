import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">404</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">
          Aradığın sayfayı bulamadık.
        </h1>
        <p className="mt-4 text-lg text-muted">
          Bağlantı eskimiş ya da adres yanlış yazılmış olabilir. Ana sayfadan devam edebilirsin.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Ana Sayfaya Dön</Button>
          <Button href="/iletisim" variant="secondary">
            Bize Ulaş
          </Button>
        </div>
      </Container>
    </div>
  );
}
