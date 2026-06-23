import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { audit, listRecords, notify, updateRecord } from "@/lib/workflows";

export async function PATCH(request: Request) {
  const auth = await requireAction("events:approve");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const status = body.status === "Approved" ? "Approved" : body.status === "Rejected" ? "Rejected" : undefined;
    if (!status) return NextResponse.json({ message: "Invalid event status" }, { status: 400 });
    const eventToReview = (await listRecords("events")).find((event: any) => String(event.id) === String(body.id));
    if (!eventToReview) return NextResponse.json({ message: "Event not found" }, { status: 404 });
    if (auth.user.role === "hod" && eventToReview.department !== auth.user.department) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const event = await updateRecord("events", body.id, { status, reviewedBy: auth.user.campusId });
    await notify({ role: "student", title: `Event ${status}`, message: `${event.title} was ${status.toLowerCase()}.`, type: "event" });
    await audit({ actorCampusId: auth.user.campusId, action: `Event ${status.toLowerCase()}`, target: body.id, role: auth.user.role });
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to review event" }, { status: 400 });
  }
}
