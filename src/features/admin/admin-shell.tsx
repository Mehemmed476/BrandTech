"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell,
  ClipboardList,
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  Store,
  Tag,
  type LucideIcon,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { logoutAction } from "@/features/auth/auth-actions";
import type { SessionUser } from "@/shared/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: "pending";
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Ümumi",
    items: [
      {
        href: "/admin",
        label: "İdarə paneli",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Kataloq",
    items: [
      { href: "/admin/products", label: "Məhsullar", icon: Package },
      { href: "/admin/categories", label: "Kateqoriyalar", icon: FolderTree },
      { href: "/admin/brands", label: "Brendlər", icon: Tag },
    ],
  },
  {
    label: "Satış",
    items: [
      {
        href: "/admin/orders",
        label: "Sifarişlər",
        icon: ClipboardList,
        badgeKey: "pending",
      },
    ],
  },
  {
    label: "Sayt",
    items: [
      { href: "/admin/banners", label: "Bannerlər", icon: ImageIcon },
      { href: "/admin/settings", label: "Parametrlər", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SidebarContent({
  user,
  pendingOrders,
  onNavigate,
}: {
  user: SessionUser;
  pendingOrders: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 font-black text-white shadow-[0_6px_16px_-6px_rgba(46,125,50,0.8)]">
          BT
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-leaf-400 ring-2 ring-[#173a1e]" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-white">Brand Technology</p>
          <p className="text-[11px] text-white/45">Admin panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="scrollbar-slim flex-1 space-y-1 overflow-y-auto px-3 pb-4"
        aria-label="Admin navigation"
      >
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href, item.exact);
              const badge =
                item.badgeKey === "pending" && pendingOrders > 0
                  ? pendingOrders
                  : null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {active ? (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-leaf-400" />
                  ) : null}
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition",
                      active
                        ? "bg-brand-500 text-white shadow-sm"
                        : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {badge ? (
                    <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-gray-900">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="space-y-2 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ring-1 ring-inset ring-white/10">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-black text-white">
            {initialsOf(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="text-[11px] text-white/45">Administrator</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Çıxış"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white/70 ring-1 ring-inset ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <Store className="h-4.5 w-4.5" />
          Mağazaya bax
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  user,
  pendingOrders = 0,
}: {
  children: ReactNode;
  user: SessionUser;
  pendingOrders?: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="mesh-dark sticky top-0 hidden h-screen lg:block">
        <SidebarContent user={user} pendingOrders={pendingOrders} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="mesh-dark fixed inset-y-0 left-0 z-50 w-72 shadow-pop">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Menyunu bağla"
              className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              user={user}
              pendingOrders={pendingOrders}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-gray-100 glass">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Menyunu aç"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Məhsul, sifariş axtar…"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Bildirişlər"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:text-brand-700"
              >
                <Bell className="h-5 w-5" />
                {pendingOrders > 0 ? (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
                ) : null}
              </button>
              <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white py-1.5 pl-1.5 pr-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-black text-white">
                  {initialsOf(user.name)}
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-bold text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
