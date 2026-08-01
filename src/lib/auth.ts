import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { MailService } = await import("@/services/mail.service");
      await MailService.sendEmailVerification(
        user.email,
        user.name || user.email,
        url
      );
    },
  },
  plugins: [admin(), openAPI()],
});
