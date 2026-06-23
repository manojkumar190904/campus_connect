import { NextResponse } from "next/server";
import { requireAction, requireUser } from "@/lib/auth-guard";
import { createRecord, listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  if (!["student", "principal", "admin", "super_admin"].includes(auth.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const fees = await listRecords("fees", auth.user.role === "student" ? { studentCampusId: auth.user.campusId } : {});
  return NextResponse.json({ fees });
}

export async function POST(request: Request) {
  const auth = await requireAction("fees:create");
  if ("error" in auth) return auth.error;
  try {
    const fee = await createRecord("fees", await request.json());
    return NextResponse.json({ fee });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to save fee" }, { status: 400 });
  }
}
