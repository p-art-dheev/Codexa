import { requireAuth } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAllDepartments } from "@/repository/department.repository";

export async function GET(){
  const authCheck = await requireAuth();
  if (authCheck instanceof NextResponse) return authCheck;

    const departments = await getAllDepartments();
    return new Response(JSON.stringify(departments), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}