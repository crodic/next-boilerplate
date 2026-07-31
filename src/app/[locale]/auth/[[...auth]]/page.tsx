import { Auth } from "@/components/auth/auth";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const authRoutes = [
    [],
    ["sign-in"],
    ["sign-up"],
    ["forgot-password"],
    ["reset-password"],
    ["reset-link-sent"],
    ["verify-email"],
  ];
  return routing.locales.flatMap((locale) =>
    authRoutes.map((auth) => ({ locale, auth }))
  );
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ locale: string; auth?: string[] }>;
}) {
  const { locale, auth } = await params;
  setRequestLocale(locale);

  const path = auth && auth.length > 0 ? auth.join("/") : "sign-in";

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <Auth path={path} />
    </div>
  );
}
