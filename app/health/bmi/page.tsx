import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import BmiCalculator from "./BmiCalculator";

export const metadata: Metadata = calculatorMetadata("health", "bmi");

export default function Page() {
  return <BmiCalculator />;
}
