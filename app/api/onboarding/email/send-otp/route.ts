import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmailOtp } from "@/lib/users";

export async function POST() {
  const session = await auth();
  if (!session?.user?.campusId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  try {
    const result = await sendEmailOtp(session.user.campusId);
    return NextResponse.json({ success: true, user: result.user, message: "OTP sent to saved email" });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to send OTP" }, { status: 400 });
  }
}
