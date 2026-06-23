import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { applyPlacement } from "@/lib/workflows";

export async function POST(request: Request) {
  const auth = await requireAction("placements:apply");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const application = await applyPlacement(String(body.driveId), { campusId: auth.user.campusId, name: auth.user.name || auth.user.campusId }, body.resumeUrl);
    return NextResponse.json({ application });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to apply" }, { status: 400 });
  }
}
