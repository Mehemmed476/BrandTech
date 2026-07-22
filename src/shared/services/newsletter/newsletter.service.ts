import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/shared/lib/prisma";
import { absoluteUrl } from "@/shared/config/site";
import {
  newsletterCampaignSchema,
  newsletterSubscribeSchema,
  type NewsletterCampaignInput,
} from "@/shared/schemas/newsletter.schema";

export class NewsletterConfigurationError extends Error {}

export function isNewsletterSmtpConfigured() {
  const port = Number(process.env.SMTP_PORT || 587);
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS &&
    Number.isInteger(port),
  );
}

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM?.trim() || user;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass || !from || !Number.isInteger(port)) {
    throw new NewsletterConfigurationError(
      "Email göndərişi üçün SMTP_HOST, SMTP_PORT, SMTP_USER və SMTP_PASS sazlanmalıdır.",
    );
  }

  return {
    transport: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user, pass },
    }),
    from,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailHtml(message: string, unsubscribeUrl: string) {
  const paragraphs = escapeHtml(message)
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;line-height:1.65">${paragraph.replaceAll("\n", "<br>")}</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="az"><body style="margin:0;background:#f4f7f4;font-family:Arial,sans-serif;color:#1f2937">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px">
    <div style="background:#12331a;color:#fff;border-radius:16px 16px 0 0;padding:24px;font-size:20px;font-weight:800">Brand Technology</div>
    <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0">${paragraphs}</div>
    <div style="padding:18px 24px;color:#6b7280;font-size:12px;line-height:1.5;text-align:center">
      Bu məktubu Brand Technology yeniliklərinə abunə olduğunuz üçün aldınız.<br>
      <a href="${unsubscribeUrl}" style="color:#2e7d32">Abunəlikdən çıx</a>
    </div>
  </div>
</body></html>`;
}

export async function subscribeToNewsletter(input: unknown) {
  const { email } = newsletterSubscribeSchema.parse(input);
  const now = new Date();

  return prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      unsubscribeToken: crypto.randomUUID(),
      subscribedAt: now,
    },
    update: {
      status: "ACTIVE",
      unsubscribeToken: crypto.randomUUID(),
      subscribedAt: now,
      unsubscribedAt: null,
    },
  });
}

export async function unsubscribeFromNewsletter(token: string) {
  return prisma.newsletterSubscriber.updateMany({
    where: { unsubscribeToken: token, status: "ACTIVE" },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
  });
}

export async function deleteNewsletterSubscriber(id: string) {
  return prisma.newsletterSubscriber.delete({ where: { id } });
}

export async function getAdminNewsletterData() {
  const [subscribers, campaigns, activeCount, totalCount, unsubscribedCount] =
    await Promise.all([
      prisma.newsletterSubscriber.findMany({
        orderBy: { subscribedAt: "desc" },
        take: 500,
      }),
      prisma.newsletterCampaign.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { createdBy: { select: { fullName: true } } },
      }),
      prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({
        where: { status: "UNSUBSCRIBED" },
      }),
    ]);

  return { subscribers, campaigns, activeCount, totalCount, unsubscribedCount };
}

export async function sendNewsletterCampaign(
  input: NewsletterCampaignInput,
  adminId: string,
) {
  const data = newsletterCampaignSchema.parse(input);
  const { transport, from } = smtpConfig();
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { status: "ACTIVE" },
    select: { email: true, unsubscribeToken: true },
  });

  if (subscribers.length === 0) {
    throw new Error("Aktiv abunəçi yoxdur.");
  }

  const campaign = await prisma.newsletterCampaign.create({
    data: {
      subject: data.subject,
      message: data.message,
      recipientCount: subscribers.length,
      createdById: adminId,
    },
  });

  let sentCount = 0;
  let failedCount = 0;

  for (let index = 0; index < subscribers.length; index += 5) {
    const batch = subscribers.slice(index, index + 5);
    const results = await Promise.allSettled(
      batch.map((subscriber) => {
        const unsubscribeUrl = absoluteUrl(
          `/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`,
        );
        return transport.sendMail({
          from,
          to: subscriber.email,
          subject: data.subject,
          text: `${data.message}\n\nAbunəlikdən çıx: ${unsubscribeUrl}`,
          html: emailHtml(data.message, unsubscribeUrl),
          headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
        });
      }),
    );

    sentCount += results.filter(
      (result) => result.status === "fulfilled",
    ).length;
    failedCount += results.filter(
      (result) => result.status === "rejected",
    ).length;
  }

  const status =
    sentCount === subscribers.length
      ? "SENT"
      : sentCount === 0
        ? "FAILED"
        : "PARTIAL";

  return prisma.newsletterCampaign.update({
    where: { id: campaign.id },
    data: { status, sentCount, failedCount, completedAt: new Date() },
  });
}
