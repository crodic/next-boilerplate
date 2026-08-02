import { setRequestLocale } from "next-intl/server";
import { getWebsiteSettings } from "@/actions/settings";
import { WebsiteSettingsForm } from "@/components/admin/website-settings-form";

export default async function WebsiteSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch initial settings from DB
  const initialSettings = await getWebsiteSettings();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
      </div>

      <div className="max-w-4xl">
        <WebsiteSettingsForm initialSettings={initialSettings} />
      </div>
    </div>
  );
}
