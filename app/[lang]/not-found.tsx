import { getDictionary } from "@/lib/content";
import { LocalizedNotFound } from "@/components/layout/LocalizedNotFound";

export default function NotFound() {
  return (
    <LocalizedNotFound
      messages={{
        tr: getDictionary("tr").common.notFound,
        en: getDictionary("en").common.notFound,
      }}
    />
  );
}
