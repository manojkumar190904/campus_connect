import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { audit, listRecords, notify, updateRecord } from "@/lib/workflows";

export async function PATCH(request: Request) {
  const auth = await requireAction("leave:review");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const status = body.status === "Approved" ? "Approved" : body.status === "Rejected" ? "Rejected" : undefined;
    if (!status) return NextResponse.json({ message: "Invalid leave status" }, { status: 400 });
    const leaveToReview = (await listRecords("leaveRequests")).find((leave: any) => String(leave.id) === String(body.id));
    if (!leaveToReview) return NextResponse.json({ message: "Leave request not found" }, { status: 404 });
    if (auth.user.role === "hod" && leaveToReview.department !== auth.user.department) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const leave = await updateRecord("leaveRequests", body.id, { status, reviewedBy: auth.user.campusId, reviewComment: body.comment });
    await notify({ recipientCampusId: leave.requesterCampusId, title: `Leave ${status}`, message: `Your leave request was ${status.toLowerCase()}.`, type: "leave" });
    await audit({ actorCampusId: auth.user.campusId, action: `Leave ${status.toLowerCase()}`, target: body.id, role: auth.user.role });
    return NextResponse.json({ leave });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to review leave" }, { status: 400 });
  }
}
