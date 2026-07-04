import {
  Landmark,
  HeartPulse,
  Ruler,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Domain = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  color: string; // tailwind color name used to build classes
  calculators: Calculator[];
};

export type Calculator = {
  slug: string;
  name: string;
  description: string;
};

export const domains: Domain[] = [
  {
    slug: "finance",
    name: "Finance",
    tagline: "Loans, interest, and money math",
    icon: Landmark,
    color: "emerald",
    calculators: [
      {
        slug: "loan-emi",
        name: "Loan / EMI Calculator",
        description: "Monthly payment, total interest, and payoff breakdown for any loan.",
      },
      {
        slug: "compound-interest",
        name: "Compound Interest",
        description: "See how savings or investments grow with compounding over time.",
      },
    ],
  },
  {
    slug: "health",
    name: "Health",
    tagline: "Body metrics and daily energy needs",
    icon: HeartPulse,
    color: "rose",
    calculators: [
      {
        slug: "bmi",
        name: "BMI Calculator",
        description: "Body Mass Index from your height and weight, with the standard category.",
      },
      {
        slug: "calorie",
        name: "Calorie & BMR",
        description: "Daily calorie needs (BMR + activity level) using the Mifflin-St Jeor formula.",
      },
    ],
  },
  {
    slug: "math",
    name: "Math & Units",
    tagline: "Conversions and quick arithmetic",
    icon: Ruler,
    color: "indigo",
    calculators: [
      {
        slug: "unit-converter",
        name: "Unit Converter",
        description: "Convert length, weight, and temperature between common units.",
      },
      {
        slug: "percentage",
        name: "Percentage Calculator",
        description: "Percent of a number, percent change, and what-percent-is-X-of-Y.",
      },
    ],
  },
  {
    slug: "everyday",
    name: "Everyday",
    tagline: "Handy calculators for daily life",
    icon: Sparkles,
    color: "amber",
    calculators: [
      {
        slug: "age-calculator",
        name: "Age Calculator",
        description: "Exact age in years, months, and days from a birth date.",
      },
      {
        slug: "tip-splitter",
        name: "Tip Splitter",
        description: "Split a bill with tip across any number of people.",
      },
    ],
  },
];

export function findCalculator(domainSlug: string, calcSlug: string) {
  const domain = domains.find((d) => d.slug === domainSlug);
  const calculator = domain?.calculators.find((c) => c.slug === calcSlug);
  return { domain, calculator };
}
