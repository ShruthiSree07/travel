import Link from "next/link";
import { Calculator } from "lucide-react";
import { domains } from "@/lib/domains";
import { domainStyles } from "@/lib/domain-styles";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <div className="mb-16 text-center">
        <div className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
          <Calculator className="size-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
          One app.{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Every calculator.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500 dark:text-neutral-400">
          Finance, health, math, and everyday tools — pick a calculator below and get an instant answer.
        </p>
      </div>

      <div className="space-y-14">
        {domains.map((domain) => {
          const style = domainStyles[domain.color];
          const Icon = domain.icon;
          return (
            <section key={domain.slug}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl ${style.iconWrap}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{domain.name}</h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{domain.tagline}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {domain.calculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/${domain.slug}/${calc.slug}`}
                    className={`group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 ${style.cardHover}`}
                  >
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{calc.name}</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{calc.description}</p>
                    <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${style.textAccent}`}>
                      Open calculator
                      <span className="transition group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-20 text-center text-sm text-neutral-400 dark:text-neutral-600">
        Built with Next.js · No sign-up, no data stored.
      </footer>
    </div>
  );
}
