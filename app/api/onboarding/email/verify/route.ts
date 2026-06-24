import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyEmailOtp } from "@/lib/users";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.campusId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  try {
    const body = await request.json();
    const user = await verifyEmailOtp(session.user.campusId, String(body.otp ?? ""));
    return NextResponse.json({ user, message: "Email verified" });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to verify email" }, { status: 400 });
  }
}
