"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field, Select } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("math", "unit-converter");
const style = domainStyles[domain!.color];

type Category = "Length" | "Weight" | "Temperature";

// Each factor converts 1 unit to the category's base unit (meters, kilograms).
const UNITS: Record<Category, Record<string, number>> = {
  Length: {
    Meters: 1,
    Kilometers: 1000,
    Centimeters: 0.01,
    Miles: 1609.344,
    Feet: 0.3048,
    Inches: 0.0254,
  },
  Weight: {
    Kilograms: 1,
    Grams: 0.001,
    Pounds: 0.45359237,
    Ounces: 0.028349523125,
  },
  Temperature: {
    Celsius: 1,
    Fahrenheit: 1,
    Kelvin: 1,
  },
};

function convertTemperature(value: number, from: string, to: string) {
  let celsius: number;
  if (from === "Celsius") celsius = value;
  else if (from === "Fahrenheit") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("Length");
  const [amount, setAmount] = useState("1");
  const [fromUnit, setFromUnit] = useState("Meters");
  const [toUnit, setToUnit] = useState("Feet");

  const unitNames = Object.keys(UNITS[category]);

  function handleCategoryChange(next: Category) {
    setCategory(next);
    const names = Object.keys(UNITS[next]);
    setFromUnit(names[0]);
    setToUnit(names[1] ?? names[0]);
  }

  const result = useMemo(() => {
    const value = parseFloat(amount);
    if (!Number.isFinite(value)) return NaN;
    if (category === "Temperature") return convertTemperature(value, fromUnit, toUnit);
    const baseValue = value * UNITS[category][fromUnit];
    return baseValue / UNITS[category][toUnit];
  }, [amount, category, fromUnit, toUnit]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Select label="Category" value={category} onChange={(e) => handleCategoryChange(e.target.value as Category)} className={style.ring}>
            <option>Length</option>
            <option>Weight</option>
            <option>Temperature</option>
          </Select>
          <Field label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={style.ring} />
          <Select label="From" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={style.ring}>
            {unitNames.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
          <Select label="To" value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={style.ring}>
            {unitNames.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col justify-center">
          <ResultPanel
            gradient={style.gradient}
            stats={[
              {
                label: "Result",
                value: Number.isFinite(result) ? `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}` : "—",
                primary: true,
              },
            ]}
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
