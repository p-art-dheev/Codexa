"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  ListChecks,
  Trophy,
  UsersRound,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/status-screen";
import {
  ActionCard,
  DashboardSkeleton,
  EmptyCard,
  Greeting,
  IconTile,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-kit";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  section_name: string;
  semester_name: string;
}

interface DashboardData {
  courses: Course[];
  statistics: {
    n_courses: number;
    n_sections: number;
    n_students: number;
    n_problems: number;
  };
  recent_activity?: {
    id: string;
    created_at: string;
    status: string;
    student_name: string;
    problem_title: string;
    course_name: string;
  }[];
}

const quickActions = [
  {
    title: "Problems",
    description: "Browse and manage coding problems",
    href: "/problems",
    icon: ListChecks,
    tone: "primary" as const,
  },
  {
    title: "Contests",
    description: "Schedule and monitor contests",
    href: "/contests",
    icon: Trophy,
    tone: "warning" as const,
  },
  {
    title: "Code editor",
    description: "Test and draft reference solutions",
    href: "/editor",
    icon: Code2,
    tone: "sky" as const,
  },
];

function statusMeta(status: string) {
  switch (status.toLowerCase()) {
    case "accepted":
    case "correct":
      return { Icon: CheckCircle2, cls: "text-success bg-success/10" };
    case "wrong answer":
    case "failed":
      return { Icon: XCircle, cls: "text-destructive bg-destructive/10" };
    case "pending":
    case "running":
      return { Icon: Clock, cls: "text-warning bg-warning/15" };
    default:
      return { Icon: AlertCircle, cls: "text-muted-foreground bg-muted" };
  }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (Number.isNaN(diff)) return "";
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function FacultyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/faculty_dashboard");
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error("Error fetching faculty dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <StatusScreen
        kind="error"
        title="Couldn't load your dashboard"
        description={error ?? "Something went wrong."}
        action={<Button onClick={() => location.reload()}>Try again</Button>}
      />
    );
  }

  const s = data.statistics;
  const activity = data.recent_activity ?? [];

  return (
    <div className="space-y-8">
      <Greeting
        name={user?.name}
        subtitle="Here's an overview of your courses and recent activity."
        badge={
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-chart-2/30 bg-chart-2/10 px-3 py-1 text-xs font-medium text-chart-2 sm:self-auto">
            <GraduationCap className="size-3.5" />
            Faculty
          </span>
        }
      />

      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Courses" value={s.n_courses} icon={BookOpen} tone="primary" />
          <StatCard label="Sections" value={s.n_sections} icon={UsersRound} tone="success" />
          <StatCard label="Students" value={s.n_students} icon={GraduationCap} tone="pink" />
          <StatCard label="Problems" value={s.n_problems} icon={ListChecks} tone="warning" />
        </div>
      </section>

      <div className={cn("grid gap-8", activity.length > 0 && "xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]")}>
        <section>
          <SectionTitle
            action={
              data.courses.length > 0 && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/my-courses">View all</Link>
                </Button>
              )
            }
          >
            My courses
          </SectionTitle>
          {data.courses.length === 0 ? (
            <EmptyCard
              icon={BookOpen}
              title="No courses assigned"
              description="Once an administrator assigns you to a course section, it will show up here with quick access to problems and students."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.courses.map((course, i) => (
                <Link
                  key={`${course.id}-${i}`}
                  href={`/my-courses/${course.id}/problems`}
                  className="group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <IconTile icon={BookOpen} tone="primary" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium">{course.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {course.section_name} · {course.semester_name}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {activity.length > 0 && (
          <section>
            <SectionTitle>Recent submissions</SectionTitle>
            <ul className="divide-y rounded-xl border bg-card shadow-xs">
              {activity.slice(0, 8).map((a) => {
                const { Icon, cls } = statusMeta(a.status);
                return (
                  <li key={a.id} className="flex items-start gap-3 p-3">
                    <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-full", cls)}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate">
                        <span className="font-medium">{a.student_name}</span>{" "}
                        <span className="text-muted-foreground">·</span>{" "}
                        {a.problem_title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.course_name} · {a.status} · {timeAgo(a.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <section>
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((a) => (
            <ActionCard key={a.href} {...a} />
          ))}
        </div>
      </section>
    </div>
  );
}
