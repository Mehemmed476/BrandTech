"use client";

import { useEffect, useRef, type ClipboardEvent, type MouseEvent } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { sanitizeInlineHtml } from "@/shared/utils/inline-rich-text";
import { normalizePastedInlineHtml } from "@/features/admin/products/specification-paste";

export function InlineRichTextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    const safeValue = sanitizeInlineHtml(value);
    if (editor.innerHTML !== safeValue) editor.innerHTML = safeValue;
  }, [value]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(sanitizeInlineHtml(editor.innerHTML));
  };

  const applyFormat = (
    event: MouseEvent<HTMLButtonElement>,
    command: "bold" | "italic" | "underline",
  ) => {
    event.preventDefault();
    editorRef.current?.focus();
    document.execCommand(command);
    emitChange();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const content = html
      ? normalizePastedInlineHtml(html)
      : sanitizeInlineHtml(text.replace(/\r?\n/g, "<br>"));
    document.execCommand("insertHTML", false, content);
    emitChange();
  };

  const toolbarButton =
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-brand-700";

  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10">
      <div className="flex items-center gap-0.5 border-b border-gray-200 px-2 py-1">
        <button
          type="button"
          className={toolbarButton}
          aria-label="Qalın"
          title="Qalın"
          onMouseDown={(event) => applyFormat(event, "bold")}
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={toolbarButton}
          aria-label="Kursiv"
          title="Kursiv"
          onMouseDown={(event) => applyFormat(event, "italic")}
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={toolbarButton}
          aria-label="Altıxətli"
          title="Altıxətli"
          onMouseDown={(event) => applyFormat(event, "underline")}
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-label={placeholder}
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={handlePaste}
        className={cn(
          "min-h-11 px-3.5 py-2.5 text-sm text-gray-800 outline-none",
          "[&:empty:before]:pointer-events-none [&:empty:before]:text-gray-400 [&:empty:before]:content-[attr(data-placeholder)]",
          "[&_strong]:font-bold [&_em]:italic [&_u]:underline",
        )}
      />
    </div>
  );
}
