import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { audit, createRecord, listRecords, notify } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const query: Record<string, string | undefined> = {};
  if (auth.user.role === "student") {
    query.department = auth.user.department;
    query.semester = auth.user.semester;
    query.section = auth.user.section;
  } else if (auth.user.role === "faculty") {
    query.createdBy = auth.user.campusId;
  } else if (auth.user.role === "hod") {
    query.department = auth.user.department;
  }
  return NextResponse.json({ assignments: await listRecords("assignments", query) });
}

export async function POST(request: Request) {
  const auth = await requireAction("assignments:create");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const assignment = await createRecord("assignments", { ...body, department: body.department || auth.user.department, createdBy: auth.user.campusId });
    await notify({ role: "student", title: "Assignment created", message: `${assignment.title} is due on ${assignment.deadline}.`, type: "assignment" });
    await audit({ actorCampusId: auth.user.campusId, action: "Assignment created", target: assignment.id, details: assignment.title, role: auth.user.role });
    return NextResponse.json({ assignment });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create assignment" }, { status: 400 });
  }
}
