import { FolderTree, Plus } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/components";
import { CategoryIcon } from "@/shared/components/category-icon";
import {
  AdminPageHeader,
  EditLink,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { DeleteAction } from "@/features/admin/delete-action";
import { deleteCategoryAction } from "@/features/admin/categories/category-actions";
import { getAdminCategories } from "@/shared/services/categories/category.service";

export async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <AdminPageHeader
        title="Kateqoriyalar"
        description={`${categories.length} kateqoriya`}
        action={
          <ButtonLink href="/admin/categories/new">
            <Plus className="h-4 w-4" />
            Kateqoriya əlavə et
          </ButtonLink>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="h-8 w-8" />}
          title="Hələ kateqoriya yoxdur"
          description="İlk kateqoriyanı əlavə edin."
          action={
            <ButtonLink href="/admin/categories/new">
              Kateqoriya əlavə et
            </ButtonLink>
          }
        />
      ) : (
        <TableCard title="Bütün kateqoriyalar">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50/70">
              <tr>
                <th className={thClass}>Ad</th>
                <th className={thClass}>Slug</th>
                <th className={thClass}>Ana kateqoriya</th>
                <th className={thClass}>Məhsullar</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="transition hover:bg-gray-50/60"
                >
                  <td className={`${tdClass} font-semibold text-gray-900`}>
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <CategoryIcon
                          slug={category.slug}
                          iconName={category.iconName}
                          className="h-4 w-4"
                        />
                      </span>
                      {category.name}
                    </span>
                  </td>
                  <td className={tdClass}>
                    <code className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {category.slug}
                    </code>
                  </td>
                  <td className={tdClass}>{category.parentName ?? "—"}</td>
                  <td className={tdClass}>{category.productCount}</td>
                  <td className={tdClass}>
                    <StatusPill
                      label={category.isActive ? "Aktiv" : "Deaktiv"}
                      tone={category.isActive ? "green" : "gray"}
                    />
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center justify-end gap-1.5">
                      <EditLink
                        href={`/admin/categories/${category.id}/edit`}
                      />
                      <DeleteAction
                        action={deleteCategoryAction.bind(null, category.id)}
                        title="Kateqoriyanı sil"
                        description={`"${category.name}" kateqoriyasını silmək istədiyinizə əminsiniz? Məhsulları olan kateqoriya silinə bilməz.`}
                      />
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
