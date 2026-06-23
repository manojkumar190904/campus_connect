import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { audit, createRecord, listRecords, notify } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const query = auth.user.role === "student" ? { status: "Open" } : {};
  return NextResponse.json({ drives: await listRecords("placementDrives", query) });
}

export async function POST(request: Request) {
  const auth = await requireAction("placements:manage");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const drive = await createRecord("placementDrives", { ...body, createdBy: auth.user.campusId, status: body.status || "Open" });
    await notify({ role: "student", title: "Placement drive created", message: `${drive.companyName} is hiring for ${drive.role}.`, type: "placement" });
    await audit({ actorCampusId: auth.user.campusId, action: "Placement drive created", target: drive.id, details: drive.companyName, role: auth.user.role });
    return NextResponse.json({ drive });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create drive" }, { status: 400 });
  }
}
