"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowLeftRight,
  Check,
  ChevronsUpDown,
  Flame,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { useThemeToggle } from "@/components/mode-toggle";
import {
  forgetAccount,
  switchAccount,
  useRememberedAccounts,
} from "@/lib/accounts";
import { usePoints } from "@/hooks/use-points";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  faculty: "Faculty",
  student: "Student",
};

export function RoleBadge({
  role,
  className,
}: {
  role?: string | null;
  className?: string;
}) {
  if (!role) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide",
        role === "admin" &&
          "border-brand/30 bg-brand/10 text-brand",
        role === "faculty" &&
          "border-chart-2/30 bg-chart-2/10 text-chart-2",
        role === "student" && "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      {roleLabel[role] ?? role}
    </span>
  );
}

/** Menu body shared by the header avatar button and the sidebar footer. */
function UserMenuContent({
  side = "bottom",
  align = "end",
}: {
  side?: "bottom" | "right" | "top";
  align?: "start" | "end";
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const points = usePoints();
  const accounts = useRememberedAccounts();
  const { isDark, toggle } = useThemeToggle();
  const [busy, setBusy] = React.useState(false);

  const others = accounts.filter(
    (a) => a.email.toLowerCase() !== user?.email?.toLowerCase()
  );

  async function handleSwitch(email?: string) {
    if (busy) return;
    setBusy(true);
    toast.loading(email ? `Switching to ${email}…` : "Opening Google account chooser…");
    try {
      await switchAccount(email);
    } catch {
      setBusy(false);
      toast.dismiss();
      toast.error("Couldn't switch accounts. Please try again.");
    }
  }

  async function handleSignOut() {
    setBusy(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={8}
      className="w-72 rounded-xl p-1.5"
    >
      <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
        <UserAvatar
          name={user?.name}
          email={user?.email}
          image={user?.image}
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <RoleBadge role={user?.role} />
          </div>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </DropdownMenuLabel>

      <div className="mx-2 mb-1.5 flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Flame className="size-3.5 text-orange-500" />
          Total points
        </span>
        <span className="font-mono text-sm font-semibold tabular-nums">
          {points ?? "—"}
        </span>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            toggle();
          }}
        >
          {isDark ? <Sun /> : <Moon />}
          {isDark ? "Light mode" : "Dark mode"}
          <DropdownMenuShortcut>⇧D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2 [&_svg:not([class*='text-'])]:text-muted-foreground">
          <ArrowLeftRight className="size-4" />
          Switch account
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-72 rounded-xl p-1.5">
          <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
            Accounts on this device
          </DropdownMenuLabel>

          {/* current account */}
          <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <UserAvatar
              name={user?.name}
              email={user?.email}
              image={user?.image}
              className="size-7"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <Check className="size-4 text-brand" aria-label="Current account" />
          </div>

          {others.map((acc) => (
            <DropdownMenuItem
              key={acc.email}
              disabled={busy}
              onSelect={() => handleSwitch(acc.email)}
              className="group/acc gap-2.5"
            >
              <UserAvatar
                name={acc.name}
                email={acc.email}
                image={acc.image}
                className="size-7"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {acc.name || acc.email}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {acc.email}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${acc.email} from this device`}
                title="Remove from this device"
                className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover/acc:opacity-100 group-focus/acc:opacity-100"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  forgetAccount(acc.email);
                }}
              >
                <X className="size-3.5" />
              </button>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={busy} onSelect={() => handleSwitch()}>
            <UserPlus />
            Use another account
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuItem
        variant="destructive"
        disabled={busy}
        onSelect={handleSignOut}
      >
        <LogOut />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

/** Compact avatar trigger for the top header. */
export function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none ring-offset-2 ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open account menu"
      >
        <UserAvatar name={user.name} email={user.email} image={user.image} />
      </DropdownMenuTrigger>
      <UserMenuContent />
    </DropdownMenu>
  );
}

/** Full-width trigger for the sidebar footer (collapses to avatar). */
export function SidebarUserMenu() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const user = session?.user;
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left outline-none transition hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:p-0"
        aria-label="Open account menu"
      >
        <UserAvatar name={user.name} email={user.email} image={user.image} />
        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <ChevronsUpDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>
      <UserMenuContent side={isMobile ? "top" : "right"} align="end" />
    </DropdownMenu>
  );
}
