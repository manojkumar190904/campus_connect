import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { getUsers } from "@/lib/users";
import { approveNote, listRecords, notify } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("notes:approve");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const status = body.status === "Approved" ? "Approved" : body.status === "Rejected" ? "Rejected" : undefined;
    if (!status) return NextResponse.json({ message: "Invalid note status" }, { status: 400 });
    const noteToReview = (await listRecords("notes")).find((note: any) => String(note.id) === String(body.noteId));
    if (!noteToReview) return NextResponse.json({ message: "Note not found" }, { status: 404 });
    if (auth.user.role === "hod" && noteToReview.department !== auth.user.department) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const note = await approveNote(body.noteId, status, auth.user.campusId, body.comment);
    if (status === "Approved") {
      const students = (await getUsers()).filter((user: any) =>
        user.role === "student" &&
        user.department === note.department &&
        String(user.semester) === String(note.semester) &&
        (!note.section || String(user.section) === String(note.section) || String(note.section).toLowerCase() === "all")
      );
      await Promise.all(students.map((student) => notify({
        recipientCampusId: student.campusId,
        role: "student",
        title: `New note available: ${note.title}`,
        message: `New note available: ${note.title}`,
        type: "notes"
      })));
    }
    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to review note" }, { status: 400 });
  }
}
