import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { AdminPasswordForm } from "@/features/admin/users/password-form";
import { getSession } from "@/shared/lib/auth";
import { getAdminUserById } from "@/shared/services/admin-users/admin-user.service";

export const metadata: Metadata = { title: "Şifrəni dəyiş" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, session] = await Promise.all([
    getAdminUserById(id),
    getSession(),
  ]);
  if (!user) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Şifrəni dəyiş"
        description={`${user.fullName} hesabı üçün yeni şifrə təyin edin.`}
      />
      <AdminPasswordForm userId={user.id} isSelf={user.id === session?.id} />
    </div>
  );
}
