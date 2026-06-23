import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { bulkCreateStudents } from "@/lib/users";
import { audit } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("users:create");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const users = await bulkCreateStudents({
      department: body.department || "MCA",
      year: body.year || "2026",
      startRoll: Number(body.startRoll || 1),
      count: Number(body.count || 1),
      section: body.section || "A",
      semester: body.semester || "1",
      temporaryPassword: body.temporaryPassword || "Campus@123"
    });
    await audit({ actorCampusId: auth.user.campusId, action: "Bulk student IDs generated", target: body.department || "MCA", details: `${users.length} users`, role: auth.user.role });
    return NextResponse.json({ users, temporaryPassword: body.temporaryPassword || "Campus@123" });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to bulk create students" }, { status: 400 });
  }
}
