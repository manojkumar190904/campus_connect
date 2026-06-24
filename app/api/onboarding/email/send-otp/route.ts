import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmailOtp } from "@/lib/users";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.campusId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  try {
    const body = await request.json();
    const result = await sendEmailOtp(session.user.campusId, String(body.email ?? ""));
    return NextResponse.json({ user: result.user, demoOtp: result.demoOtp, message: "Demo OTP generated" });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to send OTP" }, { status: 400 });
  }
}
