"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AccountTracker } from "@/components/account-tracker";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeHotkey } from "@/components/mode-toggle";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          <AccountTracker />
          <ThemeHotkey />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
