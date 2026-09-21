"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/crm/login/actions";
import { Button } from "@/components/ui/Button";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_secret: "Erişim anahtarı hatalı.",
  rate_limited: "Çok fazla deneme yapıldı. Bir dakika sonra tekrar dene.",
  not_configured: "CRM henüz yapılandırılmamış. Vercel'de CRM_ADMIN_SECRET tanımlanmalı.",
};

export function LoginForm() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login(secret);
      if (result.ok) {
        router.push("/crm");
        router.refresh();
      } else {
        setError(ERROR_MESSAGES[result.error] ?? "Giriş yapılamadı.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="crm-secret" className="mb-2 block text-sm font-medium text-ink">
          Erişim anahtarı
        </label>
        <input
          id="crm-secret"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending || !secret} className="w-full">
        {pending ? "Kontrol ediliyor..." : "Giriş yap"}
      </Button>
    </form>
  );
}
