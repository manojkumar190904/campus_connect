import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { markAttendance } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("attendance:mark");
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const required = ["department", "semester", "section", "subject", "subjectCode", "date"];
    const missing = required.find((key) => !body[key]);
    if (missing) return NextResponse.json({ message: `${missing} is required` }, { status: 400 });
    if (!Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json({ message: "At least one student record is required" }, { status: 400 });
    }
    const invalid = body.records.find((record: any) => !record.studentCampusId || !record.studentName || !["present", "absent"].includes(record.status));
    if (invalid) return NextResponse.json({ message: "Each record needs campus ID, name and present/absent status" }, { status: 400 });
    const result = await markAttendance(body, auth.user.campusId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to save attendance" }, { status: 400 });
  }
}
