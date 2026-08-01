import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

import { adminClient, multiSessionClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(), multiSessionClient()],
});
