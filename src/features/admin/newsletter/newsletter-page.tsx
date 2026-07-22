import { MailCheck, Send, UserMinus, Users } from "lucide-react";
import {
  AdminPageHeader,
  StatCard,
  StatusPill,
  TableCard,
  tdClass,
  thClass,
} from "@/features/admin/admin-ui";
import { DeleteAction } from "@/features/admin/delete-action";
import { NewsletterComposeForm } from "@/features/admin/newsletter/newsletter-compose-form";
import { deleteNewsletterSubscriberAction } from "@/features/newsletter/newsletter-actions";
import {
  getAdminNewsletterData,
  isNewsletterSmtpConfigured,
} from "@/shared/services/newsletter/newsletter.service";
import { formatDate } from "@/shared/utils/format-date";

const campaignLabels = {
  SENDING: { label: "Göndərilir", tone: "sky" as const },
  SENT: { label: "Göndərildi", tone: "green" as const },
  PARTIAL: { label: "Qismən", tone: "amber" as const },
  FAILED: { label: "Uğursuz", tone: "rose" as const },
};

export async function AdminNewsletterPage() {
  const { subscribers, campaigns, activeCount, totalCount, unsubscribedCount } =
    await getAdminNewsletterData();
  const smtpConfigured = isNewsletterSmtpConfigured();

  return (
    <div>
      <AdminPageHeader
        title="Email abunəçiləri"
        description="Footer vasitəsilə toplanan ünvanları idarə edin və toplu mesaj göndərin."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Bütün ünvanlar"
          value={String(totalCount)}
          icon={Users}
        />
        <StatCard
          label="Aktiv abunəçilər"
          value={String(activeCount)}
          icon={MailCheck}
        />
        <StatCard
          label="Abunəlikdən çıxanlar"
          value={String(unsubscribedCount)}
          icon={UserMinus}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <Send className="h-5 w-5 text-brand-600" />
            <div>
              <h2 className="font-bold text-gray-900">Toplu email hazırla</h2>
              <p className="text-xs text-gray-400">
                Mesaj yalnız aktiv abunəçilərə göndərilir.
              </p>
            </div>
          </div>
          <NewsletterComposeForm
            activeCount={activeCount}
            smtpConfigured={smtpConfigured}
          />
        </section>

        <TableCard title="Son göndərişlər">
          {campaigns.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              Hələ göndəriş yoxdur.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {campaigns.map((campaign) => {
                const status = campaignLabels[campaign.status];
                return (
                  <div key={campaign.id} className="space-y-2 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {campaign.subject}
                      </p>
                      <StatusPill label={status.label} tone={status.tone} />
                    </div>
                    <p className="text-xs text-gray-400">
                      {campaign.sentCount}/{campaign.recipientCount} göndərildi
                      · {formatDate(campaign.createdAt)}
                      {campaign.createdBy
                        ? ` · ${campaign.createdBy.fullName}`
                        : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </TableCard>
      </div>

      <div className="mt-5">
        <TableCard
          title="Abunəçi siyahısı"
          description={
            totalCount > 500
              ? "Ən son 500 qeyd göstərilir."
              : `${totalCount} qeyd`
          }
        >
          {subscribers.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">
              Hələ abunəçi yoxdur.
            </p>
          ) : (
            <table className="w-full min-w-[680px]">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className={thClass}>E-poçt</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Abunə tarixi</th>
                  <th className={`${thClass} text-right`}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      {subscriber.email}
                    </td>
                    <td className={tdClass}>
                      <StatusPill
                        label={
                          subscriber.status === "ACTIVE"
                            ? "Aktiv"
                            : "Abunəlikdən çıxıb"
                        }
                        tone={subscriber.status === "ACTIVE" ? "green" : "gray"}
                      />
                    </td>
                    <td className={tdClass}>
                      {formatDate(subscriber.subscribedAt)}
                    </td>
                    <td className={tdClass}>
                      <div className="flex justify-end">
                        <DeleteAction
                          action={deleteNewsletterSubscriberAction.bind(
                            null,
                            subscriber.id,
                          )}
                          title="Abunəçini sil"
                          description={`${subscriber.email} ünvanı siyahıdan tam silinsin?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </div>
    </div>
  );
}
