import * as Sentry from "@sentry/nextjs";
import { env } from "@/env";

if (env.NEXT_PUBLIC_ENABLE_SENTRY === "true") {
  Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    enableLogs: true,
  });
}
