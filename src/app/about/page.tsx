import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About TPI",
  description:
    "The Physical Internet is a UK structured cabling training company. Learn about our mission to build the next generation of data cabling engineers and network infrastructure professionals.",
  openGraph: {
    title: "About | The Physical Internet",
    description: "Building the next generation of UK network infrastructure engineers.",
    url: "https://www.thephysicalinternet.co.uk/about",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.co.uk/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
