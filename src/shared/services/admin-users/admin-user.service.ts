import { prisma } from "@/shared/lib/prisma";
import {
  adminUserSchema,
  changePasswordSchema,
} from "@/shared/schemas/auth.schema";
import { hashPassword } from "@/shared/services/auth/auth.service";

export class AdminUserOperationError extends Error {}

export function getAdminUsers() {
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export function getAdminUserById(id: string) {
  return prisma.user.findFirst({
    where: { id, role: "ADMIN" },
    select: { id: true, fullName: true, email: true, phone: true },
  });
}

export async function createAdminUser(input: unknown) {
  const data = adminUserSchema.parse(input);
  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
      role: "ADMIN",
      isActive: true,
    },
  });
}

export async function changeAdminPassword(id: string, input: unknown) {
  const data = changePasswordSchema.parse(input);
  const user = await prisma.user.findFirst({ where: { id, role: "ADMIN" } });
  if (!user) {
    throw new AdminUserOperationError("Admin istifadəçisi tapılmadı.");
  }

  return prisma.user.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(data.password),
      sessionVersion: { increment: 1 },
    },
  });
}

export async function deleteAdminUser(id: string, currentUserId: string) {
  if (id === currentUserId) {
    throw new AdminUserOperationError(
      "Hazırda daxil olduğunuz hesabı silə bilməzsiniz.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const target = await tx.user.findFirst({ where: { id, role: "ADMIN" } });
    if (!target) {
      throw new AdminUserOperationError("Admin istifadəçisi tapılmadı.");
    }

    const activeAdminCount = await tx.user.count({
      where: { role: "ADMIN", isActive: true },
    });
    if (target.isActive && activeAdminCount <= 1) {
      throw new AdminUserOperationError(
        "Sistemdə qalan son aktiv admini silmək olmaz.",
      );
    }

    return tx.user.delete({ where: { id } });
  });
}
