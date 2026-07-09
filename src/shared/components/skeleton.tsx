import { cn } from "@/shared/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-brand-50 via-gray-100 to-brand-50",
        className,
      )}
    />
  );
}
