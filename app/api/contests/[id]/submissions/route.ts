import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserContestSubmissions,
  recordContestSubmission,
  canUserAccessContest,
  isContestOpen,
} from "@/repository/contest.repository";

// GET /api/contests/[id]/submissions - Get user's submissions for a contest
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: contestId } = await params;
    const submissions = await getUserContestSubmissions(contestId, session.user.id);

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching contest submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contest submissions" },
      { status: 500 }
    );
  }
}

// POST /api/contests/[id]/submissions - Record a contest submission
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: contestId } = await params;
    const body = await req.json();
    const { problemId, isSolved } = body;

    if (!problemId) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    if (!(await canUserAccessContest(contestId, session.user.id))) {
      return NextResponse.json(
        { error: "You don't have access to this contest" },
        { status: 403 }
      );
    }

    if (!(await isContestOpen(contestId))) {
      return NextResponse.json(
        { error: "Contest is not open for submissions" },
        { status: 403 }
      );
    }

    const submission = await recordContestSubmission(
      contestId,
      session.user.id,
      problemId,
      isSolved === true
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Problem is not part of this contest" },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Error recording contest submission:", error);
    return NextResponse.json(
      { error: "Failed to record contest submission" },
      { status: 500 }
    );
  }
}
