import Link from "next/link";
import {
  Clock,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { StoreCategory } from "@/shared/types/storefront";
import type { StoreSettings } from "@/shared/types/settings";

const shopLinks = [
  { href: "/products", label: "Bütün məhsullar" },
  { href: "/categories", label: "Kateqoriyalar" },
  { href: "/cart", label: "Səbət" },
  { href: "/checkout", label: "Sifarişi tamamla" },
];

export function SiteFooter({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: StoreCategory[];
}) {
  const trust = [
    { icon: ShieldCheck, title: settings.warrantyText, note: "Hər komponentə" },
    { icon: Truck, title: settings.deliveryText, note: "Bakı və bölgələr" },
    {
      icon: Headphones,
      title: "Ekspert dəstəyi",
      note: "Alışdan əvvəl məsləhət",
    },
    { icon: MessageCircle, title: "WhatsApp dəstək", note: "Sürətli sifariş" },
  ];

  return (
    <footer className="mesh-dark mt-16 text-white">
      <div className="border-b border-white/10">
        <div className="container-page grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => {
            const Icon = item.icon;
            return (
              <div className="flex items-center gap-3" key={item.title}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-leaf-400 ring-1 ring-inset ring-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-white/60">{item.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-10 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Ən yaxşı endirimlərdən ilk xəbər tut
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/70">
              SSD, GPU və hazır yığımlarda qiymət düşümləri üçün abunə olun.
              Spam yox — yalnız faydalı yeniləmələr.
            </p>
          </div>
          <form className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-2 ring-1 ring-inset ring-white/15 focus-within:ring-leaf-400/60">
              <span className="pl-2 text-white/60">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="siz@email.com"
                className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-400"
              >
                <Send className="h-4 w-4" />
                Abunə ol
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-black text-white">
              BT
            </span>
            <div>
              <p className="text-[15px] font-extrabold">{settings.storeName}</p>
              <p className="text-xs text-white/60">
                Kompüter hissələri və aksesuarları
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Yeniləmələr, ofis sistemləri və gaming yığımları üçün orijinal
            komponentlər — rəsmi zəmanət dəstəyi ilə.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Globe, href: settings.instagram || "#" },
              { Icon: MessageCircle, href: settings.facebook || "#" },
              { Icon: Send, href: settings.youtube || "#" },
            ].map(({ Icon, href }, index) => (
              <Link
                key={index}
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 ring-1 ring-inset ring-white/10 transition hover:bg-brand-500 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">Sosial şəbəkə</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
            Mağaza
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-white/70 transition hover:text-leaf-400"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
            Kateqoriyalar
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  className="text-white/70 transition hover:text-leaf-400"
                  href={`/products?category=${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
            Əlaqə
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-leaf-400" />
              {settings.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="h-4 w-4 text-leaf-400" />
              WhatsApp: {settings.whatsapp}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-leaf-400" />
              {settings.email}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" />
              {settings.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-leaf-400" />
              {settings.workingHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© 2026 {settings.storeName}. Bütün hüquqlar qorunur.</p>
          <p>Gündəlik etibarlı performans üçün.</p>
        </div>
      </div>
    </footer>
  );
}
