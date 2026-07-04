"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field, Select } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { ErrorMessage } from "@/components/ErrorMessage";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("health", "bmi");
const style = domainStyles[domain!.color];

function bmiCategory(bmi: number) {
  if (!Number.isFinite(bmi)) return "—";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export default function BmiPage() {
  const [units, setUnits] = useState("Metric (kg, cm)");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");

  const error = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) return "Enter a weight greater than 0.";
    if (!height.trim() || !Number.isFinite(h) || h <= 0) return "Enter a height greater than 0.";
    return null;
  }, [weight, height]);

  const bmi = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return NaN;
    if (units === "Metric (kg, cm)") {
      const meters = h / 100;
      return w / (meters * meters);
    }
    // Imperial: weight in lb, height in inches
    return (w / (h * h)) * 703;
  }, [weight, height, units]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Select label="Units" value={units} onChange={(e) => setUnits(e.target.value)} className={style.ring}>
            <option>Metric (kg, cm)</option>
            <option>Imperial (lb, in)</option>
          </Select>
          <Field
            label="Weight"
            suffix={units.startsWith("Metric") ? "kg" : "lb"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={style.ring}
            aria-invalid={!!error}
          />
          <Field
            label="Height"
            suffix={units.startsWith("Metric") ? "cm" : "in"}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={style.ring}
            aria-invalid={!!error}
          />
        </div>

        <div className="flex flex-col justify-center">
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <ResultPanel
              gradient={style.gradient}
              stats={[
                { label: "Your BMI", value: Number.isFinite(bmi) ? bmi.toFixed(1) : "—", primary: true },
                { label: "Category", value: bmiCategory(bmi) },
              ]}
            />
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
