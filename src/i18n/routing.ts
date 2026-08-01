import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { env } from "@/env";

export const routing = defineRouting({
  locales: (env.NEXT_PUBLIC_ALLOWED_LOCALES || "en,vi").split(","),
  defaultLocale: env.NEXT_PUBLIC_APP_LOCALE || "en",
  localePrefix: "as-needed",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
