const ALLOWED_TAGS = new Set([
  "strong",
  "b",
  "em",
  "i",
  "u",
  "br",
  "sub",
  "sup",
]);

const TAG_ALIASES: Record<string, string> = {
  b: "strong",
  i: "em",
};

export function sanitizeInlineHtml(value: string): string {
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, rawName: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (name === "br") return "<br>";
      const normalized = TAG_ALIASES[name] ?? name;
      return tag.startsWith("</") ? `</${normalized}>` : `<${normalized}>`;
    })
    .replace(/(?:<br>\s*){3,}/gi, "<br><br>")
    .replace(/^(?:\s|<br>)+|(?:\s|<br>)+$/gi, "")
    .trim();
}

export function stripInlineHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
