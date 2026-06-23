import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { audit, updateRecord } from "@/lib/workflows";

export async function PATCH(request: Request) {
  const auth = await requireAction("assignments:grade");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const submission = await updateRecord("assignmentSubmissions", body.id, { status: "Graded", grade: body.grade, feedback: body.feedback });
    await audit({ actorCampusId: auth.user.campusId, action: "Assignment graded", target: body.id, details: body.grade, role: auth.user.role });
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to grade assignment" }, { status: 400 });
  }
}
