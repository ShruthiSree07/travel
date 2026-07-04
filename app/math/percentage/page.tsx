import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import PercentageCalculator from "./PercentageCalculator";

export const metadata: Metadata = calculatorMetadata("math", "percentage");

export default function Page() {
  return <PercentageCalculator />;
}
