import type { Metadata } from "next";
import StoreClient from "./StoreClient";

export const metadata: Metadata = {
  title: "Store — Tools, Kits & Digital Products",
  description:
    "Shop TPI's professional structured cabling tools, starter kits, ECS revision materials, and branded merchandise. Everything a data cabling engineer needs.",
  keywords: [
    "structured cabling tools UK",
    "data cabling starter kit",
    "ECS revision materials",
    "fiber splicing tools buy",
    "TPI merchandise",
    "cabling training resources",
  ],
  openGraph: {
    title: "Store | The Physical Internet",
    description: "Professional cabling tools, starter kits, and digital training resources.",
    url: "https://www.thephysicalinternet.co.uk/store",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.co.uk/store",
  },
};

export default function StorePage() {
  return <StoreClient />;
}
