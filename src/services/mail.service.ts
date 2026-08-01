import { sendTemplateMail, SendMailOptions } from "@/lib/mail";
import { sendEmailTask } from "@/trigger/email";
import { env } from "@/env";

export class MailService {
  /**
   * Helper function to send email.
   * It checks for Trigger.dev configuration. If enabled, it sends the email
   * in the background queue. Otherwise, it sends it synchronously.
   */
  static async sendEmail(options: SendMailOptions) {
    if (env.TRIGGER_SECRET_KEY) {
      try {
        // Trigger the background job
        await sendEmailTask.trigger(options);
        return { success: true, queued: true };
      } catch (error) {
        console.error(
          "Failed to queue email task, falling back to sync sending",
          error
        );
        // Fallback to sync
        const result = await sendTemplateMail(options);
        return { success: true, queued: false, result };
      }
    } else {
      // Send directly
      const result = await sendTemplateMail(options);
      return { success: true, queued: false, result };
    }
  }

  static async sendEmailVerification(to: string, name: string, url: string) {
    return this.sendEmail({
      to,
      subject: "Verify your email address",
      template: "email-verification",
      context: {
        name,
        url,
      },
    });
  }

  // Add more helpers for other emails like password reset, magic link, etc.
}
