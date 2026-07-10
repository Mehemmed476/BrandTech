"use client";

import { useState } from "react";
import { useToast } from "@/shared/components";

async function uploadOne(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) return null;
  return data.url;
}

/** Uploads one or many files to /api/upload and returns the public URL(s). */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const url = await uploadOne(file);
      if (!url) toast("Yükləmə uğursuz oldu.", "error");
      return url;
    } catch {
      toast("Yükləmə zamanı xəta baş verdi.", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMany = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    try {
      const results = await Promise.all(files.map((file) => uploadOne(file)));
      const urls = results.filter((url): url is string => Boolean(url));
      if (urls.length < files.length) {
        toast(`${files.length - urls.length} şəkil yüklənmədi.`, "error");
      }
      if (urls.length > 0) {
        toast(`${urls.length} şəkil yükləndi.`, "success");
      }
      return urls;
    } catch {
      toast("Yükləmə zamanı xəta baş verdi.", "error");
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploadMany, uploading };
}
