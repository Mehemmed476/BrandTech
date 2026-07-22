"use client";

import { Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CategoryIcon,
  categoryIconOptions,
} from "@/shared/components/category-icon";
import { cn } from "@/shared/utils/cn";

export function CategoryIconPicker({
  value,
  slug,
  onChange,
  error,
}: {
  value: string;
  slug: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = categoryIconOptions.find((option) => option.name === value);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("az");
    if (!term) return categoryIconOptions;
    return categoryIconOptions.filter(
      (option) =>
        option.label.toLocaleLowerCase("az").includes(term) ||
        option.name.toLocaleLowerCase().includes(term),
    );
  }, [query]);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        Kateqoriya ikonu
      </label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex min-h-14 w-full items-center gap-3 rounded-xl border bg-white px-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40",
          error ? "border-rose-300" : "border-gray-200",
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
          <CategoryIcon slug={slug} iconName={value} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-800">
            {selected?.label ?? "Avtomatik ikon"}
          </span>
          <span className="block text-xs text-gray-500">
            Dəyişmək üçün ikon panelini açın
          </span>
        </span>
        <Sparkles className="h-4 w-4 text-brand-500" />
      </button>
      {error ? <p className="mt-1.5 text-xs text-rose-500">{error}</p> : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Kateqoriya ikonu seçin"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-t-3xl border border-gray-100 bg-white p-5 shadow-pop sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  İkon seçin
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  WhatsApp emoji paneli kimi axtarın və uyğun ikona toxunun.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Bağla"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Məsələn: prosessor, gaming, printer..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div className="mt-4 max-h-[48vh] overflow-y-auto pr-1">
              {!query ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className={cn(
                    "mb-3 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition hover:border-brand-300 hover:bg-brand-50",
                    !value ? "border-brand-400 bg-brand-50" : "border-gray-200",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-inset ring-brand-100">
                    <CategoryIcon slug={slug} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-gray-800">
                      Avtomatik seçim
                    </span>
                    <span className="block text-xs text-gray-500">
                      Slug-a uyğun standart ikon istifadə edilir
                    </span>
                  </span>
                </button>
              ) : null}

              {filtered.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {filtered.map(({ name, label, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      title={label}
                      aria-label={label}
                      onClick={() => {
                        onChange(name);
                        setOpen(false);
                      }}
                      className={cn(
                        "group flex aspect-square min-h-16 flex-col items-center justify-center gap-1 rounded-xl border transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
                        value === name
                          ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100"
                          : "border-gray-100 bg-gray-50 text-gray-600",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="w-full truncate px-1 text-[10px] font-semibold">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-sm text-gray-500">
                  Bu axtarışa uyğun ikon tapılmadı.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
