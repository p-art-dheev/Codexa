import { requireRole } from "@/lib/auth-helpers";
import { NextRequest, NextResponse } from "next/server";
import {
  getSectionsWithPagination,
  createSection,
  deleteSection,
  editSection,
} from "@/repository/section.repository";

export async function GET(req: NextRequest) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "section_name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const result = await getSectionsWithPagination(
      page,
      pageSize,
      search,
      sortBy,
      sortOrder
    );
    console.log(result);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch sections" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const newSection = await req.json();
    const result = await createSection(newSection);
    if (result) {
      return new Response(JSON.stringify({ status: "success" }), {
        status: 201,
      });
    } else {
      return new Response(JSON.stringify({ status: "error" }), { status: 500 });
    }
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify(e), { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const updatedSection = await req.json();
    const result = await editSection(updatedSection);
    if (result) {
      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ status: "error" }), { status: 500 });
    }
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify(e), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authCheck = await requireRole("admin");
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { id } = await req.json();
    const result = await deleteSection(id);
    if (result) {
      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ status: "error" }), { status: 500 });
    }
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify(e), { status: 500 });
  }
}
