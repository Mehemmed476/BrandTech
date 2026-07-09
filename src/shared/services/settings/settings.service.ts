import { prisma } from "@/shared/lib/prisma";
import { settingsUpdateSchema } from "@/shared/schemas/settings.schema";
import {
  defaultStoreSettings,
  settingKeyMap,
  type StoreSettings,
  type StoreSettingsKey,
} from "@/shared/types/settings";

/** Read all settings rows and merge them onto the typed defaults. */
export async function getStoreSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany();
  const byKey = new Map(rows.map((row) => [row.key, row.value]));

  const result = { ...defaultStoreSettings };
  (Object.keys(settingKeyMap) as StoreSettingsKey[]).forEach((field) => {
    const value = byKey.get(settingKeyMap[field]);
    if (value !== undefined && value !== "") {
      result[field] = value;
    }
  });
  return result;
}

export async function saveStoreSettings(
  input: unknown,
): Promise<StoreSettings> {
  const data = settingsUpdateSchema.parse(input);

  await prisma.$transaction(
    (Object.keys(settingKeyMap) as StoreSettingsKey[]).map((field) => {
      const key = settingKeyMap[field];
      const value = String(data[field] ?? "");
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }),
  );

  return getStoreSettings();
}
