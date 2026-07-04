"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("finance", "loan-emi");
const style = domainStyles[domain!.color];

function formatCurrency(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function LoanEmiPage() {
  const [principal, setPrincipal] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("20");

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const p = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const n = parseFloat(years) * 12;
    if (!p || !annualRate || !n || p <= 0 || n <= 0) {
      return { emi: NaN, totalPayment: NaN, totalInterest: NaN };
    }
    const monthlyRate = annualRate / 100 / 12;
    const emiValue =
      monthlyRate === 0
        ? p / n
        : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const total = emiValue * n;
    return { emi: emiValue, totalPayment: total, totalInterest: total - p };
  }, [principal, rate, years]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Field
            label="Loan amount"
            suffix="USD"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className={style.ring}
          />
          <Field
            label="Annual interest rate"
            suffix="%"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={style.ring}
          />
          <Field
            label="Loan term"
            suffix="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className={style.ring}
          />
        </div>

        <div className="flex flex-col justify-center">
          <ResultPanel
            gradient={style.gradient}
            stats={[
              { label: "Monthly payment", value: `$${formatCurrency(emi)}`, primary: true },
              { label: "Total payment", value: `$${formatCurrency(totalPayment)}` },
              { label: "Total interest", value: `$${formatCurrency(totalInterest)}` },
            ]}
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
