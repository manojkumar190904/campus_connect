import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { canPerformAction } from "@/lib/role-access";
import { listRecords } from "@/lib/workflows";

export async function GET(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!canPerformAction(auth.user.role, "attendance:view:department") && !canPerformAction(auth.user.role, "attendance:view:college")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const url = new URL(request.url);
  const department = canPerformAction(auth.user.role, "attendance:view:college")
    ? url.searchParams.get("department") || auth.user.department || "MCA"
    : auth.user.department || "MCA";
  const query = {
    department,
    semester: url.searchParams.get("semester") || undefined,
    section: url.searchParams.get("section") || undefined,
    subject: url.searchParams.get("subject") || undefined
  };
  const records = await listRecords("attendanceRecords", query);
  const grouped = Object.values(records.reduce((acc: Record<string, any>, record: any) => {
    acc[record.studentCampusId] ??= { studentCampusId: record.studentCampusId, studentName: record.studentName, total: 0, present: 0 };
    acc[record.studentCampusId].total += 1;
    if (record.status === "present") acc[record.studentCampusId].present += 1;
    return acc;
  }, {})).map((row: any) => ({ ...row, percentage: row.total ? Math.round((row.present / row.total) * 100) : 0 }));
  return NextResponse.json({ records, students: grouped, lowAttendance: grouped.filter((row: any) => row.percentage < 75) });
}
