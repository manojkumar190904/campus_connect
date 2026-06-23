import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { changePassword, rolePortal, validateStrongPassword } from "@/lib/users";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.campusId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  const body = await request.json();
  if (!body.newPassword || body.newPassword !== body.confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }
  if (!validateStrongPassword(body.newPassword)) {
    return NextResponse.json({ message: "Password must be 8+ chars with uppercase, lowercase, number and special character" }, { status: 400 });
  }
  const user = await changePassword(session.user.campusId, body.newPassword);
  return NextResponse.json({ user, redirectTo: rolePortal(user.role) });
}
