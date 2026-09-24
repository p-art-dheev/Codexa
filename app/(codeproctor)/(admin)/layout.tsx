import type { ReactNode } from "react";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getAuthenticatedUser();

  if (user?.role !== "admin") {
    return (
      <div>
        <h1>Unauthorised Access. Prohibited entry into site.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
