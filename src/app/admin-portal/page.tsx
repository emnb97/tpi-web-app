import type { Metadata } from "next";
import AdminPortal from "./admin";

export const metadata: Metadata = {
  title: "Admin Portal | The Physical Internet",
  description: "Internal dashboard — not for public access.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal />;
}
