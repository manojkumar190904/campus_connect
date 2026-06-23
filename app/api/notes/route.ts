import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { audit, createRecord, listRecords, notify } from "@/lib/workflows";

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const requestedStatus = url.searchParams.get("status") || "Approved";
  const status = auth.user.role === "student" ? "Approved" : requestedStatus;
  const query: Record<string, string | undefined> = { status: status === "all" ? undefined : status };
  if (auth.user.role === "student") {
    query.department = auth.user.department;
    query.semester = auth.user.semester;
  } else if (auth.user.role === "hod") {
    query.department = auth.user.department;
  } else if (auth.user.role === "faculty") {
    query.uploadedBy = auth.user.campusId;
  }
  return NextResponse.json({ notes: await listRecords("notes", query) });
}

export async function POST(request: Request) {
  const auth = await requireAction("notes:upload");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const note = await createRecord("notes", { ...body, department: body.department || auth.user.department, uploadedBy: auth.user.campusId, status: "Pending", fileUrl: body.fileUrl || "/mock/local-note.txt" });
    await notify({ role: "hod", title: "Note pending approval", message: `${note.title} is waiting for review.`, type: "notes" });
    await audit({ actorCampusId: auth.user.campusId, action: "Note uploaded", target: note.id, details: note.title, role: auth.user.role });
    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to upload note" }, { status: 400 });
  }
}
