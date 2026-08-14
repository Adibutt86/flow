import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = await db.referenceCharacter.findUnique({ where: { id } });
    if (!character) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ character });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const character = await db.referenceCharacter.update({
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.referenceCharacter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/characters/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete character" },
      { status: 500 }
    );
  }
}
