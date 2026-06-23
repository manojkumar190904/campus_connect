import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { createAttendanceSession, markAttendance } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("attendance:mark");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const result = Array.isArray(body.records) && body.records.length
      ? await markAttendance(body, auth.user.campusId)
      : await createAttendanceSession(body, auth.user.campusId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to save attendance" }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  return NextResponse.json({ message: "Use POST to create attendance or QR session" });
}
