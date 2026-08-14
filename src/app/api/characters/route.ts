import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request) {
  try {
    const characters = await db.referenceCharacter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ characters });
  } catch (error: any) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch characters" },
      { status: 500 }
    );
  }
}
