import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import AgeCalculatorCalculator from "./AgeCalculatorCalculator";

export const metadata: Metadata = calculatorMetadata("everyday", "age-calculator");

export default function Page() {
  return <AgeCalculatorCalculator />;
}
