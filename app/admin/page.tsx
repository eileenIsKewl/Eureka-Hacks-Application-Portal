import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Control Room — EurekaHacks",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
