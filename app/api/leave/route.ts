import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { createRecord, listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const query: Record<string, string | undefined> = {};
  if (auth.user.role === "student" || auth.user.role === "faculty") {
    query.requesterCampusId = auth.user.campusId;
  } else if (auth.user.role === "hod") {
    query.department = auth.user.department;
  } else if (!["principal", "admin", "super_admin"].includes(auth.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ leaveRequests: await listRecords("leaveRequests", query) });
}

export async function POST(request: Request) {
  const auth = await requireAction("leave:create");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const leave = await createRecord("leaveRequests", {
      ...body,
      requesterCampusId: auth.user.campusId,
      requesterName: auth.user.name || auth.user.campusId,
      role: auth.user.role,
      department: auth.user.department,
      status: "Pending"
    });
    return NextResponse.json({ leave });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to apply leave" }, { status: 400 });
  }
}
