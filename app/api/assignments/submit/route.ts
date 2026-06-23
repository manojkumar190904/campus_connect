import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { createRecord, listRecords } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("assignments:submit");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const existing = (await listRecords("assignmentSubmissions", { assignmentId: body.assignmentId })).find((row: any) => row.studentCampusId === auth.user.campusId);
    const submission = existing || await createRecord("assignmentSubmissions", {
      assignmentId: body.assignmentId,
      studentCampusId: auth.user.campusId,
      studentName: auth.user.name || auth.user.campusId,
      fileUrl: body.fileUrl,
      link: body.link,
      status: "Submitted"
    });
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to submit assignment" }, { status: 400 });
  }
}
