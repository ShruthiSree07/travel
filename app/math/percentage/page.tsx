"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("math", "percentage");
const style = domainStyles[domain!.color];

function fmt(n: number, suffix = "") {
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
}

export default function PercentagePage() {
  const [percent, setPercent] = useState("15");
  const [ofNumber, setOfNumber] = useState("200");

  const [oldValue, setOldValue] = useState("50");
  const [newValue, setNewValue] = useState("65");

  const [partValue, setPartValue] = useState("30");
  const [wholeValue, setWholeValue] = useState("120");

  const percentOf = useMemo(() => {
    const p = parseFloat(percent);
    const n = parseFloat(ofNumber);
    if (!Number.isFinite(p) || !Number.isFinite(n)) return NaN;
    return (p / 100) * n;
  }, [percent, ofNumber]);

  const percentChange = useMemo(() => {
    const o = parseFloat(oldValue);
    const n = parseFloat(newValue);
    if (!o || !Number.isFinite(n)) return NaN;
    return ((n - o) / Math.abs(o)) * 100;
  }, [oldValue, newValue]);

  const whatPercent = useMemo(() => {
    const part = parseFloat(partValue);
    const whole = parseFloat(wholeValue);
    if (!whole || !Number.isFinite(part)) return NaN;
    return (part / whole) * 100;
  }, [partValue, wholeValue]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">What is X% of Y?</h3>
            <div className="flex gap-3">
              <Field label="Percent" suffix="%" value={percent} onChange={(e) => setPercent(e.target.value)} className={style.ring} />
              <Field label="Of number" value={ofNumber} onChange={(e) => setOfNumber(e.target.value)} className={style.ring} />
            </div>
          </div>
          <ResultPanel gradient={style.gradient} stats={[{ label: "Result", value: fmt(percentOf), primary: true }]} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Percent change</h3>
            <div className="flex gap-3">
              <Field label="Old value" value={oldValue} onChange={(e) => setOldValue(e.target.value)} className={style.ring} />
              <Field label="New value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className={style.ring} />
            </div>
          </div>
          <ResultPanel
            gradient={style.gradient}
            stats={[{ label: "Change", value: fmt(percentChange, "%"), primary: true }]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">X is what percent of Y?</h3>
            <div className="flex gap-3">
              <Field label="X" value={partValue} onChange={(e) => setPartValue(e.target.value)} className={style.ring} />
              <Field label="Y" value={wholeValue} onChange={(e) => setWholeValue(e.target.value)} className={style.ring} />
            </div>
          </div>
          <ResultPanel gradient={style.gradient} stats={[{ label: "Result", value: fmt(whatPercent, "%"), primary: true }]} />
        </div>
      </div>
    </CalculatorShell>
  );
}
