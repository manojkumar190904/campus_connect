import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { seedDemoUsers } from "@/lib/users";
import { seedWorkflowData } from "@/lib/workflows";

async function canSeedDemoData() {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.SEED_DEMO_ENABLED === "true") return true;
  const session = await auth();
  return session?.user?.role === "admin" || session?.user?.role === "super_admin";
}

async function seed() {
  try {
    if (!await canSeedDemoData()) {
      return NextResponse.json({ success: false, message: "Demo seed is disabled in production" }, { status: 403 });
    }
    const users = await seedDemoUsers();
    await seedWorkflowData();
    return NextResponse.json({ success: true, mode: users.mode });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to seed demo users" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return seed();
}

export async function POST() {
  return seed();
}
