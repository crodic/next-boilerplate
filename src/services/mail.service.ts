import { sendTemplateMail, SendMailOptions } from "@/lib/mail";

export interface IMailService {
  sendEmail(
    options: SendMailOptions
  ): Promise<{ success: boolean; result?: any }>;
  sendEmailVerification(
    to: string,
    name: string,
    url: string
  ): Promise<{ success: boolean; result?: any }>;
}

export class MailService implements IMailService {
  /**
   * Send an email synchronously.
   */
  async sendEmail(options: SendMailOptions) {
    const result = await sendTemplateMail(options);
    return { success: true, result };
  }

  async sendEmailVerification(to: string, name: string, url: string) {
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
}

export const mailService = new MailService();
