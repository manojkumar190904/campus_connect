import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { scanAttendance } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("attendance:view:self");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const record = await scanAttendance(String(body.qrToken || ""), { campusId: auth.user.campusId, name: auth.user.name || auth.user.campusId, department: auth.user.department });
    return NextResponse.json({ record });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to scan attendance" }, { status: 400 });
  }
}
