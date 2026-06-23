import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  return NextResponse.json({ user: session.user });
}
