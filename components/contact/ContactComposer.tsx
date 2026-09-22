"use client";

import { useId, useState, useTransition } from "react";
import { submitContactForm } from "@/app/[lang]/iletisim/actions";
import { CONTACT_CATEGORIES, type ContactCategory } from "@/lib/validation/contact";
import { Button } from "@/components/ui/Button";

interface ComposerDict {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  categoryLabel: string;
  categories: Record<ContactCategory, string>;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholders: Record<ContactCategory, string>;
  honeypotLabel: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
}

const EMPTY_FORM = { email: "", category: "general" as ContactCategory, subject: "", message: "", honeypot: "" };

/**
 * Sends directly through app/[lang]/iletisim/actions.ts -> Apps Script's
 * MailApp — never a mailto: link, so the visitor never has to leave the
 * site or have a mail client configured. Category KEYS are the fixed,
 * locale-independent enum in lib/validation/contact.ts; `dict.categories`
 * only supplies their localized labels.
 */
export function ContactComposer({ dict, lang }: { dict: ComposerDict; lang: string }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formId = useId();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm(form, lang);
      if (result.ok) {
        setStatus("success");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-[3px] border border-line bg-paper-raised p-6 sm:p-8">
        <p className="font-display text-xl font-semibold text-ink">✓ {dict.successTitle}</p>
        <p className="mt-2 text-sm text-muted">{dict.successBody}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-line pt-8">
      <h2 className="font-display text-xl font-semibold text-ink">{dict.title}</h2>
      <p className="mt-2 text-sm text-muted">{dict.description}</p>

      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
        {/* Honeypot: real visitors never see or reach this field (off-screen,
            not tab-focusable, aria-hidden). A form-filling bot fills every
            input it finds, tripping the server-side check. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
          <label htmlFor={`${formId}-company`}>{dict.honeypotLabel}</label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(e) => set("honeypot", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="mb-1.5 block text-sm font-medium text-ink">
            {dict.emailLabel}
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            required
            maxLength={254}
            placeholder={dict.emailPlaceholder}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-category`} className="mb-1.5 block text-sm font-medium text-ink">
            {dict.categoryLabel}
          </label>
          <select
            id={`${formId}-category`}
            value={form.category}
            onChange={(e) => set("category", e.target.value as ContactCategory)}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
          >
            {CONTACT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {dict.categories[c]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${formId}-subject`} className="mb-1.5 block text-sm font-medium text-ink">
            {dict.subjectLabel}
          </label>
          <input
            id={`${formId}-subject`}
            type="text"
            required
            maxLength={160}
            placeholder={dict.subjectPlaceholder}
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-message`} className="mb-1.5 block text-sm font-medium text-ink">
            {dict.messageLabel}
          </label>
          <textarea
            id={`${formId}-message`}
            required
            rows={5}
            maxLength={5000}
            placeholder={dict.messagePlaceholders[form.category]}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            aria-describedby={error ? `${formId}-error` : undefined}
            className="w-full resize-y rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
          />
        </div>

        {error ? (
          <div id={`${formId}-error`} role="alert" className="rounded-[3px] border border-danger/40 bg-danger/5 p-4">
            <p className="text-sm font-medium text-danger">{dict.errorTitle}</p>
            <p className="mt-1 text-sm text-muted">{error || dict.errorBody}</p>
          </div>
        ) : null}

        <div className="mt-1 flex justify-end">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? dict.submitting : status === "error" ? dict.retry : dict.submit}
          </Button>
        </div>
      </form>
    </div>
  );
}
