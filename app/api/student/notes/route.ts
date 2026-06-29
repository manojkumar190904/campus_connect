import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireRole(["student"]);
  if ("error" in auth) return auth.error;

  try {
    const notes = await listRecords("notes", {
      status: "Approved",
      department: auth.user.department,
      semester: auth.user.semester
    });
    return NextResponse.json({ notes: notes.filter((note: any) => !note.section || note.section === auth.user.section || String(note.section).toLowerCase() === "all") });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load notes" }, { status: 400 });
  }
}
