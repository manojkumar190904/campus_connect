import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { canPerformAction, type RoleAction } from "@/lib/role-access";
import type { CampusRole } from "@/lib/users";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.campusId) {
    return { error: NextResponse.json({ message: "Unauthenticated" }, { status: 401 }) as NextResponse };
  }
  return { session, user: session.user as typeof session.user & { campusId: string; name?: string | null; role: CampusRole; department?: string; semester?: string; section?: string } };
}

export async function requirePermission(permission: string) {
  const result = await requireUser();
  if ("error" in result) return result;
  if (!can(result.user.role, permission)) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) as NextResponse };
  }
  return result;
}

export async function requireAction(action: RoleAction) {
  const result = await requireUser();
  if ("error" in result) return result;
  if (!canPerformAction(result.user.role, action)) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) as NextResponse };
  }
  return result;
}

export async function requireRole(roles: CampusRole[]) {
  const result = await requireUser();
  if ("error" in result) return result;
  if (!roles.includes(result.user.role)) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) as NextResponse };
  }
  return result;
}
