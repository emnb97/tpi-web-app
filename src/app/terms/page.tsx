import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using The Physical Internet Ltd website, purchasing products, and enrolling on training courses.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://www.thephysicalinternet.co.uk/terms" },
};

export default function TermsPage() {
  return <TermsClient />;
}
