import Link from "next/link";
import type { ReactNode } from "react";
import { Lock, ShieldAlert, AlertTriangle, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const icons = {
  auth: Lock,
  forbidden: ShieldAlert,
  error: AlertTriangle,
  empty: SearchX,
};

/** Centered full-area message for auth, permission, error and empty states. */
export function StatusScreen({
  kind = "error",
  title,
  description,
  action,
  className,
}: {
  kind?: keyof typeof icons;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const Icon = icons[kind];
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center px-4 py-16",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div
          className={cn(
            "mb-5 grid size-14 place-items-center rounded-2xl border bg-card shadow-sm",
            kind === "error" && "text-destructive",
            kind === "forbidden" && "text-warning",
            (kind === "auth" || kind === "empty") && "text-brand"
          )}
        >
          <Icon className="size-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-6 flex gap-2">
          {action ?? (
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
