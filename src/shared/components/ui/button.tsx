import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "light" | "dark";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-card active:bg-brand-800",
  secondary:
    "bg-gray-900 text-white shadow-soft hover:bg-gray-800 active:bg-black",
  outline:
    "border border-gray-200 bg-white text-gray-800 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
  ghost: "text-gray-700 hover:bg-brand-50 hover:text-brand-700",
  light: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  dark: "glass-dark text-white hover:bg-brand-800/80 border border-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-6 text-[15px]",
  icon: "h-11 w-11",
  "icon-sm": "h-9 w-9",
};

const baseClass =
  "group/btn inline-flex select-none items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClass, variants[variant], sizes[size], className)}
      type={type}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseClass, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
