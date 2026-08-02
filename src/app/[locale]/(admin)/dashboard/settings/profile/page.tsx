import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/admin/settings/profile-form";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function SettingsProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AccountSettings");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("profileTitle")}</h3>
        <p className="text-muted-foreground text-sm">
          {t("profileDescription")}
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
