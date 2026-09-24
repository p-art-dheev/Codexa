"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

/** Coding workspaces (editor + problem solving) use the full viewport width. */
function isWorkspaceRoute(pathname: string) {
  return (
    pathname === "/editor" ||
    (/^\/problems\/[^/]+$/.test(pathname) && pathname !== "/problems/create") ||
    /^\/contests\/[^/]+\/(problems\/[^/]+|take)$/.test(pathname)
  );
}

export default function CodeProctorLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const wide = isWorkspaceRoute(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <AppHeader />
        <div
          id="content"
          className={cn(
            "mx-auto flex w-full flex-1 flex-col",
            wide ? "p-3 sm:p-4" : "max-w-[1400px] p-4 sm:p-6 lg:p-8"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
