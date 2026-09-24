import type { ReactNode } from "react";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { StatusScreen } from "@/components/status-screen";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return (
      <StatusScreen
        kind="auth"
        title="Sign in required"
        description="Please sign in with your university Google account to continue."
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <StatusScreen
        kind="forbidden"
        title="Admins only"
        description="This area is restricted to administrators. If you think you should have access, contact your department admin — or switch to an admin account from the account menu."
      />
    );
  }

  return <div className="flex flex-1 flex-col">{children}</div>;
}
