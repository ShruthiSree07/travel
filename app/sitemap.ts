import type { MetadataRoute } from "next";
import { domains } from "@/lib/domains";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  for (const domain of domains) {
    for (const calc of domain.calculators) {
      routes.push({
        url: `${siteUrl}/${domain.slug}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return routes;
}
