import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { audit, listRecords, updateRecord } from "@/lib/workflows";

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const query: Record<string, string | undefined> = { driveId: url.searchParams.get("driveId") || undefined };
  if (auth.user.role === "student") {
    query.studentCampusId = auth.user.campusId;
  } else if (!["placement_officer", "admin", "super_admin", "principal"].includes(auth.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ applications: await listRecords("placementApplications", query) });
}

export async function PATCH(request: Request) {
  const auth = await requireAction("placements:update-application");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const application = await updateRecord("placementApplications", body.id, { status: body.status });
    await audit({ actorCampusId: auth.user.campusId, action: "Placement status changed", target: body.id, details: body.status, role: auth.user.role });
    return NextResponse.json({ application });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update application" }, { status: 400 });
  }
}
