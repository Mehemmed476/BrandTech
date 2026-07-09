import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-soft">
      <div className="mesh-brand pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70" />
      <div className="relative">
        {icon ? (
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
            {icon}
          </div>
        ) : null}
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-6 flex justify-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
