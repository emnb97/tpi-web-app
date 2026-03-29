import type { Metadata } from "next";
import LegalClient from "./LegalClient";

export const metadata: Metadata = {
  title: "Legal & Privacy Policy",
  description: "Privacy policy, data handling practices, and legal information for The Physical Internet Ltd.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.thephysicalinternet.co.uk/legal" },
};

export default function LegalPage() {
  return <LegalClient />;
}
