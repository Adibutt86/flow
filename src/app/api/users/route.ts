import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to seed default users hassan and adi
async function seedDefaultUsers() {
  try {
    const hassan = await db.user.findFirst({
      where: { OR: [{ name: "hassan" }, { name: "Hassan" }] },
    });
    if (!hassan) {
      await db.user.create({
        data: {
          id: "usr_hassan_2000",
          name: "hassan",
          email: "hassan@flow.app",
          password: "hassan456",
          isMaster: false,
        },
      });
    } else if (hassan.password !== "hassan456") {
      await db.user.update({
        where: { id: hassan.id },
        data: { password: "hassan456" },
      });
    }

    const adi = await db.user.findFirst({
      where: { OR: [{ name: "adi" }, { name: "Adi" }] },
    });
    if (!adi) {
      await db.user.create({
        data: {
          id: "usr_adi_2026",
          name: "adi",
          email: "adi@flow.app",
          password: "flowapp2026",
          isMaster: false,
        },
      });
    } else if (adi.password !== "flowapp2026") {
      await db.user.update({
        where: { id: adi.id },
        data: { password: "flowapp2026" },
      });
    }
  } catch (e) {
    console.error("Error seeding default users hassan and adi:", e);
  }
}

export async function GET() {
  try {
    await seedDefaultUsers();

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
    await seedDefaultUsers();

    const body = await request.json();
    const { name, email, password, isMaster } = body;

    if (!name && !email && !isMaster) {
      return NextResponse.json({ success: false, error: "Name or email is required" }, { status: 400 });
    }

    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : undefined;
    const cleanName = name ? name.trim() : (cleanEmail ? cleanEmail.split("@")[0] : "User");
    const lowerName = cleanName.toLowerCase();

    // Specific password overrides for hassan & adi
    if (lowerName === "hassan") {
      if (!password || password.trim() !== "hassan456") {
        return NextResponse.json(
          { success: false, requiresPassword: true, error: "Incorrect password for Hassan" },
          { status: 401 }
        );
      }
    } else if (lowerName === "adi") {
      if (!password || password.trim() !== "flowapp2026") {
        return NextResponse.json(
          { success: false, requiresPassword: true, error: "Incorrect password for Adi" },
          { status: 401 }
        );
      }
    }

    // Master account login
    if (isMaster || cleanEmail === "master@flow.com" || (lowerName && lowerName.includes("master"))) {
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
      }
      return NextResponse.json({ success: true, user: master });
    }

    // Standard User Search / Creation
    let user = await db.user.findFirst({
      where: {
        OR: [
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          { name: { equals: cleanName } },
          { name: { equals: lowerName } }
        ]
      },
    });

    if (user) {
      if (user.password) {
        if (!password || password.trim() !== user.password) {
          return NextResponse.json(
            { success: false, requiresPassword: true, error: `Incorrect password for user '${user.name}'` },
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
      // Set default password if user is hassan or adi
      const initialPassword = lowerName === "hassan" ? "flowapp2000" : (lowerName === "adi" ? "flowapp2026" : (password ? password.trim() : null));

      user = await db.user.create({
        data: {
          name: cleanName,
          email: cleanEmail || `${lowerName}@flow.app`,
          isMaster: false,
          password: initialPassword,
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
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
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
