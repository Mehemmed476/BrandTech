import { BannerPosition, PrismaClient, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@brandtechnology.az";
const ADMIN_PASSWORD = "admin12345";

/** Build an Unsplash image URL from a photo id. */
function img(id, w = 1000) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

const categories = [
  { name: "SSD", slug: "ssd", sortOrder: 10 },
  { name: "HDD", slug: "hdd", sortOrder: 20 },
  { name: "RAM", slug: "ram", sortOrder: 30 },
  { name: "GPU", slug: "gpu", sortOrder: 40 },
  { name: "CPU", slug: "cpu", sortOrder: 50 },
  { name: "Ana plata", slug: "motherboard", sortOrder: 60 },
  { name: "Qida bloku", slug: "power-supply", sortOrder: 70 },
  { name: "Soyutma", slug: "cooling", sortOrder: 80 },
  { name: "Korpus", slug: "case", sortOrder: 90 },
  { name: "Monitor", slug: "monitor", sortOrder: 100 },
  { name: "Klaviatura", slug: "keyboard", sortOrder: 110 },
  { name: "Siçan", slug: "mouse", sortOrder: 120 },
  { name: "Qulaqlıq", slug: "headset", sortOrder: 130 },
  { name: "Şəbəkə", slug: "networking", sortOrder: 140 },
  { name: "Printer", slug: "printer", sortOrder: 150 },
  { name: "Noutbuk", slug: "laptop", sortOrder: 160 },
  { name: "Masaüstü PK", slug: "desktop-pc", sortOrder: 170 },
  { name: "Gaming aksesuarları", slug: "gaming-accessories", sortOrder: 180 },
];

const brands = [
  { name: "Samsung", slug: "samsung" },
  { name: "Kingston", slug: "kingston" },
  { name: "ASUS", slug: "asus" },
  { name: "Intel", slug: "intel" },
  { name: "AMD", slug: "amd" },
  { name: "MSI", slug: "msi" },
  { name: "Corsair", slug: "corsair" },
  { name: "Logitech", slug: "logitech" },
  { name: "AOC", slug: "aoc" },
  { name: "TP-Link", slug: "tp-link" },
];

const banners = [
  {
    title: "Növbəti gaming PK-nı qur",
    subtitle: "Etibarlı brendlərdən performanslı komponentlər.",
    imageUrl: img("1587202372775-e229f172b9d7", 1400),
    linkUrl: "/products",
    position: BannerPosition.HERO,
    sortOrder: 10,
  },
  {
    title: "Yaddaş yeniləmə endirimləri",
    subtitle: "Hər setap üçün sürətli SSD-lər və etibarlı disklər.",
    imageUrl: img("1597872200969-2b65d56bd16b", 1400),
    linkUrl: "/products?category=ssd",
    position: BannerPosition.CATEGORY,
    sortOrder: 20,
  },
  {
    title: "İş və oyun üçün aksesuarlar",
    subtitle: "Klaviatura, siçan, monitor, router və daha çox.",
    imageUrl: img("1516321318423-f06f85e504b3", 1400),
    linkUrl: "/products?category=gaming-accessories",
    position: BannerPosition.PROMO,
    sortOrder: 30,
  },
];

const settings = [
  { key: "store.name", value: "Brand Technology" },
  { key: "store.phone", value: "+994 00 000 00 00" },
  { key: "store.whatsapp", value: "+994 00 000 00 00" },
  { key: "store.email", value: "info@brandtechnology.az" },
  { key: "store.address", value: "Bakı, Azərbaycan" },
  { key: "store.workingHours", value: "B.e–Şənbə · 10:00–19:00" },
  { key: "store.deliveryText", value: "Bakı üzrə sürətli çatdırılma" },
  { key: "store.warrantyText", value: "Rəsmi zəmanət dəstəyi" },
  { key: "social.instagram", value: "#" },
  { key: "social.facebook", value: "#" },
  { key: "social.youtube", value: "#" },
  { key: "delivery.defaultPrice", value: "10.00" },
  { key: "delivery.freeThreshold", value: "150.00" },
];

const products = [
  {
    name: "Samsung 990 EVO SSD 1TB NVMe M.2",
    slug: "samsung-990-evo-1tb-nvme-m2",
    sku: "SSD-SAM-990EVO-1TB",
    description:
      "Gaming PK-lar, noutbuklar və iş stansiyaları üçün yüksək sürətli NVMe yaddaş.",
    price: "169.00",
    oldPrice: "189.00",
    stock: 25,
    isFeatured: true,
    isNew: true,
    categorySlug: "ssd",
    brandSlug: "samsung",
    images: [
      img("1597872200969-2b65d56bd16b"),
      img("1601737487795-dab272f52420"),
    ],
    specifications: [
      ["Tutum", "1TB"],
      ["İnterfeys", "PCIe 4.0 NVMe"],
      ["Form faktor", "M.2 2280"],
      ["Ardıcıl oxuma", "5,000 MB/s-ə qədər"],
    ],
  },
  {
    name: "Kingston Fury Beast RGB 32GB DDR5 RAM",
    slug: "kingston-fury-beast-rgb-32gb-ddr5",
    sku: "RAM-KIN-FURY-32DDR5",
    description:
      "Müasir gaming sistemləri üçün RGB işıqlandırmalı sürətli DDR5 yaddaş dəsti.",
    price: "229.00",
    oldPrice: null,
    stock: 18,
    isFeatured: true,
    isNew: false,
    categorySlug: "ram",
    brandSlug: "kingston",
    images: [img("1562976540-1502c2145186"), img("1600348712270-5af9e3590f66")],
    specifications: [
      ["Tutum", "32GB (2x16GB)"],
      ["Yaddaş tipi", "DDR5"],
      ["Sürət", "6000MT/s"],
      ["İşıqlandırma", "RGB"],
    ],
  },
  {
    name: "ASUS Dual GeForce RTX 4070 12GB",
    slug: "asus-dual-geforce-rtx-4070-12gb",
    sku: "GPU-ASU-RTX4070-12G",
    description:
      "Yüksək təzələnmə 1440p oyunları və yaradıcı işlər üçün effektiv RTX videokart.",
    price: "1199.00",
    oldPrice: "1299.00",
    stock: 7,
    isFeatured: true,
    isNew: true,
    categorySlug: "gpu",
    brandSlug: "asus",
    images: [
      img("1591488320449-011701bb6704"),
      img("1587202372616-b43abea06c2a"),
    ],
    specifications: [
      ["GPU", "NVIDIA GeForce RTX 4070"],
      ["Yaddaş", "12GB GDDR6X"],
      ["Soyutma", "İkili fan"],
      ["Tövsiyə olunan QB", "650W"],
    ],
  },
  {
    name: "Intel Core i5-14600K Prosessor",
    slug: "intel-core-i5-14600k",
    sku: "CPU-INT-I514600K",
    description:
      "Oyun və çoxtapşırıqlı yığımlar üçün kilidi açıq Intel masaüstü prosessoru.",
    price: "589.00",
    oldPrice: null,
    stock: 14,
    isFeatured: false,
    isNew: true,
    categorySlug: "cpu",
    brandSlug: "intel",
    images: [img("1555617981-dac3880eac6e")],
    specifications: [
      ["Nüvələr", "14 nüvə"],
      ["Threadlər", "20 thread"],
      ["Soket", "LGA1700"],
      ["Kilidi açıq", "Bəli"],
    ],
  },
  {
    name: "AMD Ryzen 5 7600 Prosessor",
    slug: "amd-ryzen-5-7600",
    sku: "CPU-AMD-R57600",
    description:
      "Gaming PK-lar və gündəlik performans üçün effektiv AM5 prosessoru.",
    price: "399.00",
    oldPrice: "429.00",
    stock: 16,
    isFeatured: false,
    isNew: false,
    categorySlug: "cpu",
    brandSlug: "amd",
    images: [img("1618410320928-25228d811631")],
    specifications: [
      ["Nüvələr", "6 nüvə"],
      ["Threadlər", "12 thread"],
      ["Soket", "AM5"],
      ["Kuler", "Wraith Stealth"],
    ],
  },
  {
    name: "MSI PRO B650M-A WiFi Ana plata",
    slug: "msi-pro-b650m-a-wifi",
    sku: "MB-MSI-B650MA-WIFI",
    description:
      "Ryzen sistemləri üçün Wi-Fi dəstəkli AM5 micro-ATX ana plata.",
    price: "329.00",
    oldPrice: null,
    stock: 11,
    isFeatured: false,
    isNew: false,
    categorySlug: "motherboard",
    brandSlug: "msi",
    images: [img("1518770660439-4636190af475"), img("1562408590-e32931084e23")],
    specifications: [
      ["Soket", "AM5"],
      ["Çipset", "AMD B650"],
      ["Form faktor", "Micro-ATX"],
      ["Şəbəkə", "Wi-Fi 6E"],
    ],
  },
  {
    name: "Corsair RM750e 750W 80+ Gold QB",
    slug: "corsair-rm750e-750w-80-plus-gold",
    sku: "PSU-COR-RM750E",
    description:
      "Səssiz və etibarlı PK yığımları üçün tam modul 750W qida bloku.",
    price: "249.00",
    oldPrice: null,
    stock: 20,
    isFeatured: false,
    isNew: false,
    categorySlug: "power-supply",
    brandSlug: "corsair",
    images: [img("1624705002806-5d72df19c3ad")],
    specifications: [
      ["Güc", "750W"],
      ["Effektivlik", "80+ Gold"],
      ["Modulluq", "Tam modul"],
      ["Fan ölçüsü", "120mm"],
    ],
  },
  {
    name: "Logitech G502 X Simli Gaming Siçan",
    slug: "logitech-g502-x-wired-gaming-mouse",
    sku: "MOU-LOG-G502X",
    description:
      "Proqramlaşdırıla bilən düymələri və erqonomik forması olan dəqiq simli gaming siçan.",
    price: "139.00",
    oldPrice: "159.00",
    stock: 32,
    isFeatured: true,
    isNew: false,
    categorySlug: "mouse",
    brandSlug: "logitech",
    images: [
      img("1615663245857-ac93bb7c39e7"),
      img("1527814050087-3793815479db"),
    ],
    specifications: [
      ["Sensor", "HERO 25K"],
      ["Bağlantı", "Simli USB"],
      ["Düymələr", "13 proqramlaşdırıla bilən"],
      ["İşıqlandırma", "Yoxdur"],
    ],
  },
  {
    name: "AOC 24G2SP 24-inç 165Hz Gaming Monitor",
    slug: "aoc-24g2sp-24-inch-165hz",
    sku: "MON-AOC-24G2SP",
    description:
      "165Hz təzələnmə sürəti olan sürətli 24-inç Full HD gaming monitor.",
    price: "349.00",
    oldPrice: "379.00",
    stock: 9,
    isFeatured: true,
    isNew: false,
    categorySlug: "monitor",
    brandSlug: "aoc",
    images: [
      img("1527443224154-c4a3942d3acf"),
      img("1616588589676-62b3bd4ff6d2"),
    ],
    specifications: [
      ["Ölçü", "24 inç"],
      ["Ayırdetmə", "1920x1080"],
      ["Təzələnmə", "165Hz"],
      ["Panel", "IPS"],
    ],
  },
  {
    name: "TP-Link Archer AX55 Wi-Fi 6 Router",
    slug: "tp-link-archer-ax55-wifi-6-router",
    sku: "NET-TPL-AX55",
    description:
      "Sürətli ev və ofis şəbəkəsi üçün ikidiapazonlu Wi-Fi 6 router.",
    price: "199.00",
    oldPrice: null,
    stock: 15,
    isFeatured: false,
    isNew: true,
    categorySlug: "networking",
    brandSlug: "tp-link",
    images: [img("1606904825846-647eb07f5be2")],
    specifications: [
      ["Wi-Fi standartı", "Wi-Fi 6"],
      ["Sürət", "AX3000"],
      ["Diapazonlar", "İkidiapazonlu"],
      ["Portlar", "Gigabit Ethernet"],
    ],
  },
];

async function seedCategories() {
  const result = {};
  for (const category of categories) {
    result[category.slug] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  return result;
}

async function seedBrands() {
  const result = {};
  for (const brand of brands) {
    result[brand.slug] = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }
  return result;
}

async function seedBanners() {
  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: banners.map((banner) => ({ ...banner, isActive: true })),
  });
}

