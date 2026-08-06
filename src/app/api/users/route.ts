import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, isMaster } = body;

    if (!name && !email && !isMaster) {
      return NextResponse.json({ success: false, error: "Name or email is required" }, { status: 400 });
    }

    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : undefined;
    const cleanName = name ? name.trim() : (cleanEmail ? cleanEmail.split("@")[0] : "User");

    // Check if master requested
    if (isMaster || cleanEmail === "master@flow.com" || (cleanName && cleanName.toLowerCase().includes("master"))) {
      let master = await db.user.findFirst({
        where: { OR: [{ id: "master-user-id" }, { email: "master@flow.com" }] },
      });
      if (!master) {
        master = await db.user.create({
          data: {
            id: "master-user-id",
            name: "Master Account (Admin)",
            email: "master@flow.com",
            isMaster: true,
          },
        });
      }
      return NextResponse.json({ success: true, user: master });
    }

    // Existing user search by email or name
    let user = await db.user.findFirst({
      where: cleanEmail ? { email: cleanEmail } : { name: cleanName },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: cleanName,
          email: cleanEmail || null,
          isMaster: false,
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to login/create user" },
      { status: 500 }
    );
  }
}
