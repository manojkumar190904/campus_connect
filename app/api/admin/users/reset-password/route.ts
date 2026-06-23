import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { resetPassword } from "@/lib/users";
import { audit } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("users:reset-password");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const temporaryPassword = body.temporaryPassword || "Campus@123";
    const user = await resetPassword(body.campusId, temporaryPassword);
    await audit({ actorCampusId: auth.user.campusId, action: "Password reset", target: user.campusId, role: auth.user.role });
    return NextResponse.json({ user, temporaryPassword });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to reset password" }, { status: 400 });
  }
}
