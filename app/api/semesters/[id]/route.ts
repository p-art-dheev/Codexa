import { requireAuth } from "@/lib/auth-helpers";
import { getSemesterById } from "@/repository/semester.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await requireAuth();
  if (authCheck instanceof NextResponse) return authCheck;

    const { id } = await params;
    console.log(id);
    const semester = await getSemesterById(id);
    return NextResponse.json(semester, { status: 200 });
}
