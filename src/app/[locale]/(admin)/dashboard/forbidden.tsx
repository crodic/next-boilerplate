import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Forbidden() {
  const t = useTranslations("Forbidden");

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
      <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
        <Lock className="size-12 text-red-600 dark:text-red-500" />
      </div>
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">403</h1>
        <h2 className="text-2xl font-semibold">
          {t("title") || "Access Denied"}
        </h2>
        <p className="text-muted-foreground max-w-[500px]">
          {t("description") ||
            "You do not have permission to access this page. Please contact your administrator if you believe this is a mistake."}
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/dashboard">{t("backToHome") || "Back to Dashboard"}</Link>
      </Button>
    </div>
  );
}
