import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Colour tones mapped to theme tokens so they work in both themes. */
export type Tone = "primary" | "success" | "warning" | "pink" | "sky" | "muted";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-[color-mix(in_oklch,var(--warning)_70%,var(--foreground))]",
  pink: "bg-chart-4/12 text-chart-4",
  sky: "bg-chart-5/12 text-chart-5",
  muted: "bg-muted text-muted-foreground",
};

export function IconTile({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="size-[18px]" />
    </span>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: Tone;
  hint?: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <IconTile icon={icon} tone={tone} className="hidden size-8 sm:grid" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ActionCard({
  title,
  description,
  href,
  icon,
  tone = "primary",
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <IconTile icon={icon} tone={tone} />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </Link>
  );
}

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Circular progress ring. */
export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Greeting({
  name,
  subtitle,
  badge,
}: {
  name?: string | null;
  subtitle?: ReactNode;
  badge?: ReactNode;
}) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const first = name?.split(" ")[0];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          Good {part}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {first ? `Welcome back, ${first}` : "Welcome back"}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function DashboardSkeleton({ stats = 4 }: { stats?: number }) {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Bone className="h-4 w-24" />
        <Bone className="h-8 w-72" />
        <Bone className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: stats }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <Bone className="h-4 w-24" />
            <Bone className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="flex gap-3">
              <Bone className="size-9" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-1/2" />
                <Bone className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/50 px-6 py-10 text-center">
      <span className="mb-3 grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
