import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | The Physical Internet",
  description: "Get in touch with TPI. Whether you're interested in data cabling training, installation services, or just want to learn more - we're here to help.",
  openGraph: {
    title: "Contact Us | The Physical Internet",
    description: "Get in touch with TPI. Whether you're interested in data cabling training, installation services, or just want to learn more - we're here to help.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}