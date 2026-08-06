import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        isMaster: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
    const sanitized = users.map((u: any) => {
      const { password, ...rest } = u;
      return {
        ...rest,
        hasPassword: Boolean(password),
      };
    });
    return NextResponse.json({ success: true, users: sanitized });
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
    const { name, email, password, isMaster } = body;

    if (!name && !email && !isMaster) {
      return NextResponse.json({ success: false, error: "Name or email is required" }, { status: 400 });
    }

    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : undefined;
    const cleanName = name ? name.trim() : (cleanEmail ? cleanEmail.split("@")[0] : "User");

    // Master account login
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
            password: password ? password.trim() : null,
          },
        });
      } else if (master.password) {
        if (!password || password.trim() !== master.password) {
          return NextResponse.json(
            { success: false, requiresPassword: true, error: "Incorrect password for Master Account" },
            { status: 401 }
          );
        }
      } else if (password && !master.password) {
        // Set password if none existed
        master = await db.user.update({
          where: { id: master.id },
          data: { password: password.trim() },
        });
      }
      return NextResponse.json({ success: true, user: master });
    }

    // Standard User Search / Creation
    let user = await db.user.findFirst({
      where: cleanEmail ? { email: cleanEmail } : { name: cleanName },
    });

    if (user) {
      if (user.password) {
        if (!password || password.trim() !== user.password) {
          return NextResponse.json(
            { success: false, requiresPassword: true, error: "Incorrect password for this account" },
            { status: 401 }
          );
        }
      } else if (password && !user.password) {
        user = await db.user.update({
          where: { id: user.id },
          data: { password: password.trim() },
        });
      }
    } else {
      user = await db.user.create({
        data: {
          name: cleanName,
          email: cleanEmail || null,
          isMaster: false,
          password: password ? password.trim() : null,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, newPassword, currentPassword } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 444 });
    }

    if (user.password && currentPassword && currentPassword.trim() !== user.password) {
      return NextResponse.json({ success: false, error: "Current password does not match" }, { status: 401 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { password: newPassword ? newPassword.trim() : null },
    });

    return NextResponse.json({ success: true, user: updated, message: newPassword ? "Password updated!" : "Password removed!" });
  } catch (error: any) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user password" },
      { status: 500 }
    );
  }
}
