import Image from "next/image";
import { Plus, Tag } from "lucide-react";
import { ButtonLink, EmptyState } from "@/shared/components";
import {
  AdminPageHeader,
  EditLink,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { DeleteAction } from "@/features/admin/delete-action";
import { deleteBrandAction } from "@/features/admin/brands/brand-actions";
import { getAdminBrands } from "@/shared/services/brands/brand.service";

export async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div>
      <AdminPageHeader
        title="Brendlər"
        description={`${brands.length} brend`}
        action={
          <ButtonLink href="/admin/brands/new">
            <Plus className="h-4 w-4" />
            Brend əlavə et
          </ButtonLink>
        }
      />

      {brands.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-8 w-8" />}
          title="Hələ brend yoxdur"
          description="İlk brendinizi əlavə edin."
          action={
            <ButtonLink href="/admin/brands/new">Brend əlavə et</ButtonLink>
          }
        />
      ) : (
        <TableCard title="Bütün brendlər">
          <table className="w-full min-w-[560px]">
            <thead className="bg-gray-50/70">
              <tr>
                <th className={thClass}>Brend</th>
                <th className={thClass}>Slug</th>
                <th className={thClass}>Məhsullar</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((brand) => (
                <tr key={brand.id} className="transition hover:bg-gray-50/60">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white">
                        {brand.logoUrl ? (
                          <Image
                            alt=""
                            src={brand.logoUrl}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-xs font-black text-gray-400">
                            {brand.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className={tdClass}>
                    <code className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {brand.slug}
                    </code>
                  </td>
                  <td className={tdClass}>{brand.productCount}</td>
                  <td className={tdClass}>
                    <StatusPill
                      label={brand.isActive ? "Aktiv" : "Deaktiv"}
                      tone={brand.isActive ? "green" : "gray"}
                    />
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center justify-end gap-1.5">
                      <EditLink href={`/admin/brands/${brand.id}/edit`} />
                      <DeleteAction
                        action={deleteBrandAction.bind(null, brand.id)}
                        title="Brendi sil"
                        description={`"${brand.name}" brendini silmək istədiyinizə əminsiniz?`}
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
