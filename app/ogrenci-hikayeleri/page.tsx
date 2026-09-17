import type { Metadata } from "next";
import { studentStories } from "@/lib/content/stories";
import { demoStudentStories } from "@/lib/content/stories.demo";
import { demoContentEnabled } from "@/lib/content/demo";
import { Container } from "@/components/ui/Container";
import { FeaturedStudentStory } from "@/components/stories/FeaturedStudentStory";

const title = "Öğrenci Hikâyeleri";
const description = "Bu yolculuktan gerçekten geçmiş olanların hikâyeleri: nereden başladılar, hangi adımlardan geçtiler, şimdi nerede?";

export function generateMetadata(): Metadata {
  return { title, description, alternates: { canonical: "/ogrenci-hikayeleri" } };
}

export default function StudentStoriesPage() {
  const isDemo = studentStories.length === 0 && demoContentEnabled;
  const stories = isDemo ? demoStudentStories : studentStories;

  return (
    <div className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 font-display text-xl italic text-muted">
          Her yol aynı başlamıyor. Ama bazen doğru bir konuşma, sonraki adımı görmeyi kolaylaştırıyor.
        </p>
      </Container>

      {stories.length === 0 ? (
        <Container className="mt-14 max-w-3xl">
          <p className="text-muted">
            Henüz burada paylaşabileceğimiz bir hikâye yok. İlk hikâyeler geldiğinde bu sayfa güncellenecek.
          </p>
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
              />
            </div>
          ))}
        </Container>
      )}
    </div>
  );
}
