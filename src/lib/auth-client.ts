import "client-only";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

import { adminClient, multiSessionClient } from "better-auth/client/plugins";

import {
  ac,
  adminRole,
  managerRole,
  userRole,
  UserRole,
} from "./auth-permissions";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        [UserRole.ADMIN]: adminRole,
        [UserRole.MANAGER]: managerRole,
        [UserRole.USER]: userRole,
      },
    } as any), // Type assertion might be needed for client plugin
    multiSessionClient(),
  ],
});
