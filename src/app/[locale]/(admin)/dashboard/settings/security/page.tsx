import { Separator } from "@/components/ui/separator";
import { SecurityForm } from "@/components/admin/settings/security-form";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function SecuritySettingsPage({
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
        <h3 className="text-lg font-medium">{t("securityTitle")}</h3>
        <p className="text-muted-foreground text-sm">
          {t("securityDescription")}
        </p>
      </div>
      <Separator />
      <SecurityForm />
    </div>
  );
}
