import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import CalorieCalculator from "./CalorieCalculator";

export const metadata: Metadata = calculatorMetadata("health", "calorie");

export default function Page() {
  return <CalorieCalculator />;
}
