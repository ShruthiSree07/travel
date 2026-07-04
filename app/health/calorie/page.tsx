"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field, Select } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { ErrorMessage } from "@/components/ErrorMessage";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("health", "calorie");
const style = domainStyles[domain!.color];

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  "Sedentary (little exercise)": 1.2,
  "Light (1-3 days/week)": 1.375,
  "Moderate (3-5 days/week)": 1.55,
  "Active (6-7 days/week)": 1.725,
  "Very active (hard exercise daily)": 1.9,
};

export default function CaloriePage() {
  const [sex, setSex] = useState("Female");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("65");
  const [height, setHeight] = useState("165");
  const [activity, setActivity] = useState("Light (1-3 days/week)");

  const error = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!age.trim() || !Number.isFinite(a) || a <= 0) return "Enter an age greater than 0.";
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) return "Enter a weight greater than 0.";
    if (!height.trim() || !Number.isFinite(h) || h <= 0) return "Enter a height greater than 0.";
    return null;
  }, [age, weight, height]);

  const { bmr, tdee } = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return { bmr: NaN, tdee: NaN };

    // Mifflin-St Jeor
    const base = 10 * w + 6.25 * h - 5 * a;
    const bmrValue = sex === "Female" ? base - 161 : base + 5;
    return { bmr: bmrValue, tdee: bmrValue * ACTIVITY_MULTIPLIERS[activity] };
  }, [sex, age, weight, height, activity]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Select label="Sex" value={sex} onChange={(e) => setSex(e.target.value)} className={style.ring}>
            <option>Female</option>
            <option>Male</option>
          </Select>
          <Field label="Age" suffix="years" value={age} onChange={(e) => setAge(e.target.value)} className={style.ring} aria-invalid={!!error} />
          <Field label="Weight" suffix="kg" value={weight} onChange={(e) => setWeight(e.target.value)} className={style.ring} aria-invalid={!!error} />
          <Field label="Height" suffix="cm" value={height} onChange={(e) => setHeight(e.target.value)} className={style.ring} aria-invalid={!!error} />
          <Select label="Activity level" value={activity} onChange={(e) => setActivity(e.target.value)} className={style.ring}>
            {Object.keys(ACTIVITY_MULTIPLIERS).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col justify-center">
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <ResultPanel
              gradient={style.gradient}
              stats={[
                {
                  label: "Daily calories (TDEE)",
                  value: Number.isFinite(tdee) ? `${Math.round(tdee)} kcal` : "—",
                  primary: true,
                },
                { label: "Base metabolic rate (BMR)", value: Number.isFinite(bmr) ? `${Math.round(bmr)} kcal` : "—" },
              ]}
            />
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
