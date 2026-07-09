import Image from "next/image";
import { ImageIcon, Plus } from "lucide-react";
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
import { deleteBannerAction } from "@/features/admin/banners/banner-actions";
import { bannerPositionLabel } from "@/shared/constants/labels";
import { getAdminBanners } from "@/shared/services/banners/banner.service";

export async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <AdminPageHeader
        title="Bannerlər"
        description={`${banners.length} banner`}
        action={
          <ButtonLink href="/admin/banners/new">
            <Plus className="h-4 w-4" />
            Banner əlavə et
          </ButtonLink>
        }
      />

      {banners.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-8 w-8" />}
          title="Hələ banner yoxdur"
          description="İlk bannerinizi əlavə edin."
          action={
            <ButtonLink href="/admin/banners/new">Banner əlavə et</ButtonLink>
          }
        />
      ) : (
        <TableCard title="Bütün bannerlər">
          <table className="w-full min-w-[680px]">
            <thead className="bg-gray-50/70">
              <tr>
                <th className={thClass}>Banner</th>
                <th className={thClass}>Mövqe</th>
                <th className={thClass}>Sıralama</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <tr key={banner.id} className="transition hover:bg-gray-50/60">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          alt=""
                          src={banner.imageUrl}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[240px] truncate font-semibold text-gray-900">
                          {banner.title}
                        </p>
                        {banner.subtitle ? (
                          <p className="max-w-[240px] truncate text-xs text-gray-400">
                            {banner.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>
                    {bannerPositionLabel(banner.position)}
                  </td>
                  <td className={tdClass}>{banner.sortOrder}</td>
                  <td className={tdClass}>
                    <StatusPill
                      label={banner.isActive ? "Aktiv" : "Deaktiv"}
                      tone={banner.isActive ? "green" : "gray"}
                    />
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center justify-end gap-1.5">
                      <EditLink href={`/admin/banners/${banner.id}/edit`} />
                      <DeleteAction
                        action={deleteBannerAction.bind(null, banner.id)}
                        title="Banneri sil"
                        description={`"${banner.title}" bannerini silmək istədiyinizə əminsiniz?`}
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
