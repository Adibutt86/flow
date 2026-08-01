import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const character = await db.character.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, character });
  } catch (error: any) {
    console.error("PATCH /api/characters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update character" },
      { status: 500 }
    );
  }
}
