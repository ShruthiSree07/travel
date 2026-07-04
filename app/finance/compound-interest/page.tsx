import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import CompoundInterestCalculator from "./CompoundInterestCalculator";

export const metadata: Metadata = calculatorMetadata("finance", "compound-interest");

export default function Page() {
  return <CompoundInterestCalculator />;
}
