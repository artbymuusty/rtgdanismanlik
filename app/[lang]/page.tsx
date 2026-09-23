import { Hero } from "@/components/sections/Hero";
import { StageSelector } from "@/components/sections/StageSelector";
import { Journey } from "@/components/sections/Journey";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { UniversityExplorerSection } from "@/components/university-explorer/UniversityExplorerSection";
import { StudentStories } from "@/components/sections/StudentStories";
import { MentorshipTeaser } from "@/components/sections/MentorshipTeaser";
import { HumanConnection } from "@/components/sections/HumanConnection";
import { JoinUsCta } from "@/components/recruitment/JoinUsCta";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { getDictionary } from "@/lib/content";
import { getLang, type LangParams } from "@/lib/i18n/params";

export default async function Home({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = getDictionary(lang);

  return (
    <>
      <Hero lang={lang} />
      <StageSelector lang={lang} t={t.home.stageSelector} />
      <Journey lang={lang} />
      <ServicesOverview lang={lang} />
      <HowWeWork lang={lang} />
      <UniversityExplorerSection lang={lang} />
      <StudentStories lang={lang} />
      <MentorshipTeaser lang={lang} />
      <HumanConnection lang={lang} />
      <JoinUsCta lang={lang} />
      <FaqPreview lang={lang} />
      <FinalCta lang={lang} />
    </>
  );
}
