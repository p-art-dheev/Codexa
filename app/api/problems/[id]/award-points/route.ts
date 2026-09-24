import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { awardPointsForProblem } from "@/repository/problem.repository";

const PROBLEM_POINTS = 100;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { id } = await params;
  // Points are fixed server-side; the client-sent value is ignored.
  const points = PROBLEM_POINTS;

  try {
    const result = await awardPointsForProblem(user.id, id, points);
    console.log('award-points result for user', user.id, 'problem', id, ':', result);
    return NextResponse.json({ success: true, awarded: result.awarded, totalPoints: result.totalPoints });
  } catch (error) {
    console.error('Error in award-points route:', error);
    return NextResponse.json({ error: 'Failed to award points', details: (error as any)?.message || String(error) }, { status: 500 });
  }
}
