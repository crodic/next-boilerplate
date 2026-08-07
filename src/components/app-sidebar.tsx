"use client";

import * as React from "react";

import { NavGroup } from "@/components/nav-group";
import { NavUser } from "@/components/nav-user";
import { sidebarLink } from "@/config/sidebar-link";
import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import Image from "next/image";

import { useSession, useAuth } from "@better-auth-ui/react";
import { roles, UserRole } from "@/lib/auth-permissions";
import type { NavItem } from "@/types/nav";

export function AppSidebar({
  logoLight,
  logoDark,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  logoLight?: string;
  logoDark?: string;
}) {
  const { authClient } = useAuth();
  const { data: session } = useSession(authClient);
  const { collapsible, variant } = useLayout();

  const user = {
    name: session?.user?.name || "Anonymous",
    email: session?.user?.email || "anonymous@example.com",
    avatar: session?.user?.image || "",
  };

  const userRoleStr = (session?.user as any)?.role as UserRole | undefined;
  const userRoleObj = userRoleStr ? roles[userRoleStr] : undefined;

  const hasAccess = React.useCallback(
    (item: NavItem) => {
      if (!item.roles && !item.permissions) return true; // No restrictions

      // Check role
      if (item.roles && userRoleStr && item.roles.includes(userRoleStr)) {
        return true;
      }

      // Check permission
      if (item.permissions && userRoleObj?.statements) {
        const hasPerm = item.permissions.some((p) => {
          return (userRoleObj.statements as any)?.[p.resource]?.includes(
            p.action
          );
        });
        if (hasPerm) return true;
      }

      return false;
    },
    [userRoleStr, userRoleObj]
  );

  const filteredNavGroups = React.useMemo(() => {
    return sidebarLink.navGroups
      .map((group) => {
        // For NavCollapsible (which has items array)
        const filteredItems = group.items
          .map((item) => {
            if ("items" in item && item.items) {
              const filteredSubItems = item.items.filter((subItem) =>
                hasAccess(subItem as any)
              );
              return { ...item, items: filteredSubItems };
            }
            return item;
          })
          .filter((item) => {
            if (!hasAccess(item)) return false;
            if ("items" in item && item.items) return item.items.length > 0;
            return true;
          });

        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [hasAccess]);

  return (
    <Sidebar collapsible={collapsible} variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-0 py-0 hover:bg-transparent active:bg-transparent"
              asChild
            >
              <Link
                href="/"
                className="flex flex-1 items-center justify-center py-2"
              >
                {/* Light Mode Logo */}
                <div className="flex items-center justify-center dark:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoLight || "/logo.png"}
                    alt="Logo"
                    className="h-auto w-full max-w-25 object-contain"
                  />
                </div>
                {/* Dark Mode Logo */}
                <div
                  className={`hidden items-center justify-center dark:flex ${!logoDark ? "dark:invert" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoDark || "/logo.png"}
                    alt="Logo"
                    className="h-auto w-full max-w-25 object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
