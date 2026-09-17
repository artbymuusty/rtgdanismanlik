import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { whatsappLinkFor } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Seni Biraz Tanıyalım",
  description: "Birkaç kısa soruyla mevcut durumunu anlayalım, sana uygun bir görüşme hazırlayalım.",
  alternates: { canonical: "/basvuru" },
};

export default async function AssessmentPage({ searchParams }: PageProps<"/basvuru">) {
  const params = await searchParams;
  const rawStage = params.asama;
  const initialStage = typeof rawStage === "string" ? rawStage : undefined;

  const whatsapp = whatsappLinkFor();

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <AssessmentFlow initialStage={initialStage} whatsappLink={whatsapp} />
      </Container>
    </div>
  );
}
