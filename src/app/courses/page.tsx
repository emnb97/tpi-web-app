import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Training & Courses",
  description:
    "Hands-on structured cabling masterclasses in the UK. From copper termination to fibre splicing, ECS card support, and City & Guilds certification. Join TPI's training academy today.",
  keywords: [
    "structured cabling training UK",
    "fibre optic course London",
    "Cat6 termination training",
    "ECS card support",
    "data cabling masterclass",
    "City and Guilds cabling",
    "network infrastructure course",
  ],
  openGraph: {
    title: "Training & Courses | The Physical Internet",
    description: "Hands-on structured cabling and fibre optic training in the UK.",
    url: "https://www.thephysicalinternet.co.uk/courses",
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.co.uk/courses",
  },
};

export default function CoursesPage() {
  return <CoursesClient />;
}
