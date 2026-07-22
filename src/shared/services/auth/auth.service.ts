import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import type { SessionUser } from "@/shared/lib/auth";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify admin credentials by email or phone.
 * Returns a minimal session user on success, otherwise null.
 */
export async function authenticateAdmin(
  identifier: string,
  password: string,
): Promise<SessionUser | null> {
  const value = identifier.trim();
  const user = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
      isActive: true,
      OR: [{ email: value }, { phone: value }],
    },
  });

  if (!user || !user.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    name: user.fullName,
    role: user.role,
    sessionVersion: user.sessionVersion,
  };
}
