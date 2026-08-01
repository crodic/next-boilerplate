import { Settings } from "@/components/auth/settings/settings";
import { setRequestLocale } from "next-intl/server";

export default async function AccountSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <Settings path="account" />
    </div>
  );
}