async function seedSettings() {
  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
}

async function seedProducts(categoryBySlug, brandBySlug) {
  for (const product of products) {
    const category = categoryBySlug[product.categorySlug];
    const brand = brandBySlug[product.brandSlug];

    const data = {
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      stock: product.stock,
      status: ProductStatus.ACTIVE,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      categoryId: category.id,
      brandId: brand.id,
    };

    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { ...data, slug: product.slug },
    });

    await prisma.productImage.deleteMany({
      where: { productId: savedProduct.id },
    });
    await prisma.productSpecification.deleteMany({
      where: { productId: savedProduct.id },
    });

    await prisma.productImage.createMany({
      data: product.images.map((imageUrl, index) => ({
        productId: savedProduct.id,
        imageUrl,
        altText: product.name,
        sortOrder: index,
        isMain: index === 0,
      })),
    });

    await prisma.productSpecification.createMany({
      data: product.specifications.map(([key, value], index) => ({
        productId: savedProduct.id,
        key,
        value,
        sortOrder: index,
      })),
    });
  }
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "ADMIN", isActive: true },
    create: {
      fullName: "Admin",
      email: ADMIN_EMAIL,
      phone: "+994500000000",
      role: "ADMIN",
      isActive: true,
      passwordHash,
    },
  });
}

async function main() {
  const categoryBySlug = await seedCategories();
  const brandBySlug = await seedBrands();
  await seedBanners();
  await seedSettings();
  await seedProducts(categoryBySlug, brandBySlug);
  await seedAdmin();

  console.log("\nAdmin girişi:");
  console.log(`  E-poçt: ${ADMIN_EMAIL}`);
  console.log(`  Şifrə:  ${ADMIN_PASSWORD}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
