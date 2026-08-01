import { betterAuth } from "better-auth";
import { sendTemplateMail } from "./mail";
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
      await sendTemplateMail({
        to: user.email,
        subject: "Verify your email address",
        template: "email-verification",
        context: {
          name: user.name || user.email,
          url,
        },
      });
    },
  },
  plugins: [admin(), openAPI()],
});
