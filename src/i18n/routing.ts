import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { env } from "@/env";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: env.APP_LOCALE,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
