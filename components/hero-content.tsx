"use client";

import {
  BarChart3,
  BookOpenCheck,
  Building2,
  Code2,
  GraduationCap,
  ShieldCheck,
  Timer,
  Trophy,
  UserCog,
} from "lucide-react";
import { ActionButtons } from "@/components/action-buttons";
import { siteConfig } from "@/lib/site";

const features = [
  {
    icon: Code2,
    title: "In-browser IDE",
    body: "A Monaco-powered editor with multi-language support and instant test-case feedback.",
  },
  {
    icon: Trophy,
    title: "Timed contests",
    body: "Schedule contests per section, with live leaderboards and automatic scoring.",
  },
  {
    icon: BookOpenCheck,
    title: "Course assignments",
    body: "Attach problem sets to courses and track who has solved what, at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Academic integrity",
    body: "Role-based access and proctored attempts keep assessments fair.",
  },
  {
    icon: BarChart3,
    title: "Progress insights",
    body: "Dashboards for every role — solve rates, submissions and activity in one place.",
  },
  {
    icon: Timer,
    title: "Fast feedback loop",
    body: "Run against sample cases before submitting so students learn as they go.",
  },
];

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    points: ["Practise problems at your own pace", "Join contests and climb the leaderboard", "See progress per course"],
  },
  {
    icon: UserCog,
    title: "Faculty",
    points: ["Author problems with test cases", "Assign problem sets to sections", "Monitor submissions live"],
  },
  {
    icon: Building2,
    title: "Administrators",
    points: ["Manage departments, semesters and sections", "Control roles and access", "Campus-wide overview"],
  },
];

function CodePreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-4xl">
      <div className="absolute -inset-x-10 -top-10 -bottom-4 -z-10 rounded-[2rem] bg-glow blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
            two-sum.py — Contest · DSA Week 4
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success sm:inline-flex">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            42:18 left
          </span>
        </div>
        <div className="grid text-left md:grid-cols-[1fr_1.25fr]">
          <div className="hidden border-r p-5 text-sm md:block">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Problem 1 · Easy
            </p>
            <p className="mt-1.5 font-semibold">Two Sum</p>
            <p className="mt-2 text-muted-foreground">
              Given an array of integers <code className="font-mono text-foreground">nums</code> and a
              target, return the indices of the two numbers that add up to target.
            </p>
            <div className="mt-4 rounded-lg bg-muted/60 p-3 font-mono text-xs">
              <p className="text-muted-foreground">Input</p>
              <p>nums = [2,7,11,15], target = 9</p>
              <p className="mt-2 text-muted-foreground">Output</p>
              <p>[0,1]</p>
            </div>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
            <code>
              <span className="text-chart-4">def</span>{" "}
              <span className="text-primary">two_sum</span>(nums, target):{"\n"}
              {"    "}seen = {"{}"}{"\n"}
              {"    "}<span className="text-chart-4">for</span> i, n{" "}
              <span className="text-chart-4">in</span> enumerate(nums):{"\n"}
              {"        "}<span className="text-chart-4">if</span> target - n{" "}
              <span className="text-chart-4">in</span> seen:{"\n"}
              {"            "}<span className="text-chart-4">return</span> [seen[target - n], i]{"\n"}
              {"        "}seen[n] = i{"\n"}
            </code>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3 font-sans text-xs">
              <span className="inline-flex items-center gap-1 rounded-md bg-success/12 px-2 py-1 font-medium text-success">
                ✓ 12 / 12 test cases passed
              </span>
              <span className="text-muted-foreground">Runtime 41 ms</span>
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function HeroContent() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid mask-fade-b absolute inset-0 -z-10" />
        <div className="bg-glow absolute inset-0 -z-10" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur">
            <ShieldCheck className="size-3.5 text-primary" />
            {siteConfig.tagline}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Where your campus{" "}
            <span className="text-gradient">learns to code</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.description}
          </p>
          <ActionButtons className="mt-10" />
          <p className="mt-4 text-xs text-muted-foreground">
            Sign in with your university Google account.
          </p>
          <CodePreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Everything in one place</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for how universities teach programming
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">One platform, three views</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              The right tools for every role
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {roles.map((r) => (
              <div key={r.title} className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <r.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{r.title}</h3>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative mt-16 overflow-hidden rounded-3xl border bg-card px-6 py-12 text-center">
            <div className="bg-glow absolute inset-0 -z-0" />
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to get started?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Your dashboard is one sign-in away.
              </p>
              <ActionButtons className="mt-8" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <p>Made for universities.</p>
        </div>
      </footer>
    </main>
  );
}
