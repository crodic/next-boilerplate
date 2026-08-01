"use client";

import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from "@/types/nav";

export function NavGroup({ title, items, onlyDevMode }: NavGroupProps) {
  const t = useTranslations("Navigation");
  const { state, isMobile } = useSidebar();
  const href = usePathname();

  if (onlyDevMode && process.env.NODE_ENV !== "development") return null;

  // We temporarily disable permission checks and just pass the items through
  const filteredItems = items
    .map((item) => {
      if (item.items) {
        if (item.items.length === 0) return null;
        return { ...item, items: item.items };
      }
      return item;
    })
    .filter(Boolean) as NavItem[];

  if (filteredItems.length === 0) return null;

  return (
    <SidebarGroup>
      {/* Fallback to raw string if translation fails */}
      <SidebarGroupLabel>{t(title as any) || title}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          const key = `${item.title}-${item.url || "group"}`;

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />;

          if (state === "collapsed" && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            );

          return <SidebarMenuCollapsible key={key} item={item} href={href} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const t = useTranslations("Navigation");
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={checkIsActive(href, item)}
        tooltip={t(item.title as any) || item.title}
        render={<Link href={item.url} onClick={() => setOpenMobile(false)} />}
      >
        {item.icon && <item.icon />}
        <span>{t(item.title as any) || item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) {
  const t = useTranslations("Navigation");
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      defaultOpen={checkIsActive(href, item, true)}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton tooltip={t(item.title as any) || item.title} />
        }
      >
        {item.icon && <item.icon />}
        <span>{t(item.title as any) || item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                isActive={checkIsActive(href, subItem)}
                render={
                  <Link
                    href={subItem.url}
                    onClick={() => setOpenMobile(false)}
                  />
                }
              >
                {subItem.icon && <subItem.icon />}
                <span>{t(subItem.title as any) || subItem.title}</span>
                {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) {
  const t = useTranslations("Navigation");
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={t(item.title as any) || item.title}
              isActive={checkIsActive(href, item)}
            />
          }
        >
          {item.icon && <item.icon />}
          <span>{t(item.title as any) || item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
          <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title as any) || item.title}{" "}
            {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem
              key={`${sub.title}-${sub.url}`}
              render={
                <Link
                  href={sub.url}
                  className={`${checkIsActive(href, sub) ? "bg-secondary" : ""}`}
                />
              }
            >
              {sub.icon && <sub.icon />}
              <span className="max-w-52 text-wrap">
                {t(sub.title as any) || sub.title}
              </span>
              {sub.badge && (
                <span className="ms-auto text-xs">{sub.badge}</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url ||
    href.split("?")[0] === item.url ||
    !!item?.items?.filter((i) => i.url === href).length ||
    (mainNav &&
      typeof href === "string" &&
      typeof item?.url === "string" &&
      href.split("/")[1] !== "" &&
      href.split("/")[1] === item.url.split("/")[1])
  );
}
