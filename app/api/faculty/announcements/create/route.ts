import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { getUsers } from "@/lib/users";
import { audit, createRecord, notify } from "@/lib/workflows";

function matchesStudent(user: any, department: string, semester: string, section: string) {
  return user.role === "student" &&
    String(user.department || "") === department &&
    String(user.semester || "") === semester &&
    (section === "all" || String(user.section || "") === section);
}

export async function POST(request: Request) {
  const auth = await requireRole(["faculty"]);
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const message = String(form.get("message") || "").trim();
    const category = String(form.get("category") || "Academic").trim();
    const department = String(form.get("department") || auth.user.department || "MCA").trim();
    const semester = String(form.get("semester") || "").trim();
    const section = String(form.get("section") || "A").trim();
    const priority = String(form.get("priority") || "Normal").trim();
    const attachment = form.get("attachment");

    if (!title || !message || !department || !semester || !section) {
      return NextResponse.json({ message: "Title, message, department, semester and section are required" }, { status: 400 });
    }

    const file = attachment instanceof File ? attachment : null;
    const announcement = await createRecord("announcements", {
      title,
      message,
      category,
      department,
      semester,
      section,
      priority,
      attachmentName: file?.name,
      attachmentUrl: file ? `/mock/${encodeURIComponent(file.name)}` : undefined,
      createdBy: auth.user.campusId,
      status: "Published"
    });

    const students = (await getUsers()).filter((user) => matchesStudent(user, department, semester, section));
    await Promise.all(students.map((student) => notify({
      recipientCampusId: student.campusId,
      role: "student",
      title,
      message,
      type: "announcement"
    })));
    await audit({ actorCampusId: auth.user.campusId, action: "Announcement published", target: announcement.id, details: title, role: auth.user.role });

    return NextResponse.json({ announcement, notified: students.length, message: "Announcement published and notifications sent to students." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to publish announcement" }, { status: 400 });
  }
}
