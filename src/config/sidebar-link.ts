import { LayoutDashboard, UserLock, Settings } from "lucide-react";
import { type SidebarData } from "@/types/nav";
import { APP_ROUTES } from "./routes";

export const sidebarLink: SidebarData = {
  navGroups: [
    {
      title: "general",
      items: [
        {
          title: "dashboard",
          url: APP_ROUTES.dashboard.url,
          icon: LayoutDashboard,
          roles: APP_ROUTES.dashboard.roles,
          permissions: APP_ROUTES.dashboard.permissions,
        },
      ],
    },
    {
      title: "management",
      items: [
        {
          title: "users",
          url: APP_ROUTES.users.url,
          icon: UserLock,
          roles: APP_ROUTES.users.roles,
          permissions: APP_ROUTES.users.permissions,
        },
      ],
    },
    {
      title: "settings",
      items: [
        {
          title: "website",
          url: APP_ROUTES.websiteSettings.url,
          icon: Settings,
          roles: APP_ROUTES.websiteSettings.roles,
          permissions: APP_ROUTES.websiteSettings.permissions,
        },
      ],
    },
  ],
};
