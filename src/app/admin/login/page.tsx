import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/features/auth/admin-login-form";
import { getSession } from "@/shared/lib/auth";

export const metadata: Metadata = { title: "Admin girişi" };

export default async function Page() {
  const session = await getSession();
  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="mesh-brand flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Mağazaya qayıt
        </Link>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-base font-black text-white">
              BT
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
                Admin panelə giriş
              </h1>
              <p className="text-xs text-gray-500">Brand Technology</p>
            </div>
          </div>

          <AdminLoginForm />

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            Yalnız admin istifadəçilər üçün
          </p>
        </div>
      </div>
    </main>
  );
}
