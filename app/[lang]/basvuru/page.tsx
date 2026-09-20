import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getLang, type LangParams } from "@/lib/i18n/params";
import { localizedPath } from "@/lib/i18n/routes";
import { Container } from "@/components/ui/Container";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { whatsappLinkFor } from "@/lib/site-config";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  const t = getDictionary(lang).assessment;
  return pageMetadata(lang, "apply", { title: t.metaTitle, description: t.metaDescription });
}

export default async function AssessmentPage({
  params,
  searchParams,
}: {
  params: LangParams;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = await getLang(params);
  const dict = getDictionary(lang);
  const query = await searchParams;
  // The query key stays "asama" in both languages so existing links keep working.
  const rawStage = query.asama;
  const initialStage = typeof rawStage === "string" ? rawStage : undefined;

  const whatsapp = whatsappLinkFor();

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <AssessmentFlow
          lang={lang}
          t={dict.assessment}
          common={dict.common}
          homeHref={localizedPath(lang, "home")}
          initialStage={initialStage}
          whatsappLink={whatsapp}
        />
      </Container>
    </div>
  );
}
