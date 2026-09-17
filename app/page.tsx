import { Hero } from "@/components/sections/Hero";
import { StageSelector } from "@/components/sections/StageSelector";
import { Journey } from "@/components/sections/Journey";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { VisualStorytelling } from "@/components/sections/VisualStorytelling";
import { StudentStories } from "@/components/sections/StudentStories";
import { MentorshipTeaser } from "@/components/sections/MentorshipTeaser";
import { HumanConnection } from "@/components/sections/HumanConnection";
import { JoinUsCta } from "@/components/recruitment/JoinUsCta";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <StageSelector />
      <Journey />
      <ServicesOverview />
      <HowWeWork />
      <VisualStorytelling />
      <StudentStories />
      <MentorshipTeaser />
      <HumanConnection />
      <JoinUsCta />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
