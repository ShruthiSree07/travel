"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("everyday", "tip-splitter");
const style = domainStyles[domain!.color];

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function TipSplitterPage() {
  const [bill, setBill] = useState("120");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("4");

  const { tipAmount, total, perPerson } = useMemo(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people, 10);
    if (!Number.isFinite(b) || !Number.isFinite(t) || !p || p <= 0 || b < 0) {
      return { tipAmount: NaN, total: NaN, perPerson: NaN };
    }
    const tip = b * (t / 100);
    const totalBill = b + tip;
    return { tipAmount: tip, total: totalBill, perPerson: totalBill / p };
  }, [bill, tipPercent, people]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Field label="Bill amount" suffix="USD" value={bill} onChange={(e) => setBill(e.target.value)} className={style.ring} />
          <Field
            label="Tip percentage"
            suffix="%"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className={style.ring}
          />
          <Field
            label="Number of people"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className={style.ring}
          />
        </div>

        <div className="flex flex-col justify-center">
          <ResultPanel
            gradient={style.gradient}
            stats={[
              { label: "Per person", value: `$${fmt(perPerson)}`, primary: true },
              { label: "Tip amount", value: `$${fmt(tipAmount)}` },
              { label: "Total bill", value: `$${fmt(total)}` },
            ]}
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
