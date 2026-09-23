"use client";

import { useId, useState, useTransition } from "react";
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
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const errorId = useId();

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
        <div className="relative">
          <input
            id="crm-secret"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            required
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 pr-16 text-base text-ink outline-none transition-colors focus-visible:border-accent sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Erişim anahtarını gizle" : "Erişim anahtarını göster"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {visible ? "Gizle" : "Göster"}
          </button>
        </div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger motion-safe:animate-[crm-fade-in_150ms_ease-out]">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending || !secret} className="w-full">
        {pending ? "Kontrol ediliyor..." : "Giriş yap"}
      </Button>
    </form>
  );
}
