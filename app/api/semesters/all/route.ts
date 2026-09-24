import { requireAuth } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAllSemesters } from "@/repository/semester.repository";

export async function GET(){
  const authCheck = await requireAuth();
  if (authCheck instanceof NextResponse) return authCheck;

    const semesters = await getAllSemesters();
    return new Response(JSON.stringify(semesters), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}