"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { formatPrice } from "@/shared/utils/format-price";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  brandName: string | null;
};

export function HeaderSearch({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Debounced live search. All state updates happen inside the async
  // callback (not synchronously in the effect body).
  useEffect(() => {
    const term = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results ?? []);
        setLoading(false);
      } catch {
        // Ignore aborted / failed requests.
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToResults = () => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToResults();
  };

  const selectResult = () => {
    setOpen(false);
    onNavigate?.();
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <label className="sr-only" htmlFor={id}>
          Məhsul axtar
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
        <input
          id={id}
          name="q"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setOpen(true);
            setLoading(next.trim().length >= 2);
          }}
          onFocus={() => setOpen(true)}
          placeholder="SSD, RAM, GPU, monitor axtar…"
          className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-24 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 inline-flex h-8 items-center rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Axtar
        </button>
      </form>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-pop">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Axtarılır…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Nəticə tapılmadı
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] divide-y divide-gray-50 overflow-y-auto">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={`/products/${result.slug}`}
                      onClick={selectResult}
                      className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-brand-50"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          alt=""
                          src={result.image}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {result.brandName ? (
                          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-brand-600">
                            {result.brandName}
                          </p>
                        ) : null}
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {result.name}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-gray-900">
                        {formatPrice(result.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                &quot;{query.trim()}&quot; üçün bütün nəticələr
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
