import { UserButton } from "@/components/auth/user/user-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

import { getTranslations } from "next-intl/server";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:border-white/10 dark:bg-black/80">
        <div className="text-lg font-semibold">{t("settings")}</div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl p-6 md:p-10">{children}</main>
    </div>
  );
}
