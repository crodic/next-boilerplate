import { setRequestLocale, getTranslations } from "next-intl/server";
import { SidebarNav } from "@/components/admin/settings/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Palette } from "lucide-react";
import { ReactNode } from "react";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AccountSettings");

  const sidebarNavItems = [
    {
      title: t("profile"),
      href: "/dashboard/settings/profile",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      title: t("account"),
      href: "/dashboard/settings/account",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: t("security"),
      href: "/dashboard/settings/security",
      icon: <Shield className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
