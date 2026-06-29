import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireRole(["student"]);
  if ("error" in auth) return auth.error;

  try {
    const all = await listRecords("announcements");
    const announcements = all.filter((item: any) =>
      item.department === auth.user.department &&
      String(item.semester) === String(auth.user.semester) &&
      (String(item.section) === String(auth.user.section) || String(item.section).toLowerCase() === "all")
    );
    return NextResponse.json({ announcements });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load announcements" }, { status: 400 });
  }
}
