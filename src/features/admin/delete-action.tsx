"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useToast } from "@/shared/components/toast";
import type { ActionResult } from "@/shared/lib/action-result";

/**
 * Trash button + confirmation dialog used across admin tables.
 * `action` is a server action already bound to the record id.
 */
export function DeleteAction({
  action,
  title,
  description = "Bu əməliyyat geri qaytarıla bilməz.",
  redirectTo,
}: {
  action: () => Promise<ActionResult>;
  title: string;
  description?: string;
  redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await action();
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) {
        setOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      }
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Sil"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        confirmLabel="Sil"
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
