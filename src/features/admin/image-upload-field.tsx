"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { FormField, inputClass } from "@/features/admin/form-ui";
import { useImageUpload } from "@/features/admin/use-image-upload";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

/** Compact upload button that reports the uploaded URL to its parent. */
export function UploadButton({
  onUploaded,
  label = "Yüklə",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useImageUpload();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const url = await upload(file);
    if (url) onUploaded(url);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}
        {uploading ? "Yüklənir…" : label}
      </button>
    </>
  );
}

/** Full single-image field: preview + upload button + manual URL input. */
export function ImageUploadField({
  label,
  value,
  onChange,
  error,
  required,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      <div className="flex items-start gap-3">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="h-6 w-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <UploadButton onUploaded={onChange} label="Şəkil yüklə" />
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </button>
            ) : null}
          </div>
          <input
            className={inputClass}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="və ya URL yapışdırın (https://...)"
          />
        </div>
      </div>
    </FormField>
  );
}
