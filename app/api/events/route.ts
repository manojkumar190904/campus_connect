import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { audit, createRecord, listRecords, notify } from "@/lib/workflows";

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const requestedStatus = url.searchParams.get("status") || undefined;
  const query: Record<string, string | undefined> = {};
  if (auth.user.role === "student" || auth.user.role === "faculty") {
    query.status = "Approved";
  } else {
    query.status = requestedStatus;
  }
  if (auth.user.role === "hod") query.department = auth.user.department;
  return NextResponse.json({ events: await listRecords("events", query) });
}

export async function POST(request: Request) {
  const auth = await requireAction("events:create");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const event = await createRecord("events", { ...body, createdBy: auth.user.campusId, department: auth.user.department, status: "Pending" });
    await notify({ role: "hod", title: "Event pending approval", message: `${event.title} needs approval.`, type: "event" });
    await audit({ actorCampusId: auth.user.campusId, action: "Event created", target: event.id, details: event.title, role: auth.user.role });
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create event" }, { status: 400 });
  }
}
