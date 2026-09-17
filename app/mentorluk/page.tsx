import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { mentors } from "@/lib/content/mentors";
import { demoMentors } from "@/lib/content/mentors.demo";
import { demoContentEnabled } from "@/lib/content/demo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MentorProfile } from "@/components/mentorship/MentorProfile";

export function generateMetadata(): Metadata {
  const t = getDictionary().mentorship;
  return { title: t.title, description: t.intro, alternates: { canonical: "/mentorluk" } };
}

export default function MentorshipPage() {
  const t = getDictionary().mentorship;
  const isDemo = mentors.length === 0 && demoContentEnabled;
  const visibleMentors = isDemo ? demoMentors : mentors;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
      </Container>

      <Container className="mt-14 max-w-3xl">
        <div className="flex flex-col gap-10">
          {t.sections.map((section) => (
            <div key={section.heading} className="border-t border-line pt-8 first:border-t-0 first:pt-0">
              <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
              <p className="mt-3 text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>

      {visibleMentors.length > 0 ? (
        <Container className="mt-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Mentorlarımız</h2>
          <div className="mt-10 flex flex-col gap-14">
            {visibleMentors.map((mentor) => (
              <div key={mentor.id} className="border-t border-line pt-10 first:border-t-0 first:pt-0">
                <MentorProfile mentor={mentor} isDemo={isDemo} />
              </div>
            ))}
          </div>
        </Container>
      ) : null}

      <Container className="mt-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t.processTitle}</h2>
        <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.map((step, index) => (
            <li key={step.title} className="rounded-[3px] border border-line bg-paper-raised p-5">
              <span className="font-mono text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="mt-16 max-w-2xl rounded-[3px] border border-accent bg-paper-raised p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">{t.cta.title}</h2>
        <p className="mt-3 text-muted">{t.cta.description}</p>
        <div className="mt-6">
          <Button href="/basvuru">{t.cta.label}</Button>
        </div>
      </Container>
    </div>
  );
}
