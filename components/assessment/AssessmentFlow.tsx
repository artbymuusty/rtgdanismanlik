"use client";

import { useMemo, useState } from "react";
import { getDictionary } from "@/lib/content";
import type { AssessmentOption } from "@/lib/content/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { submitLead } from "@/app/basvuru/actions";

type Answers = Record<string, string>;
type ContactField = "firstName" | "lastName" | "phone" | "email" | "preferredContact" | "note";
type Contact = Record<ContactField, string>;
type FlowStatus = "intro" | "question" | "contact" | "submitting" | "success" | "error";

const emptyContact: Contact = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  preferredContact: "",
  note: "",
};

export function AssessmentFlow({
  initialStage,
  whatsappLink,
}: {
  initialStage?: string;
  whatsappLink: string | null;
}) {
  const t = getDictionary().assessment;
  const steps = t.steps;

  const [status, setStatus] = useState<FlowStatus>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() =>
    initialStage ? ({ stage: initialStage } as Answers) : ({} as Answers),
  );
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length + 1; // + contact step
  const currentPosition = status === "contact" ? totalSteps : stepIndex + 1;

  const canAdvance = useMemo(() => {
    if (!currentStep) return false;
    if (currentStep.optional) return true;
    return Boolean(answers[currentStep.id]?.trim());
  }, [answers, currentStep]);

  function start() {
    setStatus("question");
  }

  function goNext() {
    if (stepIndex + 1 < steps.length) {
      setStepIndex((i) => i + 1);
    } else {
      setStatus("contact");
    }
  }

  function goBack() {
    if (status === "contact") {
      setStatus("question");
      return;
    }
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  async function handleSubmit() {
    if (!contact.firstName.trim() || !contact.lastName.trim() || !contact.phone.trim() || !contact.email.trim() || !contact.preferredContact) {
      setErrorMessage("Lütfen ad, soyad, telefon, e-posta ve tercih ettiğin iletişim yöntemini doldur.");
      return;
    }

    setErrorMessage(null);
    setStatus("submitting");

    const result = await submitLead({
      stage: answers.stage ?? "",
      educationStatus: answers.educationStatus ?? "",
      interestArea: answers.interestArea ?? "",
      languageLevel: answers.languageLevel ?? "",
      target: answers.target ?? "",
      timeline: answers.timeline ?? "",
      message: answers.message ?? "",
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      preferredContact: contact.preferredContact as "whatsapp" | "phone" | "email",
      note: contact.note,
    });

    if (result.ok) {
      setStatus("success");
    } else {
      setErrorMessage(result.error);
      setStatus("error");
    }
  }

  if (status === "intro") {
    return (
      <div className="max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-gold">{t.intro.eyebrow}</p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">{t.intro.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro.description}</p>
        <Button className="mt-8" onClick={start}>
          {t.intro.startCta}
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-4xl font-semibold">{t.success.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.success.description}</p>
        {whatsappLink ? <p className="mt-6 text-sm text-muted">{t.success.whatsappCta}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {whatsappLink ? (
            <Button href={whatsappLink} variant="secondary">
              WhatsApp&apos;tan Yaz
            </Button>
          ) : null}
          <Button href="/" variant="ghost">
            {t.success.backHome}
          </Button>
        </div>
      </div>
    );
  }

  const isContactStep = status === "contact" || status === "submitting" || status === "error";

  return (
    <div className="max-w-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper-raised">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(currentPosition / totalSteps) * 100}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-xs text-muted">
          {currentPosition} / {totalSteps}
        </span>
      </div>

      {!isContactStep && currentStep ? (
        <QuestionStep
          question={currentStep.question}
          helper={currentStep.helper}
          type={currentStep.type}
          placeholder={currentStep.placeholder}
          options={currentStep.options}
          value={answers[currentStep.id] ?? ""}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [currentStep.id]: value }))}
        />
      ) : (
        <ContactStep
          contact={contact}
          onChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
          fields={t.contactStep.fields}
          title={t.contactStep.title}
          description={t.contactStep.description}
        />
      )}

      {errorMessage ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8 flex gap-3">
        {stepIndex > 0 || status === "contact" ? (
          <Button variant="secondary" onClick={goBack} disabled={status === "submitting"}>
            Geri
          </Button>
        ) : null}

        {!isContactStep ? (
          <Button onClick={goNext} disabled={!canAdvance}>
            İleri
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={status === "submitting"}>
            {status === "submitting" ? t.submit.loading : t.submit.label}
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  question,
  helper,
  type,
  placeholder,
  options,
  value,
  onChange,
}: {
  question: string;
  helper?: string;
  type: "single" | "text";
  placeholder?: string;
  options?: AssessmentOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = "assessment-text-input";
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{question}</h2>
      {helper ? <p className="mt-2 text-sm text-muted">{helper}</p> : null}

      {type === "single" && options ? (
        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={question}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange(option.value)}
                className={cn(
                  "rounded-[3px] border px-4 py-3 text-left text-sm font-medium transition-colors",
                  isSelected
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line bg-paper text-ink hover:border-accent",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <label htmlFor={inputId} className="sr-only">
            {question}
          </label>
          <textarea
            id={inputId}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
          />
        </div>
      )}
    </div>
  );
}

function ContactStep({
  contact,
  onChange,
  fields,
  title,
  description,
}: {
  contact: Contact;
  onChange: (field: ContactField, value: string) => void;
  fields: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    preferredContact: string;
    preferredContactOptions: AssessmentOption[];
    note: string;
  };
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="firstName" label={fields.firstName} value={contact.firstName} onChange={(v) => onChange("firstName", v)} />
        <TextField id="lastName" label={fields.lastName} value={contact.lastName} onChange={(v) => onChange("lastName", v)} />
        <TextField id="phone" label={fields.phone} value={contact.phone} onChange={(v) => onChange("phone", v)} type="tel" />
        <TextField id="email" label={fields.email} value={contact.email} onChange={(v) => onChange("email", v)} type="email" />
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-ink">{fields.preferredContact}</legend>
        <div className="flex flex-wrap gap-2">
          {fields.preferredContactOptions.map((option) => {
            const isSelected = contact.preferredContact === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange("preferredContact", option.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  isSelected ? "border-accent bg-accent text-accent-ink" : "border-line text-ink hover:border-accent",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="note" className="mb-2 block text-sm font-medium text-ink">
          {fields.note}
        </label>
        <textarea
          id="note"
          value={contact.note}
          onChange={(event) => onChange("note", event.target.value)}
          rows={3}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>
    </div>
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus-visible:border-accent"
      />
    </div>
  );
}
