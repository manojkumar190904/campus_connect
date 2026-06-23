import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { createRecord, listRecords } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("events:register");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const existing = (await listRecords("eventRegistrations", { eventId: body.eventId })).find((row: any) => row.studentCampusId === auth.user.campusId);
    const registration = existing || await createRecord("eventRegistrations", {
      eventId: body.eventId,
      studentCampusId: auth.user.campusId,
      studentName: auth.user.name || auth.user.campusId,
      qrPass: `EVT-${String(body.eventId).slice(-5)}-${auth.user.campusId}`
    });
    return NextResponse.json({ registration });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to register event" }, { status: 400 });
  }
}
