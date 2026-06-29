import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { getUsers } from "@/lib/users";
import { listRecords } from "@/lib/workflows";

const fallbackStudents = [
  { campusId: "MCA2026001", name: "Rahul Sharma", email: "student@campus.test", role: "student", department: "MCA", semester: "2", section: "A" },
  { campusId: "MCA2026002", name: "MCA Student 002", email: "mca002@campus.test", role: "student", department: "MCA", semester: "2", section: "A" },
  { campusId: "MCA2026003", name: "MCA Student 003", email: "mca003@campus.test", role: "student", department: "MCA", semester: "2", section: "A" }
];

export async function GET(request: Request) {
  const auth = await requireRole(["faculty"]);
  if ("error" in auth) return auth.error;

  try {
    const url = new URL(request.url);
    const department = url.searchParams.get("department") || auth.user.department || "MCA";
    const semester = url.searchParams.get("semester") || "2";
    const section = url.searchParams.get("section") || "A";
    const search = (url.searchParams.get("search") || "").toLowerCase();
    const users = await getUsers();
    let students = users.filter((user: any) =>
      user.role === "student" &&
      String(user.department || "") === department &&
      String(user.semester || "") === semester &&
      String(user.section || "") === section
    );
    if (!students.length && department === "MCA" && semester === "2" && section === "A") students = fallbackStudents as any[];

    const attendanceRecords = await listRecords("attendanceRecords", { department, semester, section });
    const studentsWithAttendance = students
      .filter((student: any) => `${student.campusId} ${student.name}`.toLowerCase().includes(search))
      .map((student: any) => {
        const records = attendanceRecords.filter((record: any) => record.studentCampusId === student.campusId);
        const present = records.filter((record: any) => record.status === "present").length;
        return {
          campusId: student.campusId,
          name: student.name,
          email: student.email,
          department: student.department,
          semester: student.semester,
          section: student.section,
          attendancePercentage: records.length ? Math.round((present / records.length) * 100) : 0
        };
      });

    return NextResponse.json({ students: studentsWithAttendance });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load students" }, { status: 400 });
  }
}
