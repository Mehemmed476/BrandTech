import Link from "next/link";
import { KeyRound, Plus, Users } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/components";
import {
  AdminPageHeader,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { DeleteAction } from "@/features/admin/delete-action";
import { deleteAdminUserAction } from "@/features/admin/users/user-actions";
import { getSession } from "@/shared/lib/auth";
import { getAdminUsers } from "@/shared/services/admin-users/admin-user.service";
import { formatDate } from "@/shared/utils/format-date";

export async function AdminUsersPage() {
  const [users, session] = await Promise.all([getAdminUsers(), getSession()]);

  return (
    <div>
      <AdminPageHeader
        title="Admin istifadəçiləri"
        description={`${users.length} admin hesabı`}
        action={
          <ButtonLink href="/admin/users/new">
            <Plus className="h-4 w-4" />
            Yeni admin
          </ButtonLink>
        }
      />

      {users.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="Admin istifadəçisi yoxdur"
          description="İlk admin hesabını yaradın."
        />
      ) : (
        <TableCard title="Bütün adminlər">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50/70">
              <tr>
                <th className={thClass}>İstifadəçi</th>
                <th className={thClass}>Telefon</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Yaradılıb</th>
                <th className={`${thClass} text-right`}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50/60">
                  <td className={tdClass}>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.fullName}{" "}
                        {user.id === session?.id ? (
                          <span className="text-xs text-brand-700">(siz)</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.email || "E-poçt daxil edilməyib"}
                      </p>
                    </div>
                  </td>
                  <td className={tdClass}>{user.phone || "—"}</td>
                  <td className={tdClass}>
                    <StatusPill
                      label={user.isActive ? "Aktiv" : "Deaktiv"}
                      tone={user.isActive ? "green" : "gray"}
                    />
                  </td>
                  <td className={tdClass}>{formatDate(user.createdAt)}</td>
                  <td className={tdClass}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/users/${user.id}/password`}
                        aria-label="Şifrəni dəyiş"
                        title="Şifrəni dəyiş"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-brand-300 hover:text-brand-700"
                      >
                        <KeyRound className="h-4 w-4" />
                      </Link>
                      {user.id !== session?.id ? (
                        <DeleteAction
                          action={deleteAdminUserAction.bind(null, user.id)}
                          title="Admini sil"
                          description={`“${user.fullName}” admin hesabı tam silinsin?`}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
    </div>
  );
}
