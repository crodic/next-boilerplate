import { setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { UserButton } from "@/components/auth/user/user-button";
import { Search } from "@/components/search";
import { ConfigDrawer } from "@/components/config-drawer";
import { getWebsiteSettings } from "@/actions/settings";
import { Inter, Roboto, Nunito, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const nunito = Nunito({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const dashboardFont = cookieStore.get("dashboard-font")?.value || "geist";
  const themeColor = cookieStore.get("theme-color")?.value || "neutral";

  let fontClass = "";
  if (dashboardFont === "inter") fontClass = inter.className;
  else if (dashboardFont === "roboto") fontClass = roboto.className;
  else if (dashboardFont === "nunito") fontClass = nunito.className;
  else if (dashboardFont === "playfair") fontClass = playfair.className;

  const settings = await getWebsiteSettings();

  return (
    <div
      className={fontClass}
      data-theme={themeColor !== "neutral" ? themeColor : undefined}
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          logoLight={settings.logoLight}
          logoDark={settings.logoDark}
        />
        <SidebarInset>
          <Header fixed>
            <div className="flex flex-1 items-center justify-end gap-4">
              <Search />
              <ConfigDrawer />
              <LanguageSwitcher />
              <UserButton size="icon" />
            </div>
          </Header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
