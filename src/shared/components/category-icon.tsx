import { createElement } from "react";
import {
  Cpu,
  Gamepad2,
  HardDrive,
  Keyboard,
  Laptop,
  MemoryStick,
  Monitor,
  MonitorSmartphone,
  MousePointer2,
  Network,
  PcCase,
  Plug,
  Server,
  type LucideIcon,
} from "lucide-react";

const iconBySlug: Record<string, LucideIcon> = {
  ssd: HardDrive,
  hdd: Server,
  ram: MemoryStick,
  gpu: Cpu,
  cpu: Cpu,
  motherboard: PcCase,
  "power-supply": Plug,
  monitor: Monitor,
  peripherals: Keyboard,
  networking: Network,
  laptop: Laptop,
  "desktop-pc": MonitorSmartphone,
  "gaming-accessories": Gamepad2,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return iconBySlug[slug] ?? MousePointer2;
}

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return createElement(getCategoryIcon(slug), {
    "aria-hidden": true,
    className,
  });
}
