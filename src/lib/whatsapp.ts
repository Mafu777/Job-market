import { prisma } from "@/lib/prisma";

type PublishedJob = {
  id: string;
  title: string;
  location: string;
  company: { name: string };
};

function getWhatsAppConfig() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "en_US";

  if (!token || !phoneNumberId || !templateName) return null;
  return { token, phoneNumberId, templateName, languageCode };
}

export async function notifyWhatsAppSubscribers(job: PublishedJob) {
  const config = getWhatsAppConfig();
  if (!config) return;

  const subscribers = await prisma.whatsAppSubscriber.findMany({ where: { optedIn: true } });
  if (!subscribers.length) return;

  const jobUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/jobs/${job.id}`;
  const results = await Promise.allSettled(
    subscribers.map(async (subscriber) => {
      const response = await fetch(`https://graph.facebook.com/v22.0/${config.phoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: subscriber.phone,
          type: "template",
          template: {
            name: config.templateName,
            language: { code: config.languageCode },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: job.title },
                  { type: "text", text: job.company.name },
                  { type: "text", text: job.location },
                  { type: "text", text: jobUrl },
                ],
              },
            ],
          },
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) throw new Error(`WhatsApp delivery failed with ${response.status}`);
      await prisma.whatsAppSubscriber.update({
        where: { id: subscriber.id },
        data: { lastNotifiedAt: new Date() },
      });
    })
  );

  const failed = results.filter((result) => result.status === "rejected").length;
  if (failed) console.error(`WhatsApp delivery failed for ${failed} subscriber(s).`);
}