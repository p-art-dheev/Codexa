import { requireRole } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getCoursesForSection } from "@/repository/section.repository";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  const { id } = await params;
  // Fetch courses for the given section ID from your database or service
  const courses = await getCoursesForSection(id);

  return new Response(JSON.stringify(courses), {
    headers: { "Content-Type": "application/json" },
  });
}
