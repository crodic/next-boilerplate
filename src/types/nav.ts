import * as React from "react";
import type { UserRole } from "@/lib/auth-permissions";
import type { RoutePermission } from "@/config/routes";

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  roles?: UserRole[];
  permissions?: RoutePermission[];
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & {
    url: string;
  })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
  title: string;
  items: NavItem[];
  onlyDevMode?: boolean;
};

type SidebarData = {
  navGroups: NavGroup[];
};

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink };
