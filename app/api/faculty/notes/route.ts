import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireAction("notes:upload");
  if ("error" in auth) return auth.error;
  try {
    const notes = await listRecords("notes", { uploadedBy: auth.user.campusId });
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load notes" }, { status: 400 });
  }
}
