import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The CRM is behind a login and must never be indexed or crawled.
      disallow: "/crm",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
