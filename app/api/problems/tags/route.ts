import { requireAuth } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";
import { getAllTags } from "@/repository/tag.repository";

export async function GET(){
  const authCheck = await requireAuth();
  if (authCheck instanceof NextResponse) return authCheck;

    const tags = await getAllTags();
    return new Response(JSON.stringify(tags), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}