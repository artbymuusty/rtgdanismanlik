import { getDictionary } from "@/lib/content";
import { studentStories } from "@/lib/content/stories";
import { demoStudentStories } from "@/lib/content/stories.demo";
import { demoContentEnabled } from "@/lib/content/demo";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedStudentStory } from "@/components/stories/FeaturedStudentStory";
import { StudentStoryCarousel } from "@/components/stories/StudentStoryCarousel";
import { Button } from "@/components/ui/Button";

export function StudentStories({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.stories;
  const isDemo = studentStories.length === 0 && demoContentEnabled;
  const stories = isDemo ? demoStudentStories : studentStories;

  if (stories.length === 0) return null;

  const featured = stories.find((story) => story.isFeatured) ?? stories[0];
  const rest = stories.filter((story) => story.id !== featured.id);

  return (
    <section id="ogrenci-hikayeleri" className="border-b border-line py-16 sm:py-20 scroll-mt-20">
      <Container>
        <SectionHeading title={t.homeTitle} subtitle={t.homeSubtitle} />

        <div className="mt-12">
          <FeaturedStudentStory story={featured} isDemo={isDemo} t={t} sample={dict.common.sample} />
        </div>

        {rest.length > 0 ? (
          <div className="mt-16 border-t border-line pt-12">
            <StudentStoryCarousel
              stories={rest}
              isDemo={isDemo}
              sample={dict.common.sample}
              labels={{ carousel: t.carouselLabel, previous: t.previous, next: t.nextStory }}
            />
          </div>
        ) : null}

        <div className="mt-10">
          <Button href={localizedPath(lang, "stories")} variant="ghost">
            {t.viewAll} →
          </Button>
        </div>
      </Container>
    </section>
  );
}
