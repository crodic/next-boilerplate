import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  // Read config cookies server-side to pass as initial values (avoids hydration mismatch)
  const cookieStore = await cookies();
  const initialDir =
    (cookieStore.get("dir")?.value as "ltr" | "rtl") || undefined;
  const initialColorKey =
    (cookieStore.get("theme-color")?.value as any) || undefined;
  const initialCollapsible =
    (cookieStore.get("layout_collapsible")?.value as any) || undefined;
  const initialVariant =
    (cookieStore.get("layout_variant")?.value as any) || undefined;

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers
        initialDir={initialDir}
        initialColorKey={initialColorKey}
        initialCollapsible={initialCollapsible}
        initialVariant={initialVariant}
      >
        {children}
      </Providers>
    </NextIntlClientProvider>
  );
}
