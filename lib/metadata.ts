import type { Metadata } from "next";
import { findCalculator } from "@/lib/domains";
import { siteUrl } from "@/lib/site";

export function calculatorMetadata(domainSlug: string, calcSlug: string): Metadata {
  const { domain, calculator } = findCalculator(domainSlug, calcSlug);
  if (!domain || !calculator) return {};

  const title = `${calculator.name} — CalcVerse`;
  const description = calculator.description;
  const url = `${siteUrl}/${domain.slug}/${calculator.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "CalcVerse",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
