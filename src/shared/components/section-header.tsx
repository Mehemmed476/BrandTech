import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "mb-8 flex flex-col items-center text-center"
          : "mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-[32px] md:leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="mt-2.5 text-[15px] leading-relaxed text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel && !centered ? (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-soft transition-all hover:border-brand-300 hover:text-brand-700"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
