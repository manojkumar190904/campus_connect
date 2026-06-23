import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { canPerformAction } from "@/lib/role-access";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!canPerformAction(auth.user.role, "attendance:view:self")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const records = await listRecords("attendanceRecords", { studentCampusId: auth.user.campusId });
  const subjects = Object.values(records.reduce((acc: Record<string, any>, record: any) => {
    acc[record.subject] ??= { subject: record.subject, total: 0, present: 0 };
    acc[record.subject].total += 1;
    if (record.status === "present") acc[record.subject].present += 1;
    return acc;
  }, {})).map((row: any) => ({ ...row, percentage: row.total ? Math.round((row.present / row.total) * 100) : 0 }));
  const total = records.length ? Math.round((records.filter((row: any) => row.status === "present").length / records.length) * 100) : 0;
  return NextResponse.json({ records, subjects, total, warning: total < 75 });
}
