import type {
  StoreBanner,
  StoreBrand,
  StoreCategory,
  StoreProduct,
} from "@/shared/types/storefront";

export const categories: StoreCategory[] = [
  {
    id: "cat-ssd",
    name: "SSD",
    slug: "ssd",
    description: "Fast NVMe and SATA storage for every build.",
    imageUrl:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
    productCount: 18,
  },
  {
    id: "cat-hdd",
    name: "HDD",
    slug: "hdd",
    description: "Reliable high-capacity hard drives.",
    imageUrl:
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=900&q=80",
    productCount: 9,
  },
  {
    id: "cat-ram",
    name: "RAM",
    slug: "ram",
    description: "DDR4 and DDR5 memory kits.",
    imageUrl:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80",
    productCount: 22,
  },
  {
    id: "cat-gpu",
    name: "GPU",
    slug: "gpu",
    description: "Graphics cards for gaming and creation.",
    imageUrl:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
    productCount: 14,
  },
  {
    id: "cat-cpu",
    name: "CPU",
    slug: "cpu",
    description: "Intel and AMD desktop processors.",
    imageUrl:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=900&q=80",
    productCount: 16,
  },
  {
    id: "cat-motherboard",
    name: "Motherboard",
    slug: "motherboard",
    description: "AM5, LGA1700, ATX and micro-ATX boards.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    productCount: 12,
  },
  {
    id: "cat-psu",
    name: "PSU",
    slug: "power-supply",
    description: "Efficient power supplies for stable systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=900&q=80",
    productCount: 8,
  },
  {
    id: "cat-monitor",
    name: "Monitor",
    slug: "monitor",
    description: "Office, creator and gaming displays.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    productCount: 20,
  },
  {
    id: "cat-peripherals",
    name: "Peripherals",
    slug: "peripherals",
    description: "Keyboards, mice and headsets.",
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
    productCount: 35,
  },
  {
    id: "cat-networking",
    name: "Networking",
    slug: "networking",
    description: "Routers, adapters and network accessories.",
    imageUrl:
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80",
    productCount: 10,
  },
  {
    id: "cat-laptop",
    name: "Laptop",
    slug: "laptop",
    description: "Portable computers for work and study.",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    productCount: 7,
  },
  {
    id: "cat-desktop-pc",
    name: "Desktop PC",
    slug: "desktop-pc",
    description: "Ready-built office and gaming systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
    productCount: 6,
  },
  {
    id: "cat-gaming",
    name: "Gaming accessories",
    slug: "gaming-accessories",
    description: "Desk gear and accessories for gaming setups.",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    productCount: 24,
  },
];

export const brands: StoreBrand[] = [
  { id: "brand-samsung", name: "Samsung", slug: "samsung" },
  { id: "brand-kingston", name: "Kingston", slug: "kingston" },
  { id: "brand-asus", name: "ASUS", slug: "asus" },
  { id: "brand-intel", name: "Intel", slug: "intel" },
  { id: "brand-amd", name: "AMD", slug: "amd" },
  { id: "brand-msi", name: "MSI", slug: "msi" },
  { id: "brand-corsair", name: "Corsair", slug: "corsair" },
  { id: "brand-logitech", name: "Logitech", slug: "logitech" },
  { id: "brand-aoc", name: "AOC", slug: "aoc" },
  { id: "brand-tplink", name: "TP-Link", slug: "tp-link" },
];

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
);
const brandBySlug = Object.fromEntries(
  brands.map((brand) => [brand.slug, brand]),
);

