import { requireAuth, requireRole } from "@/lib/auth-helpers";
import { createProblemWithTestCases, deleteProblem, getProblemById } from "@/repository/problem.repository";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authCheck = await requireRole("admin", "faculty");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const user = await requireAuth();
    if (user instanceof Response) {
      return user;
    }

    const { courseId } = await params;
    const body = await req.json();
    const { title, description, testCases } = body;

    // Validate required fields
    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate test cases
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one test case is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate each test case
    for (const testCase of testCases) {
      if (!testCase.input || !testCase.output) {
        return new Response(
          JSON.stringify({ error: "Each test case must have input and output" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const problemData = {
      problemid: randomUUID(),
      title,
      description,
      created_by: user.id,
      course: courseId,
    };

    const problem = await createProblemWithTestCases(problemData, testCases);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Course-specific problem created successfully",
        data: problem,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating course-specific problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create course-specific problem" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authCheck = await requireRole("admin", "faculty");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const user = await requireAuth();
    if (user instanceof Response) {
      return user;
    }

    const { courseId } = await params;
    const body = await req.json();
    const { problemId } = body;

    if (!problemId) {
      return new Response(
        JSON.stringify({ error: "Problem ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only allow deleting problems that belong to this course
    const existing: any = await getProblemById(problemId);
    if (!existing || existing.course !== courseId) {
      return new Response(
        JSON.stringify({ error: "Problem not found in this course" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the course-specific problem entirely from the problems table
    // This will also cascade delete related test cases and other relationships
    const deletedProblem = await deleteProblem(problemId);

    if (!deletedProblem) {
      return new Response(
        JSON.stringify({ error: "Problem not found or could not be deleted" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Course-specific problem deleted successfully",
        data: deletedProblem,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting course-specific problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete course-specific problem" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}