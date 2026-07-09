import type { Metadata } from "next";
import { AdminDashboardPage } from "@/features/admin/admin-pages";

export const metadata: Metadata = {
  title: "İdarə paneli",
};

export default function Page() {
  return <AdminDashboardPage />;
}
