import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import LoanEmiCalculator from "./LoanEmiCalculator";

export const metadata: Metadata = calculatorMetadata("finance", "loan-emi");

export default function Page() {
  return <LoanEmiCalculator />;
}
