import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin, openAPI } from "better-auth/plugins";
import { mailService } from "@/services/mail.service";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await mailService.sendEmailVerification(
        user.email,
        user.name || user.email,
        url
      );
    },
  },
  plugins: [admin(), openAPI()],
});
