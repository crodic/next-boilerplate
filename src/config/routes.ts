import { UserRole } from "@/lib/auth-permissions";

export type RoutePermission = {
  resource: string;
  action: string;
};

export type RouteConfig = {
  url: string;
  roles?: UserRole[];
  permissions?: RoutePermission[];
};

export const APP_ROUTES: Record<string, RouteConfig> = {
  dashboard: {
    url: "/dashboard",
  },
  users: {
    url: "/dashboard/users",
    roles: [UserRole.ADMIN],
    permissions: [{ resource: "user", action: "read" }],
  },
  websiteSettings: {
    url: "/dashboard/website",
    roles: [UserRole.ADMIN],
  },
};
