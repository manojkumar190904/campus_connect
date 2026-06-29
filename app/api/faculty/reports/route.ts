import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireRole(["faculty"]);
  if ("error" in auth) return auth.error;

  try {
    const [sessions, records, notes, announcements, assignments] = await Promise.all([
      listRecords("attendanceSessions", { facultyCampusId: auth.user.campusId }),
      listRecords("attendanceRecords", { markedBy: auth.user.campusId }),
      listRecords("notes", { uploadedBy: auth.user.campusId }),
      listRecords("announcements", { createdBy: auth.user.campusId }),
      listRecords("assignments", { createdBy: auth.user.campusId })
    ]);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const attendanceMarkedThisWeek = sessions.filter((session: any) => new Date(session.date || session.createdAt).getTime() >= weekAgo).length;
    const grouped = Object.values(records.reduce((acc: Record<string, any>, record: any) => {
      acc[record.studentCampusId] ??= { studentCampusId: record.studentCampusId, studentName: record.studentName, total: 0, present: 0 };
      acc[record.studentCampusId].total += 1;
      if (record.status === "present") acc[record.studentCampusId].present += 1;
      return acc;
    }, {})).map((row: any) => ({ ...row, percentage: row.total ? Math.round((row.present / row.total) * 100) : 0 }));

    return NextResponse.json({
      report: {
        attendanceMarkedThisWeek,
        notesUploaded: notes.length,
        announcementsPosted: announcements.length,
        assignmentsCreated: assignments.length,
        lowAttendanceStudents: grouped.filter((row: any) => row.percentage < 75)
      }
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load reports" }, { status: 400 });
  }
}
