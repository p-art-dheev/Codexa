import { requireRole } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAssignedFacultyForACourse } from "@/repository/section.repository";

// GET: Get assigned faculty for a specific course-section combination
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string; courseId: string }> }
) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { id: sectionId, courseId } = await params;
    
    const result = await getAssignedFacultyForACourse(courseId, sectionId);
    
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching assigned faculty:", error);
    return new Response(
      JSON.stringify({ status: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}