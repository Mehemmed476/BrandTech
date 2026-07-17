"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/shared/components";
import type { StoreBanner } from "@/shared/types/storefront";
import { cn } from "@/shared/utils/cn";

const SLIDE_INTERVAL = 6500;

export function HeroSlider({ slides }: { slides: StoreBanner[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleSlides = slides.length > 1;
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [activeIndex, hasMultipleSlides, isPaused, slides.length]);

  if (!activeSlide) return null;

  const showButtons =
    activeSlide.showPrimaryButton || activeSlide.showSecondaryButton;

  return (
    <div
      className="group relative min-h-[360px] overflow-hidden rounded-3xl shadow-card lg:min-h-[440px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero bannerləri"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={index !== activeIndex}
        >
          <Image
            alt=""
            src={slide.imageUrl}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-[6500ms] ease-linear",
              index === activeIndex ? "scale-[1.025]" : "scale-100",
            )}
          />
        </div>
      ))}

      <div
        key={activeSlide.id}
        className="relative z-10 flex min-h-[360px] max-w-xl animate-fade-up flex-col justify-center p-8 pb-40 text-white sm:p-10 sm:pb-32 lg:min-h-[440px] lg:p-14 lg:pb-36"
      >
        {activeSlide.showBadge && activeSlide.badgeText ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset ring-white/20 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-leaf-400" />
            {activeSlide.badgeText}
          </span>
        ) : null}

        {activeSlide.showTitle ? (
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
            {activeSlide.title}
          </h1>
        ) : null}

        {activeSlide.showSubtitle && activeSlide.subtitle ? (
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80">
            {activeSlide.subtitle}
          </p>
        ) : null}

      </div>

      {showButtons ? (
        <div className="absolute bottom-6 left-8 right-8 z-20 flex flex-wrap gap-3 sm:bottom-8 sm:left-10 sm:right-auto lg:left-14">
          {activeSlide.showPrimaryButton ? (
            <ButtonLink
              href={activeSlide.linkUrl ?? "/products"}
              size="lg"
            >
              Bütün məhsullar
              <ArrowRight className="h-4.5 w-4.5" />
            </ButtonLink>
          ) : null}
          {activeSlide.showSecondaryButton ? (
            <ButtonLink href="/categories" size="lg" variant="dark">
              Kateqoriyalara bax
            </ButtonLink>
          ) : null}
        </div>
      ) : null}

      {hasMultipleSlides ? (
        <>
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (current) => (current - 1 + slides.length) % slides.length,
              )
            }
            aria-label="Əvvəlki banner"
            className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-950/35 text-white opacity-0 ring-1 ring-inset ring-white/20 backdrop-blur transition hover:bg-gray-950/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((current) => (current + 1) % slides.length)
            }
            aria-label="Növbəti banner"
            className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-950/35 text-white opacity-0 ring-1 ring-inset ring-white/20 backdrop-blur transition hover:bg-gray-950/60 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-gray-950/25 px-3 py-2 backdrop-blur sm:bottom-4 sm:top-auto">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}-ci banneri göstər`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === activeIndex
                    ? "w-7 bg-leaf-400"
                    : "w-2 bg-white/55 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
