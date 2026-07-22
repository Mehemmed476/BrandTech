import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin/admin-ui";
import { SettingsForm } from "@/features/admin/settings/settings-form";
import { getStoreSettings } from "@/shared/services/settings/settings.service";

export const metadata: Metadata = { title: "Parametrlər" };

export default async function Page() {
  const settings = await getStoreSettings();
  return (
    <div>
      <AdminPageHeader
        title="Parametrlər"
        description="Mağaza məlumatlarını, əlaqə detallarını və hero banner davranışını idarə edin."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