export const products: StoreProduct[] = [
  {
    id: "prod-samsung-990-evo",
    name: "Samsung 990 EVO SSD 1TB NVMe M.2",
    slug: "samsung-990-evo-1tb-nvme-m2",
    sku: "SSD-SAM-990EVO-1TB",
    brand: brandBySlug.samsung,
    category: categoryBySlug.ssd,
    description:
      "High-speed NVMe storage for gaming PCs, laptops and workstations.",
    price: "169.00",
    oldPrice: "189.00",
    stock: 25,
    status: "ACTIVE",
    isFeatured: true,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1601737487795-dab272f52420?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Capacity", value: "1TB" },
      { key: "Interface", value: "PCIe 4.0 NVMe" },
      { key: "Form Factor", value: "M.2 2280" },
      { key: "Sequential Read", value: "Up to 5,000 MB/s" },
    ],
  },
  {
    id: "prod-kingston-fury",
    name: "Kingston Fury Beast RGB 32GB DDR5 RAM",
    slug: "kingston-fury-beast-rgb-32gb-ddr5",
    sku: "RAM-KIN-FURY-32DDR5",
    brand: brandBySlug.kingston,
    category: categoryBySlug.ram,
    description:
      "Fast DDR5 memory kit with RGB lighting for modern gaming systems.",
    price: "229.00",
    oldPrice: null,
    stock: 18,
    status: "ACTIVE",
    isFeatured: true,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600348712270-5af9e3590f66?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Capacity", value: "32GB (2x16GB)" },
      { key: "Memory Type", value: "DDR5" },
      { key: "Speed", value: "6000MT/s" },
      { key: "Lighting", value: "RGB" },
    ],
  },
  {
    id: "prod-asus-rtx-4070",
    name: "ASUS Dual GeForce RTX 4070 12GB Graphics Card",
    slug: "asus-dual-geforce-rtx-4070-12gb",
    sku: "GPU-ASU-RTX4070-12G",
    brand: brandBySlug.asus,
    category: categoryBySlug.gpu,
    description:
      "Efficient RTX graphics card for high-refresh 1440p gaming and creative work.",
    price: "1199.00",
    oldPrice: "1299.00",
    stock: 7,
    status: "ACTIVE",
    isFeatured: true,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "GPU", value: "NVIDIA GeForce RTX 4070" },
      { key: "Memory", value: "12GB GDDR6X" },
      { key: "Cooling", value: "Dual fan" },
      { key: "Recommended PSU", value: "650W" },
    ],
  },
  {
    id: "prod-intel-i5",
    name: "Intel Core i5-14600K Processor",
    slug: "intel-core-i5-14600k",
    sku: "CPU-INT-I514600K",
    brand: brandBySlug.intel,
    category: categoryBySlug.cpu,
    description:
      "Unlocked Intel desktop processor for gaming and multitasking builds.",
    price: "589.00",
    oldPrice: null,
    stock: 14,
    status: "ACTIVE",
    isFeatured: false,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Cores", value: "14 cores" },
      { key: "Threads", value: "20 threads" },
      { key: "Socket", value: "LGA1700" },
      { key: "Unlocked", value: "Yes" },
    ],
  },
  {
    id: "prod-amd-ryzen",
    name: "AMD Ryzen 5 7600 Processor",
    slug: "amd-ryzen-5-7600",
    sku: "CPU-AMD-R57600",
    brand: brandBySlug.amd,
    category: categoryBySlug.cpu,
    description:
      "Efficient AM5 processor for gaming PCs and everyday performance.",
    price: "399.00",
    oldPrice: "429.00",
    stock: 16,
    status: "ACTIVE",
    isFeatured: false,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Cores", value: "6 cores" },
      { key: "Threads", value: "12 threads" },
      { key: "Socket", value: "AM5" },
      { key: "Included Cooler", value: "Wraith Stealth" },
    ],
  },
  {
    id: "prod-msi-b650",
    name: "MSI PRO B650M-A WiFi Motherboard",
    slug: "msi-pro-b650m-a-wifi",
    sku: "MB-MSI-B650MA-WIFI",
    brand: brandBySlug.msi,
    category: categoryBySlug.motherboard,
    description:
      "AM5 micro-ATX motherboard with Wi-Fi support for Ryzen systems.",
    price: "329.00",
    oldPrice: null,
    stock: 11,
    status: "ACTIVE",
    isFeatured: false,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Socket", value: "AM5" },
      { key: "Chipset", value: "AMD B650" },
      { key: "Form Factor", value: "Micro-ATX" },
      { key: "Networking", value: "Wi-Fi 6E" },
    ],
  },
  {
    id: "prod-corsair-rm750e",
    name: "Corsair RM750e 750W 80+ Gold PSU",
    slug: "corsair-rm750e-750w-80-plus-gold",
    sku: "PSU-COR-RM750E",
    brand: brandBySlug.corsair,
    category: categoryBySlug["power-supply"],
    description:
      "Fully modular 750W power supply for quiet and reliable PC builds.",
    price: "249.00",
    oldPrice: null,
    stock: 20,
    status: "ACTIVE",
    isFeatured: false,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Wattage", value: "750W" },
      { key: "Efficiency", value: "80+ Gold" },
      { key: "Modularity", value: "Fully modular" },
      { key: "Fan Size", value: "120mm" },
    ],
  },
  {
    id: "prod-logitech-g502",
    name: "Logitech G502 X Wired Gaming Mouse",
    slug: "logitech-g502-x-wired-gaming-mouse",
    sku: "MOU-LOG-G502X",
    brand: brandBySlug.logitech,
    category: categoryBySlug.peripherals,
    description:
      "Precise wired gaming mouse with programmable buttons and ergonomic shape.",
    price: "139.00",
    oldPrice: "159.00",
    stock: 32,
    status: "ACTIVE",
    isFeatured: true,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Sensor", value: "HERO 25K" },
      { key: "Connection", value: "Wired USB" },
      { key: "Buttons", value: "13 programmable controls" },
      { key: "Lighting", value: "None" },
    ],
  },
  {
    id: "prod-aoc-monitor",
    name: "AOC 24G2SP 24-inch 165Hz Gaming Monitor",
    slug: "aoc-24g2sp-24-inch-165hz",
    sku: "MON-AOC-24G2SP",
    brand: brandBySlug.aoc,
    category: categoryBySlug.monitor,
    description:
      "Fast 24-inch Full HD gaming monitor with a 165Hz refresh rate.",
    price: "349.00",
    oldPrice: "379.00",
    stock: 9,
    status: "ACTIVE",
    isFeatured: true,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Size", value: "24 inch" },
      { key: "Resolution", value: "1920x1080" },
      { key: "Refresh Rate", value: "165Hz" },
      { key: "Panel", value: "IPS" },
    ],
  },
  {
    id: "prod-tplink-router",
    name: "TP-Link Archer AX55 Wi-Fi 6 Router",
    slug: "tp-link-archer-ax55-wifi-6-router",
    sku: "NET-TPL-AX55",
    brand: brandBySlug["tp-link"],
    category: categoryBySlug.networking,
    description:
      "Dual-band Wi-Fi 6 router for fast home and office networking.",
    price: "199.00",
    oldPrice: null,
    stock: 15,
    status: "ACTIVE",
    isFeatured: false,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1000&q=80",
    ],
    specifications: [
      { key: "Wi-Fi Standard", value: "Wi-Fi 6" },
      { key: "Speed", value: "AX3000" },
      { key: "Bands", value: "Dual-band" },
      { key: "Ports", value: "Gigabit Ethernet" },
    ],
  },
];

export const banners: StoreBanner[] = [
  {
    id: "banner-hero",
    title: "Computer parts for reliable everyday performance",
    subtitle:
      "Original components, clean advice, and practical upgrades for home, office, and gaming systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=80",
    linkUrl: "/products",
    position: "HERO",
  },
  {
    id: "banner-promo",
    title: "Upgrade storage, memory, and graphics in one place",
    subtitle: "Balanced hardware picks from brands customers already trust.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    linkUrl: "/categories",
    position: "PROMO",
  },
];

export const cartPreviewItems = [
  { product: products[0], quantity: 1 },
  { product: products[7], quantity: 2 },
];
