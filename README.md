# CalcVerse

**Every calculator, one app.** A fast, friendly collection of 8 calculators across 4 domains — finance, health, math & units, and everyday life — built with Next.js and deployed on Vercel.

🔗 **Live:** [multi-calc-sand.vercel.app](https://multi-calc-sand.vercel.app)

---

## What's inside

CalcVerse organizes calculators into color-coded domains. Each domain gets its own accent color, icon, and gradient result panel, so the whole app feels consistent while each section still has its own identity.

| Domain | Color | Calculators |
|---|---|---|
| 💰 **Finance** | Emerald | [Loan / EMI Calculator](#loan--emi-calculator) · [Compound Interest](#compound-interest) |
| ❤️ **Health** | Rose | [BMI Calculator](#bmi-calculator) · [Calorie & BMR](#calorie--bmr) |
| 📐 **Math & Units** | Indigo | [Unit Converter](#unit-converter) · [Percentage Calculator](#percentage-calculator) |
| ✨ **Everyday** | Amber | [Age Calculator](#age-calculator) · [Tip Splitter](#tip-splitter) |

Every calculator updates its result live as you type — no submit button, no page reload. All math runs entirely in the browser: there's no backend, no database, no API calls, and no data is ever stored or transmitted.

### Loan / EMI Calculator
`/finance/loan-emi` — Enter a loan amount, annual interest rate, and term in years to get the monthly payment (EMI), total amount paid over the life of the loan, and total interest. Uses the standard amortizing-loan formula.

### Compound Interest
`/finance/compound-interest` — Model how a starting amount plus optional monthly contributions grows over time at a given annual rate, with a choice of compounding frequency (annually, semi-annually, quarterly, monthly, or daily). Shows future value, total contributed, and growth earned.

### BMI Calculator
`/health/bmi` — Body Mass Index from height and weight, in either metric (kg/cm) or imperial (lb/in) units, with the standard BMI category (underweight, healthy weight, overweight, obese).

### Calorie & BMR
`/health/calorie` — Estimated Basal Metabolic Rate using the Mifflin-St Jeor equation, scaled by activity level (sedentary through very active) to estimate Total Daily Energy Expenditure (TDEE).

### Unit Converter
`/math/unit-converter` — Convert between common units of length (meters, kilometers, centimeters, miles, feet, inches), weight (kilograms, grams, pounds, ounces), and temperature (Celsius, Fahrenheit, Kelvin).

### Percentage Calculator
`/math/percentage` — Three common percentage problems in one page: "what is X% of Y", percent change between an old and new value, and "X is what percent of Y".

### Age Calculator
`/everyday/age-calculator` — Exact age in years, months, and days between a birth date and any target date (defaults to today), plus total days lived.

### Tip Splitter
`/everyday/tip-splitter` — Split a restaurant bill with a tip percentage across any number of people, showing the tip amount, total bill, and the amount owed per person.

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) — file-based routing, one route per calculator
- **[React 19](https://react.dev)** — client components with `useState`/`useMemo` for live calculations
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling, dark mode via `prefers-color-scheme`
- **[TypeScript](https://www.typescriptlang.org)** — strict typing throughout
- **[lucide-react](https://lucide.dev)** — icon set used for domain icons and UI chrome
- **[Vercel](https://vercel.com)** — hosting and CI/CD, auto-deploys on push to `main`

No database, no auth, no external APIs — every calculator is a pure function of its inputs.

## Project structure

```
app/
  layout.tsx              # root layout: header/nav, fonts, metadata
  page.tsx                # homepage: domain sections + calculator cards
  globals.css              # Tailwind import + theme tokens
  finance/loan-emi/page.tsx
  finance/compound-interest/page.tsx
  health/bmi/page.tsx
  health/calorie/page.tsx
  math/unit-converter/page.tsx
  math/percentage/page.tsx
  everyday/age-calculator/page.tsx
  everyday/tip-splitter/page.tsx
components/
  CalculatorShell.tsx      # shared page chrome: back link, domain badge, title, card container
  Field.tsx                # styled <input> and <select> form controls
  ResultPanel.tsx          # gradient result card used by every calculator
lib/
  domains.ts               # calculator registry: domains, slugs, names, descriptions
  domain-styles.ts         # literal Tailwind class strings per domain color
```

Adding a new calculator means: add an entry to `lib/domains.ts`, add a matching Tailwind color block to `lib/domain-styles.ts` if it's a new domain color, and create `app/<domain>/<calculator-slug>/page.tsx` following the pattern in any existing calculator page.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app hot-reloads as you edit.

### Other scripts

```bash
npm run build   # production build (also type-checks and prerenders all routes)
npm run start   # run the production build locally
npm run lint    # ESLint
```

## Deployment

The app is deployed on Vercel and connected to this repo's `main` branch — every push triggers a new production deployment automatically.

To deploy manually from the CLI:

```bash
vercel --prod
```

## Design notes

- **Per-domain theming:** Tailwind can't resolve dynamically interpolated class names at build time, so every color utility class used per domain is spelled out literally in `lib/domain-styles.ts` rather than constructed with string interpolation like `bg-${color}-500`.
- **Live calculation:** every calculator uses `useMemo` to recompute results on each keystroke — there's no submit step, matching the "instant answer" feel of the app.
- **Dark mode:** follows the system's `prefers-color-scheme` automatically; no manual toggle.
