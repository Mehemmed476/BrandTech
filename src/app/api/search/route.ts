import { NextResponse } from "next/server";
import { safeQuery } from "@/shared/lib/safe-query";
import { searchProducts } from "@/shared/services/products/product.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await safeQuery(() => searchProducts(q, 6), []);
  return NextResponse.json({ results });
}
