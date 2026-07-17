import {
  sanitizeInlineHtml,
  stripInlineHtml,
} from "@/shared/utils/inline-rich-text";

export type ImportedSpecification = { key: string; value: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeWordNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent ?? "");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  if (tag === "br") return "<br>";

  let content = Array.from(element.childNodes).map(serializeWordNode).join("");
  const fontWeight = element.style.fontWeight.toLowerCase();
  const isBold =
    tag === "b" ||
    tag === "strong" ||
    fontWeight === "bold" ||
    /^[6-9]00$/.test(fontWeight);
  const isItalic =
    tag === "i" ||
    tag === "em" ||
    element.style.fontStyle.toLowerCase() === "italic";
  const isUnderline =
    tag === "u" ||
    element.style.textDecoration.toLowerCase().includes("underline") ||
    element.style.textDecorationLine.toLowerCase().includes("underline");
  const isSup = tag === "sup" || element.style.verticalAlign === "super";
  const isSub = tag === "sub" || element.style.verticalAlign === "sub";

  if (isBold) content = `<strong>${content}</strong>`;
  if (isItalic) content = `<em>${content}</em>`;
  if (isUnderline) content = `<u>${content}</u>`;
  if (isSup) content = `<sup>${content}</sup>`;
  if (isSub) content = `<sub>${content}</sub>`;

  if (["div", "p", "li"].includes(tag)) content += "<br>";
  return content;
}

export function normalizePastedInlineHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  const serialized = Array.from(document.body.childNodes)
    .map(serializeWordNode)
    .join("");
  return sanitizeInlineHtml(serialized);
}

function isHeaderRow(row: ImportedSpecification) {
  const key = stripInlineHtml(row.key).toLocaleLowerCase("az");
  const value = stripInlineHtml(row.value).toLocaleLowerCase("az");
  return (
    ["xüsusiyyət", "xüsusiyyətlər", "feature", "property"].includes(key) &&
    ["dəyər", "value"].includes(value)
  );
}

function cleanRows(rows: ImportedSpecification[]) {
  const cleaned = rows.filter(
    (row) => row.key.trim() && stripInlineHtml(row.value).trim(),
  );
  return cleaned.length > 0 && isHeaderRow(cleaned[0])
    ? cleaned.slice(1)
    : cleaned;
}

function parseHtmlTable(html: string): ImportedSpecification[] {
  const document = new DOMParser().parseFromString(html, "text/html");
  const rows = Array.from(document.querySelectorAll("tr")).flatMap((row) => {
    const cells = Array.from(row.querySelectorAll(":scope > th, :scope > td"));
    if (cells.length < 2) return [];
    return [
      {
        key: (cells[0].textContent ?? "").replace(/\s+/g, " ").trim(),
        value: normalizePastedInlineHtml(
          cells
            .slice(1)
            .map((cell) => cell.innerHTML)
            .join(" "),
        ),
      },
    ];
  });
  return cleanRows(rows);
}

function parsePlainText(text: string): ImportedSpecification[] {
  const rows = text.split(/\r?\n/).flatMap((line) => {
    const trimmed = line
      .replace(/^\s*(?:(?:[•·◦▪‣●○■‒–—-\uF0B7])|(?:\d+[.)]))[\t ]+/u, "")
      .trim();
    if (!trimmed) return [];

    const tabParts = trimmed.split(/\t+/);
    if (tabParts.length >= 2) {
      return [
        {
          key: tabParts[0].trim(),
          value: escapeHtml(tabParts.slice(1).join(" ").trim()),
        },
      ];
    }

    const separator = trimmed.match(/:\s+|\s+[–—-]\s+/);
    if (!separator?.index) {
      return [
        {
          key: trimmed,
          value: "Bəli",
        },
      ];
    }
    return [
      {
        key: trimmed.slice(0, separator.index).trim(),
        value: escapeHtml(
          trimmed.slice(separator.index + separator[0].length).trim(),
        ),
      },
    ];
  });
  return cleanRows(rows);
}

export function parseSpecificationsClipboard(
  html: string,
  text: string,
): ImportedSpecification[] {
  const tableRows = html ? parseHtmlTable(html) : [];
  return tableRows.length > 0 ? tableRows : parsePlainText(text);
}
