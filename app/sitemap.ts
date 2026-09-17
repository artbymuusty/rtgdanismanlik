import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const routes = [
  "",
  "/nasil-yardimci-oluyoruz",
  "/mentorluk",
  "/ogrenci-hikayeleri",
  "/hakkimizda",
  "/fiyatlar",
  "/sss",
  "/iletisim",
  "/basvuru",
  "/bize-katilin",
  "/gizlilik",
  "/kvkk",
  "/kullanim-sartlari",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
