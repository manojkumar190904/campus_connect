import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { updateUser } from "@/lib/users";
import { audit } from "@/lib/workflows";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAction("users:create");
  if ("error" in auth) return auth.error;
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await updateUser(id, body);
    await audit({ actorCampusId: auth.user.campusId, action: "User updated", target: id, details: Object.keys(body).join(", "), role: auth.user.role });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update user" }, { status: 400 });
  }
}
