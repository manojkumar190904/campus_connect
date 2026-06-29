import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireRole(["student"]);
  if ("error" in auth) return auth.error;

  try {
    const assignments = await listRecords("assignments", {
      department: auth.user.department,
      semester: auth.user.semester,
      section: auth.user.section
    });
    return NextResponse.json({ assignments });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load assignments" }, { status: 400 });
  }
}
