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

  return (
    <Sidebar collapsible={collapsible} variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-0 py-0 hover:bg-transparent active:bg-transparent"
              render={<div />}
            >
              <Link
                href="/"
                className="flex flex-1 items-center justify-center py-2"
              >
                {/* Light Mode Logo */}
                <div className="flex items-center justify-center dark:hidden">
                  <Image
                    src={logoLight || "/next.svg"}
                    alt="Logo"
                    width={120}
                    height={48}
                    className="h-auto max-h-12 w-auto object-contain"
                    priority
                    unoptimized={!!logoLight}
                  />
                </div>
                {/* Dark Mode Logo */}
                <div
                  className={`hidden items-center justify-center dark:flex ${!logoDark ? "dark:invert" : ""}`}
                >
                  <Image
                    src={logoDark || "/next.svg"}
                    alt="Logo"
                    width={120}
                    height={48}
                    className="h-auto max-h-12 w-auto object-contain"
                    priority
                    unoptimized={!!logoDark}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarLink.navGroups.map((props) => (
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
