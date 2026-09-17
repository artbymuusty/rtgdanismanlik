import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function JoinUsCta() {
  return (
    <section className="border-b border-line bg-paper-raised py-16 sm:py-20">
      <Container className="max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-gold">Bize Katılın</p>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl">
          Almanya&apos;da okudun mu? Sen de mentor olabilirsin.
        </h2>
        <p className="mt-4 text-muted">
          Bu süreçten geçmiş olman, senden sonra gelen birine büyük fark yaratır. Deneyimini paylaşmak
          istersen seni dinlemek isteriz.
        </p>
        <div className="mt-6">
          <Button href="/bize-katilin" variant="secondary">
            Mentor Olarak Başvur
          </Button>
        </div>
      </Container>
    </section>
  );
}
