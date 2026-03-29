import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | The Physical Internet",
  description: "Get in touch with TPI. Whether you're interested in data cabling training, installation services, or just want to learn more - we're here to help.",
  keywords: ["contact TPI", "data cabling training contact", "structured cabling services London", "ECS card support contact"],
  openGraph: {
    title: "Contact Us | The Physical Internet",
    description: "Get in touch with TPI. Whether you're interested in data cabling training, installation services, or just want to learn more - we're here to help.",
    images: ["/og-image.jpg"],
    url: "https://www.thephysicalinternet.uk/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | The Physical Internet",
    description: "Get in touch with TPI. Whether you're interested in data cabling training, installation services, or just want to learn more - we're here to help.",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.uk/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}