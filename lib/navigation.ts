import {
  BookMarked,
  Building2,
  CalendarRange,
  Code2,
  LayoutDashboard,
  Library,
  ListChecks,
  Trophy,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "faculty" | "student";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const ALL: Role[] = ["admin", "faculty", "student"];

export const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL },
      { label: "Problems", href: "/problems", icon: ListChecks, roles: ALL },
      { label: "Contests", href: "/contests", icon: Trophy, roles: ALL },
      { label: "My Courses", href: "/my-courses", icon: BookMarked, roles: ALL },
      { label: "Code Editor", href: "/editor", icon: Code2, roles: ALL },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/users", icon: Users, roles: ["admin"] },
      { label: "Departments", href: "/departments", icon: Building2, roles: ["admin"] },
      { label: "Semesters", href: "/semesters", icon: CalendarRange, roles: ["admin"] },
      { label: "Sections", href: "/sections", icon: UsersRound, roles: ["admin"] },
      { label: "Courses", href: "/courses", icon: Library, roles: ["admin"] },
    ],
  },
];

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  problems: "Problems",
  contests: "Contests",
  "my-courses": "My Courses",
  editor: "Code Editor",
  users: "Users",
  departments: "Departments",
  semesters: "Semesters",
  sections: "Sections",
  courses: "Courses",
  create: "Create",
  edit: "Edit",
  leaderboard: "Leaderboard",
  take: "Attempt",
};

/** Turns `/contests/12/leaderboard` into labelled breadcrumb crumbs. */
export function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    const known = segmentLabels[part];
    const label =
      known ??
      (/^\d+$/.test(part)
        ? `#${part}`
        : part.length > 16
          ? "Details"
          : decodeURIComponent(part).replace(/-/g, " "));
    return { href, label, isLast: i === parts.length - 1 };
  });
}
