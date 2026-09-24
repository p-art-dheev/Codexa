"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/** Returns a toggler that flips light/dark with a circular reveal from `origin`. */
export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = React.useCallback(
    (origin?: { x: number; y: number }) => {
      const next = resolvedTheme === "dark" ? "light" : "dark";
      const doc = document as DocumentWithVT;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!doc.startViewTransition || reduceMotion) {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 32;
      const r = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const root = document.documentElement.style;
      root.setProperty("--vt-x", `${x}px`);
      root.setProperty("--vt-y", `${y}px`);
      root.setProperty("--vt-r", `${r}px`);

      doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
    },
    [resolvedTheme, setTheme]
  );

  return { isDark, mounted, toggle };
}

/** One-click light/dark toggle button. */
export function ModeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useThemeToggle();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn("relative rounded-full", className)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            toggle({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            });
          }}
        >
          <Sun className="size-[1.15rem] scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-[1.15rem] scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        <kbd className="ml-2 rounded border border-current/30 px-1 font-mono text-[10px] opacity-70">
          ⇧D
        </kbd>
      </TooltipContent>
    </Tooltip>
  );
}

/** Global Shift+D shortcut for the theme (ignored while typing). */
export function ThemeHotkey() {
  const { toggle } = useThemeToggle();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "D" && e.key !== "d") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) ||
          t.closest(".monaco-editor"))
      )
        return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
  return null;
}

export { ModeToggle as ThemeToggle };
