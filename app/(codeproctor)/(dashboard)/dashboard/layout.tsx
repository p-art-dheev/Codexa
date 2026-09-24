import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { StatusScreen } from "@/components/status-screen";
import { SignInButton } from "@/components/action-buttons";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  admin: ReactNode;
  faculty: ReactNode;
  student: ReactNode;
}

export default async function DashboardLayout({
  admin,
  faculty,
  student,
}: DashboardLayoutProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return (
      <StatusScreen
        kind="auth"
        title="Sign in to see your dashboard"
        description="Use your university Google account to continue."
        action={<SignInButton callbackUrl="/dashboard" />}
      />
    );
  }

  // Render the appropriate dashboard based on user role
  if (user.role === "admin") return <>{admin}</>;
  if (user.role === "faculty") return <>{faculty}</>;
  if (user.role === "student") return <>{student}</>;

  return (
    <StatusScreen
      kind="forbidden"
      title="No dashboard for this role"
      description={`Your role (${user.role ?? "unknown"}) does not have a dashboard yet. Contact an administrator to update your access.`}
    />
  );
}
