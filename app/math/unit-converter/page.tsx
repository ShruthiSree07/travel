import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import UnitConverterCalculator from "./UnitConverterCalculator";

export const metadata: Metadata = calculatorMetadata("math", "unit-converter");

export default function Page() {
  return <UnitConverterCalculator />;
}
