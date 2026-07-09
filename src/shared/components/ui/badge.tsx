import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeVariant =
  | "default"
  | "success"
  | "muted"
  | "warning"
  | "outline"
  | "danger"
  | "dark"
  | "glass";

const variants: Record<BadgeVariant, string> = {
  default: "bg-brand-600 text-white",
  success: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  muted: "bg-gray-100 text-gray-600",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
  outline: "border border-gray-200 bg-white text-gray-700",
  danger: "bg-rose-500 text-white",
  dark: "bg-gray-900/85 text-white",
  glass: "glass text-gray-800 ring-1 ring-inset ring-white/60",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
