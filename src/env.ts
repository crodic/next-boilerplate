import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.string().url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),

    // Database
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(5432),
    DB_USER: z.string().default("postgres"),
    DB_PASSWORD: z.string().default("postgres"),
    DB_NAME: z.string().default("next_boilerplate"),
    DATABASE_URL: z.string().url(),

    // SMTP
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().default(1025),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM: z.string().email().default("noreply@kosume.com"),
    MAILPIT_WEB_PORT: z.coerce.number().default(8025),

    // Redis
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_URL: z.string().url(),

    // Application
    APP_LOCALE: z.enum(["en", "vi"]).default("en"),

    // Sentry
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_ENABLE_SENTRY: z.enum(["true", "false"]).default("false"),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // For Next.js >= 13.4.4, you only need experimental__runtimeEnv
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
});
