import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actionFail, type ActionResult } from "@/shared/lib/action-result";

export const SESSION_COOKIE = "bt_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const SECRET =
  process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 8
    ? process.env.JWT_SECRET
    : "dev-insecure-brand-technology-secret";

export type SessionUser = {
  id: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
};

type SessionPayload = SessionUser & { exp: number };

function hmac(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

/** Create a signed, expiring session token (payload.signature). */
export function signSession(user: SessionUser): string {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${hmac(encoded)}`;
}

function verifySession(token: string): SessionUser | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = hmac(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString(),
    ) as SessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (payload.role !== "ADMIN" && payload.role !== "CUSTOMER") return null;
    return { id: payload.id, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

/** Read the current session from the cookie (server components/actions). */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Write the session cookie. Only valid inside a Server Action / Route Handler. */
export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Redirect to login when there is no admin session. Use in the admin layout. */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return session;
}

/** Guard for server actions: returns a failure result when not an admin. */
export async function adminGuard(): Promise<ActionResult | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return actionFail("Bu əməliyyat üçün icazəniz yoxdur.");
  }
  return null;
}
