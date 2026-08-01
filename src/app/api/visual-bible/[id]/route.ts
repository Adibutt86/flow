import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const visualBible = await db.visualBible.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, visualBible });
  } catch (error: any) {
    console.error("PATCH /api/visual-bible/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update visual bible" },
      { status: 500 }
    );
  }
}
