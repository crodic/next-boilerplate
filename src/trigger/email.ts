import { task } from "@trigger.dev/sdk/v3";
import { sendTemplateMail, SendMailOptions } from "@/lib/mail";

export const sendEmailTask = task({
  id: "send-email",
  maxDuration: 60,
  run: async (payload: SendMailOptions) => {
    try {
      const result = await sendTemplateMail(payload);
      return { success: true, messageId: (result as any)?.messageId };
    } catch (error: any) {
      console.error("Failed to send email in background", error);
      throw error;
    }
  },
});
