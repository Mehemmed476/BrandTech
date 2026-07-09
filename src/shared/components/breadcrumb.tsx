import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium transition-colors hover:text-brand-700"
          >
            <Home aria-hidden className="h-3.5 w-3.5" />
            Ana səhifə
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex items-center gap-1.5" key={item.label}>
            <ChevronRight aria-hidden className="h-3.5 w-3.5 text-gray-300" />
            {item.href ? (
              <Link
                className="max-w-[16rem] truncate px-1 font-medium transition-colors hover:text-brand-700"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="max-w-[18rem] truncate px-1 font-semibold text-gray-800"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
