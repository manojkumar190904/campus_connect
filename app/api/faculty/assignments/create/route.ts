import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { getUsers } from "@/lib/users";
import { audit, createRecord, notify } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("assignments:create");
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const required = ["title", "subject", "semester", "section", "deadline", "instructions"];
    const missing = required.find((key) => !body[key]);
    if (missing) return NextResponse.json({ message: `${missing} is required` }, { status: 400 });

    const department = body.department || auth.user.department || "MCA";
    const assignment = await createRecord("assignments", {
      title: body.title,
      subject: body.subject,
      department,
      semester: body.semester,
      section: body.section,
      deadline: body.deadline,
      instructions: body.instructions,
      attachmentUrl: body.attachmentUrl,
      attachmentName: body.attachmentName,
      createdBy: auth.user.campusId
    });

    const students = (await getUsers()).filter((user: any) =>
      user.role === "student" &&
      user.department === department &&
      String(user.semester) === String(body.semester) &&
      String(user.section) === String(body.section)
    );
    await Promise.all(students.map((student) => notify({
      recipientCampusId: student.campusId,
      role: "student",
      title: "Assignment created",
      message: `${assignment.title} is due on ${assignment.deadline}.`,
      type: "assignment"
    })));
    await audit({ actorCampusId: auth.user.campusId, action: "Assignment created", target: assignment.id, details: assignment.title, role: auth.user.role });

    return NextResponse.json({ assignment, notified: students.length });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create assignment" }, { status: 400 });
  }
}
