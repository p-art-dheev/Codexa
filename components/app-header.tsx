"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronRight, Flame } from "lucide-react";

import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { getBreadcrumbs } from "@/lib/navigation";
import { signInWithGoogle } from "@/lib/accounts";
import { usePoints } from "@/hooks/use-points";

function PointsChip() {
  const points = usePoints();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="hidden h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-sm font-medium tabular-nums shadow-xs sm:inline-flex"
          aria-label={`${points ?? 0} points`}
        >
          <Flame className="size-4 text-orange-500" />
          {points ?? "—"}
        </span>
      </TooltipTrigger>
      <TooltipContent>Points earned — keep solving to earn more</TooltipContent>
    </Tooltip>
  );
}

export function AppHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 sm:px-4">
      <SidebarTrigger className="-ml-1 size-8" />
      <Separator orientation="vertical" className="mx-1 !h-5" />

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1 text-sm">
          {crumbs.map((c, i) => (
            <Fragment key={c.href}>
              {i > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground/60"
                />
              )}
              <li
                className={
                  c.isLast
                    ? "truncate font-medium text-foreground"
                    : "hidden truncate text-muted-foreground md:block"
                }
              >
                {c.isLast ? (
                  <span aria-current="page">{c.label}</span>
                ) : (
                  <Link
                    href={c.href}
                    className="rounded transition-colors hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {session && <PointsChip />}
        <ModeToggle />
        {session ? (
          <UserMenu />
        ) : status === "loading" ? (
          <span className="size-8 animate-pulse rounded-full bg-muted" />
        ) : (
          <Button size="sm" onClick={() => signInWithGoogle(pathname)}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
