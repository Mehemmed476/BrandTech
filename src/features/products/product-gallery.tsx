"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [""];

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-brand-50 via-white to-brand-50/40 p-8 shadow-soft">
        {gallery[active] ? (
          <Image
            alt={name}
            src={gallery[active]}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-contain drop-shadow-sm"
          />
        ) : null}
      </div>
      {gallery.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "relative aspect-square w-20 overflow-hidden rounded-2xl border bg-white p-2 transition",
                index === active
                  ? "border-brand-500 ring-2 ring-brand-500/30"
                  : "border-gray-200 hover:border-brand-300",
              )}
            >
              <Image
                alt=""
                src={image}
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
