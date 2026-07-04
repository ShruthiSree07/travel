import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { domainStyles } from "@/lib/domain-styles";
import type { Domain, Calculator } from "@/lib/domains";

export function CalculatorShell({
  domain,
  calculator,
  children,
}: {
  domain: Domain;
  calculator: Calculator;
  children: React.ReactNode;
}) {
  const style = domainStyles[domain.color];
  const Icon = domain.icon;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" />
        All calculators
      </Link>

      <div className="mb-8 flex items-start gap-4">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${style.iconWrap}`}>
          <Icon className="size-6" />
        </div>
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
            {domain.name}
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            {calculator.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{calculator.description}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        {children}
      </div>
    </div>
  );
}
