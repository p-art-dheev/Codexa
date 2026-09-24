"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Building2,
  CalendarRange,
  GraduationCap,
  Library,
  ListChecks,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/status-screen";
import {
  ActionCard,
  DashboardSkeleton,
  Greeting,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-kit";
import { siteConfig } from "@/lib/site";

type DashboardData = {
  n_courses: number;
  n_instructors: number;
  n_departments: number;
  n_users: number;
  n_problems: number;
  n_semesters: number;
  n_sections: number;
};

const adminPages = [
  { title: "Users", description: "Manage accounts and roles", href: "/users", icon: Users, tone: "primary" as const },
  { title: "Courses", description: "Create and manage course offerings", href: "/courses", icon: Library, tone: "success" as const },
  { title: "Departments", description: "Organise academic departments", href: "/departments", icon: Building2, tone: "pink" as const },
  { title: "Semesters", description: "Set up academic terms", href: "/semesters", icon: CalendarRange, tone: "warning" as const },
  { title: "Sections", description: "Configure sections and enrolments", href: "/sections", icon: UsersRound, tone: "sky" as const },
  { title: "Problems", description: "Browse and author coding problems", href: "/problems", icon: ListChecks, tone: "primary" as const },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin_dashboard");
        if (!res.ok) throw new Error(String(res.status));
        setData(await res.json());
      } catch (e) {
        console.error("Error fetching admin dashboard data:", e);
        setError(true);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <StatusScreen
        kind="error"
        title="Couldn't load system overview"
        description="The dashboard data failed to load."
        action={<Button onClick={() => location.reload()}>Try again</Button>}
      />
    );
  }

  if (!data) return <DashboardSkeleton stats={8} />;

  const statsCards = [
    { label: "Users", value: data.n_users, icon: Users, tone: "primary" as const },
    { label: "Instructors", value: data.n_instructors, icon: GraduationCap, tone: "warning" as const },
    { label: "Problems", value: data.n_problems, icon: ListChecks, tone: "pink" as const },
    { label: "Courses", value: data.n_courses, icon: BookOpen, tone: "success" as const },
    { label: "Departments", value: data.n_departments, icon: Building2, tone: "sky" as const },
    { label: "Semesters", value: data.n_semesters, icon: CalendarRange, tone: "muted" as const },
    { label: "Sections", value: data.n_sections, icon: UsersRound, tone: "muted" as const },
  ];

  return (
    <div className="space-y-8">
      <Greeting
        name={user?.name}
        subtitle={`Here's what's happening across ${siteConfig.name} today.`}
        badge={
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:self-auto">
            <ShieldCheck className="size-3.5" />
            Administrator
          </span>
        }
      />

      <section>
        <SectionTitle>System overview</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {statsCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Manage</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminPages.map((p) => (
            <ActionCard key={p.href} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
