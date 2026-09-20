"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/Button";
import { submitMentorApplication } from "@/app/[lang]/bize-katilin/actions";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  germanyExperience: string;
  motivation: string;
  message: string;
  honeypot: string;
};

const emptyState: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  germanyExperience: "",
  motivation: "",
  message: "",
  honeypot: "",
};

export function MentorApplicationForm({
  lang,
  t,
  homeHref,
  honeypotLabel,
}: {
  lang: Locale;
  t: Dictionary["bizeKatilin"];
  homeHref: string;
  honeypotLabel: string;
}) {
  const [values, setValues] = useState<FormState>(emptyState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Generated once per visit and reused across retries, so a resubmit
  // after a network error is recognized as the same request by the Apps
  // Script backend instead of writing a duplicate Sheets row.
  const [submissionId] = useState(() => crypto.randomUUID());

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const result = await submitMentorApplication({ ...values, submissionId }, lang);

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[3px] border border-accent bg-paper-raised p-8">
        <h2 className="font-display text-2xl font-semibold">{t.success.title}</h2>
        <p className="mt-3 text-muted">{t.success.description}</p>
        <Button href={homeHref} variant="ghost" className="mt-6">
          {t.success.backHome}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[3px] border border-line bg-paper-raised p-6 sm:p-8">
      {/* Honeypot: real users never see or reach this field (off-screen,
          not tab-focusable, aria-hidden). A form-filling bot fills every
          input it finds, tripping the server-side check. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="mentor-company">{honeypotLabel}</label>
        <input
          id="mentor-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => update("honeypot", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="firstName" label={t.fields.firstName} value={values.firstName} onChange={(v) => update("firstName", v)} />
        <TextField id="lastName" label={t.fields.lastName} value={values.lastName} onChange={(v) => update("lastName", v)} />
        <TextField id="phone" label={t.fields.phone} type="tel" value={values.phone} onChange={(v) => update("phone", v)} />
        <TextField id="email" label={t.fields.email} type="email" value={values.email} onChange={(v) => update("email", v)} />
      </div>

      <div className="mt-4">
        <label htmlFor="germanyExperience" className="mb-2 block text-sm font-medium text-ink">
          {t.fields.germanyExperience}
        </label>
        <textarea
          id="germanyExperience"
          required
          rows={3}
          value={values.germanyExperience}
          onChange={(e) => update("germanyExperience", e.target.value)}
          placeholder={t.fields.germanyExperiencePlaceholder}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="motivation" className="mb-2 block text-sm font-medium text-ink">
          {t.fields.motivation}
        </label>
        <textarea
          id="motivation"
          required
          rows={3}
          value={values.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder={t.fields.motivationPlaceholder}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
          {t.fields.message}
        </label>
        <textarea
          id="message"
          rows={2}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={t.fields.messagePlaceholder}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>

      {status === "error" && errorMessage ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"} className="mt-6">
        {status === "submitting" ? t.submit.loading : t.submit.label}
      </Button>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
      />
    </div>
  );
}
