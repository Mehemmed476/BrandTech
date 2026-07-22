import { createElement } from "react";
import {
  BatteryCharging,
  Boxes,
  Cable,
  CircuitBoard,
  Component,
  Cpu,
  Database,
  Disc3,
  Fan,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Layers3,
  MemoryStick,
  Monitor,
  MonitorSmartphone,
  Mouse,
  MousePointer2,
  Network,
  Package,
  PcCase,
  Plug,
  Printer,
  Router,
  Server,
  Settings,
  ShoppingBag,
  Smartphone,
  Speaker,
  Tablet,
  Tag,
  Usb,
  Webcam,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const categoryIconOptions: Array<{
  name: string;
  label: string;
  Icon: LucideIcon;
}> = [
  { name: "Component", label: "Komponent", Icon: Component },
  { name: "Cpu", label: "Prosessor", Icon: Cpu },
  { name: "CircuitBoard", label: "Ana plata", Icon: CircuitBoard },
  { name: "MemoryStick", label: "Operativ yaddaş", Icon: MemoryStick },
  { name: "HardDrive", label: "Disk", Icon: HardDrive },
  { name: "Server", label: "Server", Icon: Server },
  { name: "Database", label: "Məlumat bazası", Icon: Database },
  { name: "Disc3", label: "Disk daşıyıcısı", Icon: Disc3 },
  { name: "PcCase", label: "Korpus", Icon: PcCase },
  { name: "Fan", label: "Soyutma", Icon: Fan },
  { name: "Plug", label: "Qida bloku", Icon: Plug },
  { name: "BatteryCharging", label: "Enerji", Icon: BatteryCharging },
  { name: "Monitor", label: "Monitor", Icon: Monitor },
  { name: "Laptop", label: "Noutbuk", Icon: Laptop },
  { name: "MonitorSmartphone", label: "Kompüter", Icon: MonitorSmartphone },
  { name: "Smartphone", label: "Telefon", Icon: Smartphone },
  { name: "Tablet", label: "Planşet", Icon: Tablet },
  { name: "Keyboard", label: "Klaviatura", Icon: Keyboard },
  { name: "Mouse", label: "Siçan", Icon: Mouse },
  { name: "Headphones", label: "Qulaqlıq", Icon: Headphones },
  { name: "Speaker", label: "Səs sistemi", Icon: Speaker },
  { name: "Webcam", label: "Veb-kamera", Icon: Webcam },
  { name: "Gamepad2", label: "Gaming", Icon: Gamepad2 },
  { name: "Network", label: "Şəbəkə", Icon: Network },
  { name: "Router", label: "Router", Icon: Router },
  { name: "Cable", label: "Kabel", Icon: Cable },
  { name: "Usb", label: "USB", Icon: Usb },
  { name: "Printer", label: "Printer", Icon: Printer },
  { name: "Boxes", label: "Məhsullar", Icon: Boxes },
  { name: "Package", label: "Bağlama", Icon: Package },
  { name: "Layers3", label: "Kateqoriyalar", Icon: Layers3 },
  { name: "ShoppingBag", label: "Alış-veriş", Icon: ShoppingBag },
  { name: "Tag", label: "Etiket", Icon: Tag },
  { name: "Settings", label: "Ayarlar", Icon: Settings },
  { name: "Wrench", label: "Təmir", Icon: Wrench },
];

const iconByName = new Map(
  categoryIconOptions.map(({ name, Icon }) => [name, Icon]),
);

const iconBySlug: Record<string, LucideIcon> = {
  components: Component,
  peripherals: Gamepad2,
  computers: Laptop,
  "network-office": Network,
  ssd: HardDrive,
  hdd: Server,
  ram: MemoryStick,
  gpu: Cpu,
  cpu: Cpu,
  motherboard: CircuitBoard,
  "power-supply": Plug,
  cooling: Fan,
  case: PcCase,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headset: Headphones,
  networking: Network,
  printer: Printer,
  laptop: Laptop,
  "desktop-pc": MonitorSmartphone,
  "gaming-accessories": Gamepad2,
};

export function getCategoryIcon(
  slug: string,
  iconName?: string | null,
): LucideIcon {
  return (
    (iconName ? iconByName.get(iconName) : undefined) ??
    iconBySlug[slug] ??
    MousePointer2
  );
}

export function CategoryIcon({
  slug,
  iconName,
  className,
}: {
  slug: string;
  iconName?: string | null;
  className?: string;
}) {
  return createElement(getCategoryIcon(slug, iconName), {
    "aria-hidden": true,
    className,
  });
}
