import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

const scheduleByIndex = ["Mon/Wed 10:00 AM", "Tue/Thu 11:30 AM", "Fri 02:00 PM"];

export async function GET() {
  const auth = await requireRole(["faculty"]);
  if ("error" in auth) return auth.error;

  try {
    const subjects = await listRecords("subjects", { facultyCampusId: auth.user.campusId });
    const classes = subjects.map((subject: any, index: number) => ({
      id: subject.id || subject.code,
      subject: subject.name,
      subjectCode: subject.code,
      department: subject.department,
      semester: subject.semester,
      section: subject.section || "A",
      schedule: subject.schedule || scheduleByIndex[index % scheduleByIndex.length],
      facultyCampusId: auth.user.campusId
    }));
    return NextResponse.json({ classes });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load classes" }, { status: 400 });
  }
}
