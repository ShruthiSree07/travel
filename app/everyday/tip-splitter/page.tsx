import type { Metadata } from "next";
import { calculatorMetadata } from "@/lib/metadata";
import TipSplitterCalculator from "./TipSplitterCalculator";

export const metadata: Metadata = calculatorMetadata("everyday", "tip-splitter");

export default function Page() {
  return <TipSplitterCalculator />;
}
