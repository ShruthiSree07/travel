"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { Field } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { ErrorMessage } from "@/components/ErrorMessage";
import { domainStyles } from "@/lib/domain-styles";
import { findCalculator } from "@/lib/domains";

const { domain, calculator } = findCalculator("everyday", "age-calculator");
const style = domainStyles[domain!.color];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("2000-01-01");
  const [onDate, setOnDate] = useState(todayISO());

  const error = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(onDate);
    if (!birthDate || isNaN(birth.getTime())) return "Enter a valid date of birth.";
    if (!onDate || isNaN(target.getTime())) return "Enter a valid 'as of' date.";
    if (birth > target) return "Date of birth must be before the 'as of' date.";
    return null;
  }, [birthDate, onDate]);

  const { years, months, days, totalDays } = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(onDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return { years: NaN, months: NaN, days: NaN, totalDays: NaN };
    }

    let y = target.getFullYear() - birth.getFullYear();
    let m = target.getMonth() - birth.getMonth();
    let d = target.getDate() - birth.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const total = Math.floor((target.getTime() - birth.getTime()) / msPerDay);

    return { years: y, months: m, days: d, totalDays: total };
  }, [birthDate, onDate]);

  return (
    <CalculatorShell domain={domain!} calculator={calculator!}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-5">
          <Field
            label="Date of birth"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={style.ring}
            aria-invalid={!!error}
          />
          <Field
            label="As of date"
            type="date"
            value={onDate}
            onChange={(e) => setOnDate(e.target.value)}
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
                {
                  label: "Age",
                  value: Number.isFinite(years) ? `${years}y ${months}m ${days}d` : "—",
                  primary: true,
                },
                { label: "Total days lived", value: Number.isFinite(totalDays) ? totalDays.toLocaleString() : "—" },
              ]}
            />
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
