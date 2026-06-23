import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { listRecords } from "@/lib/workflows";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  const all = await listRecords("notifications");
  const notifications = all.filter((item: any) => item.recipientCampusId === auth.user.campusId || item.role === auth.user.role || !item.recipientCampusId && !item.role);
  return NextResponse.json({ notifications, unread: notifications.filter((item: any) => !item.read).length });
}
