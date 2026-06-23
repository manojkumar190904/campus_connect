import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guard";
import { listRecords, updateRecord } from "@/lib/workflows";

export async function PATCH(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const notificationToUpdate = (await listRecords("notifications")).find((notification: any) => String(notification.id) === String(body.id));
    if (!notificationToUpdate) return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    const canRead =
      notificationToUpdate.recipientCampusId === auth.user.campusId ||
      notificationToUpdate.role === auth.user.role ||
      (!notificationToUpdate.recipientCampusId && !notificationToUpdate.role);
    if (!canRead) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const notification = await updateRecord("notifications", body.id, { read: true });
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to mark notification" }, { status: 400 });
  }
}
