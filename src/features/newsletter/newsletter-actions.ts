"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  actionFail,
  actionOk,
  databaseErrorMessage,
  zodFieldErrors,
  type ActionResult,
} from "@/shared/lib/action-result";
import { adminGuard, getSession } from "@/shared/lib/auth";
import {
  deleteNewsletterSubscriber,
  NewsletterConfigurationError,
  sendNewsletterCampaign,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from "@/shared/services/newsletter/newsletter.service";

export type NewsletterFormState = ActionResult | null;

export async function subscribeNewsletterAction(
  _previousState: NewsletterFormState,
  formData: FormData,
): Promise<ActionResult> {
  if (String(formData.get("company") || "").trim()) {
    return actionOk("Abunəliyiniz qeydə alındı.");
  }

  try {
    await subscribeToNewsletter({ email: formData.get("email") });
    revalidatePath("/admin/newsletter");
    return actionOk("Təşəkkürlər! E-poçtunuz abunə siyahısına əlavə edildi.");
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("E-poçt ünvanını yoxlayın.", zodFieldErrors(error));
    }
    return actionFail(databaseErrorMessage(error));
  }
}

export async function unsubscribeNewsletterAction(
  token: string,
  _previousState: NewsletterFormState,
  _formData: FormData,
): Promise<ActionResult> {
  void _previousState;
  void _formData;
  if (!token || token.length < 20) {
    return actionFail("Abunəlik linki düzgün deyil.");
  }

  try {
    const result = await unsubscribeFromNewsletter(token);
    revalidatePath("/admin/newsletter");
    return result.count > 0
      ? actionOk("Abunəliyiniz dayandırıldı.")
      : actionOk("Bu e-poçt artıq abunəlikdən çıxıb.");
  } catch {
    return actionFail(
      "Abunəliyi dayandırmaq mümkün olmadı. Yenidən cəhd edin.",
    );
  }
}

export async function sendNewsletterAction(
  input: unknown,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    const session = await getSession();
    if (!session) return actionFail("Admin sessiyası tapılmadı.");

    const campaign = await sendNewsletterCampaign(
      input as { subject: string; message: string },
      session.id,
    );
    revalidatePath("/admin/newsletter");

    if (campaign.failedCount > 0) {
      return actionFail(
        `${campaign.sentCount} email göndərildi, ${campaign.failedCount} email uğursuz oldu.`,
      );
    }
    return actionOk(`${campaign.sentCount} abunəçiyə email göndərildi.`);
  } catch (error) {
    if (error instanceof ZodError) {
      return actionFail("Mesaj məlumatlarını yoxlayın.", zodFieldErrors(error));
    }
    if (
      error instanceof NewsletterConfigurationError ||
      error instanceof Error
    ) {
      return actionFail(error.message);
    }
    return actionFail("Email göndərilərkən xəta baş verdi.");
  }
}

export async function deleteNewsletterSubscriberAction(
  id: string,
): Promise<ActionResult> {
  try {
    const denied = await adminGuard();
    if (denied) return denied;
    await deleteNewsletterSubscriber(id);
    revalidatePath("/admin/newsletter");
    return actionOk("Abunəçi silindi.");
  } catch (error) {
    return actionFail(databaseErrorMessage(error));
  }
}
