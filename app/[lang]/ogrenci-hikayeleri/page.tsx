import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { studentStories } from "@/lib/content/stories";
import { demoStudentStories } from "@/lib/content/stories.demo";
import { demoContentEnabled } from "@/lib/content/demo";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { Container } from "@/components/ui/Container";
import { FeaturedStudentStory } from "@/components/stories/FeaturedStudentStory";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).stories;
  return pageMetadata(lang, "stories", { title: t.pageTitle, description: t.pageDescription });
}

export default async function StudentStoriesPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const dict = getDictionary(lang);
  const t = dict.stories;
  const isDemo = studentStories.length === 0 && demoContentEnabled;
  const stories = isDemo ? demoStudentStories : studentStories;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{t.pageTitle}</h1>
        <p className="mt-4 font-display text-xl italic text-muted">{t.pageIntro}</p>
      </Container>

      {stories.length === 0 ? (
        <Container className="mt-14 max-w-3xl">
          <p className="text-muted">{t.empty}</p>
        </Container>
      ) : (
        <Container className="mt-16 flex flex-col gap-16">
          {stories.map((story, index) => (
            <div key={story.id} className="border-t border-line pt-14 first:border-t-0 first:pt-0">
              <FeaturedStudentStory
                story={story}
                isDemo={isDemo}
                reverse={index % 2 === 1}
                label={`${story.city} · ${story.field}`}
                t={t}
                sample={dict.common.sample}
              />
            </div>
          ))}
        </Container>
      )}
    </div>
  );
}
