import { requireRole } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAllTestCases } from "@/repository/testcases.repository";

export async function GET(){
  const authCheck = await requireRole("admin", "faculty");
  if (authCheck instanceof NextResponse) return authCheck;

    const testcases = await getAllTestCases();
    return new Response(JSON.stringify(testcases), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}


