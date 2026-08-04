import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Next.js 15 requires params to be awaited
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    const body = await request.json();
    const { isFavorite, videoFileName, socialContent, text } = body;

    const dataToUpdate: any = {};
    if (isFavorite !== undefined) dataToUpdate.isFavorite = isFavorite;
    if (videoFileName !== undefined) dataToUpdate.videoFileName = videoFileName;
    if (socialContent !== undefined) dataToUpdate.socialContent = JSON.stringify(socialContent);
    if (text !== undefined) dataToUpdate.text = text; // allow updating the idea text (optimizations)

    const updated = await db.idea.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, idea: {
      ...updated,
      socialContent: updated.socialContent ? JSON.parse(updated.socialContent) : undefined
    } });
  } catch (error: any) {
    console.error("PUT /api/ideas/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update idea" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    await db.idea.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/ideas/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete idea" },
      { status: 500 }
    );
  }
}
