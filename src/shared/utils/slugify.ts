const charMap: Record<string, string> = {
  ə: "e",
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ə: "e",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

/** Build a URL-friendly slug, transliterating Azerbaijani characters. */
export function slugify(value: string): string {
  return value
    .trim()
    .replace(/[əçğıöşüƏÇĞİÖŞÜ]/g, (char) => charMap[char] ?? char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
