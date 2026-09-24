"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { Brand, BrandMark } from "./brand";
import { SidebarUserMenu } from "./user-menu";
import { isActivePath, navGroups } from "@/lib/navigation";

export default function AppSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const role = session?.user?.role ?? "";

  if (status === "unauthenticated") return null;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
        <div className="group-data-[collapsible=icon]:hidden">
          <Brand href="/dashboard" subtitle />
        </div>
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className="hidden group-data-[collapsible=icon]:block"
        >
          <BrandMark />
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {status === "loading"
          ? [0, 1].map((g) => (
              <SidebarGroup key={g}>
                <SidebarMenu>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <div className="flex h-9 items-center gap-2 px-2">
                        <div className="size-4 animate-pulse rounded bg-sidebar-accent" />
                        <div
                          className="h-3.5 animate-pulse rounded bg-sidebar-accent group-data-[collapsible=icon]:hidden"
                          style={{ width: `${55 + ((i * 17) % 30)}%` }}
                        />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))
          : navGroups.map((group) => {
              const items = group.items.filter((item) =>
                item.roles.includes(role as never)
              );
              if (items.length === 0) return null;
              return (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5">
                      {items.map((item) => {
                        const active = isActivePath(pathname, item.href);
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              tooltip={item.label}
                              className="h-9 rounded-lg font-medium text-sidebar-foreground/80 transition-colors hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:[&>svg]:text-sidebar-primary"
                            >
                              <Link
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                onClick={() => isMobile && setOpenMobile(false)}
                              >
                                <item.icon />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
