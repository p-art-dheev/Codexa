"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarRange,
  CheckCircle2,
  Code2,
  ListChecks,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/status-screen";
import {
  ActionCard,
  DashboardSkeleton,
  EmptyCard,
  Greeting,
  IconTile,
  ProgressBar,
  ProgressRing,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-kit";

interface Course {
  id: string;
  name: string;
  section_name: string;
  semester_name: string;
  section_id: string;
  total_problems: number;
  solved_problems: number;
}

interface StudentInfo {
  section: {
    section_id: string;
    section_name: string;
    semester_name: string;
    year: string;
    department_name: string;
  } | null;
}

interface DashboardData {
  student_info: StudentInfo;
  courses: Course[];
  statistics: {
    problems_solved: number;
    problems_attempted: number;
    total_available: number;
  };
}

const quickActions = [
  {
    title: "Browse problems",
    description: "Pick a challenge and start solving",
    href: "/problems",
    icon: ListChecks,
    tone: "primary" as const,
  },
  {
    title: "Contests",
    description: "Join live and upcoming contests",
    href: "/contests",
    icon: Trophy,
    tone: "warning" as const,
  },
  {
    title: "Code editor",
    description: "Scratchpad to practise and test code",
    href: "/editor",
    icon: Code2,
    tone: "sky" as const,
  },
];

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/student_dashboard");
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error("Error fetching student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton stats={3} />;

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

  const { statistics: stats, student_info, courses } = data;
  const solveRate =
    stats.total_available > 0
      ? Math.round((stats.problems_solved / stats.total_available) * 100)
      : 0;
  const section = student_info.section;

  return (
    <div className="space-y-8">
      <Greeting
        name={user?.name}
        subtitle={
          section
            ? `${section.section_name} · ${section.semester_name} · ${section.department_name}`
            : "Ready to start your coding journey?"
        }
        badge={
          <Button asChild className="group">
            <Link href="/problems">
              Continue solving
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        }
      />

      {/* Progress overview */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <div className="flex items-center gap-5 rounded-xl border bg-card p-5 shadow-xs">
          <ProgressRing value={solveRate}>
            <div className="text-center">
              <div className="text-xl font-semibold tabular-nums">{solveRate}%</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                solved
              </div>
            </div>
          </ProgressRing>
          <div className="min-w-0">
            <p className="font-medium">Your progress</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ve solved{" "}
              <span className="font-medium text-foreground tabular-nums">
                {stats.problems_solved}
              </span>{" "}
              of{" "}
              <span className="tabular-nums">{stats.total_available}</span>{" "}
              available problems.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Solved" value={stats.problems_solved} icon={CheckCircle2} tone="success" />
          <StatCard label="Attempted" value={stats.problems_attempted} icon={Target} tone="primary" />
          <StatCard label="Available" value={stats.total_available} icon={ListChecks} tone="sky" />
        </div>
      </div>

      {/* Courses */}
      <section>
        <SectionTitle
          action={
            courses.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/my-courses">View all</Link>
              </Button>
            )
          }
        >
          My courses
        </SectionTitle>
        {courses.length === 0 ? (
          <EmptyCard
            icon={BookOpen}
            title="No courses yet"
            description="Once your instructor or admin enrols you, your courses and progress will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const pct =
                course.total_problems > 0
                  ? (course.solved_problems / course.total_problems) * 100
                  : 0;
              return (
                <Link
                  key={`${course.id}-${course.section_id}`}
                  href={`/my-courses/${course.id}/problems`}
                  className="group rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <IconTile icon={BookOpen} tone="primary" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-medium">{course.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {course.section_name} · {course.semester_name}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium tabular-nums">
                        {course.solved_problems}/{course.total_problems}
                      </span>
                    </div>
                    <ProgressBar value={pct} label={`${course.name} progress`} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Enrollment */}
      {section && (
        <section>
          <SectionTitle>Enrollment</SectionTitle>
          <div className="grid grid-cols-1 divide-y rounded-xl border bg-card shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: UsersRound, label: "Section", value: section.section_name },
              { icon: CalendarRange, label: "Semester", value: section.semester_name },
              { icon: Building2, label: "Department", value: section.department_name },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 p-4">
                <IconTile icon={row.icon} tone="muted" className="size-8" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="truncate text-sm font-medium">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick actions */}
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
