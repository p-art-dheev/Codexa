import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export type Role = "admin" | "faculty" | "student";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Require a signed-in user whose role is one of `roles`.
 * Returns the user, or a 401/403 NextResponse that the route should return as-is:
 *
 *   const user = await requireRole("admin");
 *   if (user instanceof NextResponse) return user;
 */
export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  if (!roles.includes(user.role as Role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
