import type { Metadata } from "next";
import { AdminNewsletterPage } from "@/features/admin/newsletter/newsletter-page";

export const metadata: Metadata = { title: "Email abunəçiləri" };

export default function Page() {
  return <AdminNewsletterPage />;
}
