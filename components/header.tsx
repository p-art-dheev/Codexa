"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Brand } from "./brand";
import { ModeToggle } from "./mode-toggle";
import { UserMenu } from "./user-menu";
import { signInWithGoogle } from "@/lib/accounts";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 text-sm text-muted-foreground md:flex"
        >
          <a href="#features" className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#roles" className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground">
            For your campus
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {session ? (
            <>
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserMenu />
            </>
          ) : status === "loading" ? (
            <span className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : (
            <Button size="sm" onClick={() => signInWithGoogle()}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
