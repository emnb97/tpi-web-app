import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | The Physical Internet Training",
  description:
    "The Physical Internet is a UK structured cabling training company. Learn about our mission to build the next generation of data cabling engineers and network infrastructure professionals.",
  keywords: ["structured cabling", "fiber optics", "data cabling training", "London", "network infrastructure"],
  openGraph: {
    title: "About Us | The Physical Internet Training",
    description: "Building the next generation of UK network infrastructure engineers.",
    images: ["/og-image.jpg"],
    url: "https://www.thephysicalinternet.uk/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | The Physical Internet Training",
    description: "Building the next generation of UK network infrastructure engineers.",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.uk/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}