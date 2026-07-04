"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Search, X } from "lucide-react";
import { domains } from "@/lib/domains";
import { domainStyles } from "@/lib/domain-styles";

export default function Home() {
  const [query, setQuery] = useState("");

  const filteredDomains = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return domains;
    return domains
      .map((domain) => ({
        ...domain,
        calculators: domain.calculators.filter(
          (calc) =>
            calc.name.toLowerCase().includes(q) ||
            calc.description.toLowerCase().includes(q) ||
            domain.name.toLowerCase().includes(q)
        ),
      }))
      .filter((domain) => domain.calculators.length > 0);
  }, [query]);

  const totalMatches = filteredDomains.reduce((sum, d) => sum + d.calculators.length, 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-20">
      <div className="mb-10 text-center">
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

      <div className="mx-auto mb-16 max-w-md">
        <label htmlFor="calculator-search" className="sr-only">
          Search calculators
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
          <input
            id="calculator-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators… (e.g. loan, BMI, tip)"
            className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-11 pr-11 text-base text-neutral-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {totalMatches === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No calculators match &ldquo;{query}&rdquo;. Try a different keyword.
        </div>
      ) : (
        <div className="space-y-14">
          {filteredDomains.map((domain) => {
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
      )}
    </div>
  );
}
