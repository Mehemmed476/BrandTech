"use client";

import { useState } from "react";
import { useToast } from "@/shared/components";

/** Uploads a file to /api/upload and returns the public URL (or null). */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        toast(data.error ?? "Yükləmə uğursuz oldu.", "error");
        return null;
      }
      return data.url;
    } catch {
      toast("Yükləmə zamanı xəta baş verdi.", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
