import { requireAuth } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAllCourses } from "../../../../repository/course.repository";

export async function GET() {
  const authCheck = await requireAuth();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const result = await getAllCourses();
    if (result.status) {
      return NextResponse.json({ data: result.data });
    } else {
      return NextResponse.json(
        { error: "Failed to fetch courses" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}