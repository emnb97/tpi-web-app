import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Structured Cabling & Installation Services",
  description:
    "TPI delivers professional structured cabling installation for commercial and residential builds across the UK. Copper, fibre, containment, and full network infrastructure solutions.",
  keywords: [
    "structured cabling installation UK",
    "commercial network infrastructure",
    "fibre optic installation London",
    "MDU cabling services",
    "Cat6 installation contractor",
    "data centre cabling",
    "network containment trunking",
  ],
  openGraph: {
    title: "Structured Cabling Services | The Physical Internet",
    description: "Professional structured cabling and network infrastructure installation across the UK.",
    url: "https://www.thephysicalinternet.co.uk/services/structured-cabling",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.co.uk/services/structured-cabling",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
