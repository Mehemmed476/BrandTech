"use client";

import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { orderStatusLabels, orderStatusOrder } from "@/shared/constants/labels";
import { inputClass } from "@/features/admin/form-ui";

export function OrderFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const apply = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apply({ q: search.trim() });
  };

  return (
    <div className="mb-5 grid gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft md:grid-cols-[1.6fr_1fr]">
      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Sifariş nömrəsi, müştəri və ya telefon"
          className={`${inputClass} pl-10`}
          type="search"
        />
      </form>
      <select
        className={`${inputClass} pr-8`}
        value={searchParams.get("status") ?? ""}
        onChange={(event) => apply({ status: event.target.value })}
      >
        <option value="">Bütün statuslar</option>
        {orderStatusOrder.map((status) => (
          <option key={status} value={status}>
            {orderStatusLabels[status]}
          </option>
        ))}
      </select>
    </div>
  );
}
