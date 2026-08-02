import { LayoutDashboard, UserLock, Settings } from "lucide-react";
import { type SidebarData } from "@/types/nav";

export const sidebarLink: SidebarData = {
  navGroups: [
    {
      title: "general",
      items: [
        {
          title: "dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "management",
      items: [
        {
          title: "users",
          url: "/dashboard/users",
          icon: UserLock,
        },
      ],
    },
    {
      title: "settings",
      items: [
        {
          title: "website",
          url: "/dashboard/website",
          icon: Settings,
        },
      ],
    },
  ],
};
