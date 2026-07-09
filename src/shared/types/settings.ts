export type StoreSettings = {
  storeName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  deliveryText: string;
  warrantyText: string;
  instagram: string;
  facebook: string;
  youtube: string;
};

export type StoreSettingsKey = keyof StoreSettings;

/** Maps typed settings fields to their `Setting.key` in the database. */
export const settingKeyMap: Record<StoreSettingsKey, string> = {
  storeName: "store.name",
  phone: "store.phone",
  whatsapp: "store.whatsapp",
  email: "store.email",
  address: "store.address",
  workingHours: "store.workingHours",
  deliveryText: "store.deliveryText",
  warrantyText: "store.warrantyText",
  instagram: "social.instagram",
  facebook: "social.facebook",
  youtube: "social.youtube",
};

export const defaultStoreSettings: StoreSettings = {
  storeName: "Brand Technology",
  phone: "+994 00 000 00 00",
  whatsapp: "+994 00 000 00 00",
  email: "info@brandtechnology.az",
  address: "Bakı, Azərbaycan",
  workingHours: "B.e–Şənbə · 10:00–19:00",
  deliveryText: "Bakı üzrə sürətli çatdırılma",
  warrantyText: "Rəsmi zəmanət",
  instagram: "#",
  facebook: "#",
  youtube: "#",
};
