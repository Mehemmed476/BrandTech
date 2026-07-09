/**
 * Run a read query and fall back to a default value if it throws.
 * Used on storefront pages so the site keeps rendering even when the
 * database is unavailable (e.g. during a production build with no DB).
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[safeQuery] database read failed:", error);
    return fallback;
  }
}
