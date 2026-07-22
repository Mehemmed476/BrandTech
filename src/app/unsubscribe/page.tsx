import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeForm } from "@/features/newsletter/unsubscribe-form";

export const metadata: Metadata = { title: "Abunəlikdən çıx" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const value = (await searchParams).token;
  const token = typeof value === "string" ? value : "";

  return (
    <main className="mesh-brand flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-7 shadow-card">
        <Link href="/" className="text-lg font-black text-brand-700">
          Brand Technology
        </Link>
        <h1 className="mt-6 text-2xl font-black tracking-tight text-gray-900">
          Email abunəliyi
        </h1>
        <div className="mt-4">
          <UnsubscribeForm token={token} />
        </div>
      </section>
    </main>
  );
}
