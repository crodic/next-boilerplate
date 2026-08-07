import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin, openAPI, multiSession } from "better-auth/plugins";
import { mailService } from "@/services/mail.service";
import {
  ac,
  adminRole,
  managerRole,
  userRole,
  UserRole,
} from "./auth-permissions";

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
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        manager: managerRole,
        user: userRole,
      },
      adminRole: [UserRole.ADMIN, UserRole.MANAGER],
    }),
    openAPI(),
    multiSession({
      maximumSessions: 5,
    }),
  ],
});
