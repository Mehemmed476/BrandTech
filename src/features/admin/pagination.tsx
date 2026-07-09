"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goto = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        Səhifə <span className="font-semibold text-gray-900">{page}</span> /{" "}
        {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goto(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Əvvəlki
        </button>
        <button
          type="button"
          onClick={() => goto(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 disabled:opacity-40"
        >
          Növbəti
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
