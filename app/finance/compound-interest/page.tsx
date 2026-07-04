"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field, Select } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("finance", "compound-interest");
const style = domainStyles[domain!.color];

const FREQUENCIES: Record<string, number> = {
  Annually: 1,
  "Semi-annually": 2,
  Quarterly: 4,
  Monthly: 12,
  Daily: 365,
};

function formatCurrency(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [contribution, setContribution] = useState("100");
  const [frequency, setFrequency] = useState("Monthly");

  const { futureValue, totalContributed, totalGrowth } = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const annualRate = parseFloat(rate) || 0;
    const t = parseFloat(years) || 0;
    const monthlyContribution = parseFloat(contribution) || 0;
    const n = FREQUENCIES[frequency];
    if (t <= 0) return { futureValue: NaN, totalContributed: NaN, totalGrowth: NaN };

    const periodRate = annualRate / 100 / n;
    const periods = n * t;
    const compoundedPrincipal = p * Math.pow(1 + periodRate, periods);

    // Contributions are modeled monthly regardless of compounding frequency,
    // converted into an equivalent per-period contribution.
    const contributionPerPeriod = (monthlyContribution * 12) / n;
    const contributionGrowth =
      periodRate === 0
        ? contributionPerPeriod * periods
        : contributionPerPeriod * ((Math.pow(1 + periodRate, periods) - 1) / periodRate);

    const fv = compoundedPrincipal + contributionGrowth;
    const contributed = p + monthlyContribution * 12 * t;
    return { futureValue: fv, totalContributed: contributed, totalGrowth: fv - contributed };
  }, [principal, rate, years, contribution, frequency]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Field
            label="Starting amount"
            suffix="USD"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className={style.ring}
          />
          <Field
            label="Monthly contribution"
            suffix="USD"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
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
            label="Time horizon"
            suffix="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className={style.ring}
          />
          <Select label="Compounding frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className={style.ring}>
            {Object.keys(FREQUENCIES).map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col justify-center">
          <ResultPanel
            gradient={style.gradient}
            stats={[
              { label: "Future value", value: `$${formatCurrency(futureValue)}`, primary: true },
              { label: "Total contributed", value: `$${formatCurrency(totalContributed)}` },
              { label: "Growth earned", value: `$${formatCurrency(totalGrowth)}` },
            ]}
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
