"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">Bir şeyler ters gitti</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">
          Sayfa yüklenirken bir sorun oluştu.
        </h1>
        <p className="mt-4 text-lg text-muted">Tekrar deneyebilir ya da ana sayfaya dönebilirsin.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Tekrar Dene</Button>
          <Button href="/" variant="secondary">
            Ana Sayfaya Dön
          </Button>
        </div>
      </Container>
    </div>
  );
}
