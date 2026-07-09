import type { ReactNode } from "react";
import Link from "next/link";
import {
  Pencil,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { StatusTone } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  trend = "up",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  trend?: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition hover:shadow-card">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
          <Icon className="h-5 w-5" />
        </span>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold",
              trend === "up"
                ? "bg-brand-50 text-brand-700"
                : "bg-rose-50 text-rose-600",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {delta}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-gray-900">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}

export function TableCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-900">{title}</h2>
          {description ? (
            <p className="text-xs text-gray-400">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

const toneStyles: Record<StatusTone, string> = {
  green: "bg-brand-50 text-brand-700 ring-brand-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  gray: "bg-gray-100 text-gray-500 ring-gray-200",
};

export function StatusPill({
  label,
  tone = "gray",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        toneStyles[tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Redaktə et"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-brand-300 hover:text-brand-700"
    >
      <Pencil className="h-4 w-4" />
    </Link>
  );
}

export const thClass =
  "px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400";
export const tdClass = "px-5 py-3.5 text-sm text-gray-700";
