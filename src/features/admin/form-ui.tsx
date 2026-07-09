import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export const inputClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-rose-600">{message}</p>;
}

export function FormField({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label ? (
        <span className="mb-1.5 block text-sm font-semibold text-gray-700">
          {label}
          {required ? <span className="text-rose-500"> *</span> : null}
        </span>
      ) : null}
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      ) : null}
      <FieldError message={error} />
    </label>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <input className={cn(inputClass, className)} {...props} />
    </FormField>
  );
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function TextareaField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <textarea
        className={cn(inputClass, "h-auto py-2.5", className)}
        {...props}
      />
    </FormField>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <select className={cn(inputClass, "pr-8", className)} {...props}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function FormActions({
  loading,
  submitLabel = "Yadda saxla",
  cancelHref,
}: {
  loading?: boolean;
  submitLabel?: string;
  cancelHref: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-5">
      <Link
        href={cancelHref}
        className="inline-flex h-11 items-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        Ləğv et
      </Link>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Gözləyin…" : submitLabel}
      </button>
    </div>
  );
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description ? (
          <p className="text-xs text-gray-400">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
          checked ? "bg-brand-600" : "bg-gray-300",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
