import { NextResponse } from "next/server";
import { requireAction } from "@/lib/auth-guard";
import { createUser, getUsers, type CampusRole } from "@/lib/users";
import { audit } from "@/lib/workflows";

export async function GET(request: Request) {
  const auth = await requireAction("users:create");
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const role = url.searchParams.get("role") ?? "all";
  const department = url.searchParams.get("department") ?? "all";
  const users = (await getUsers()).filter((user) => {
    const matchesQ = `${user.campusId} ${user.name} ${user.email}`.toLowerCase().includes(q);
    const matchesRole = role === "all" || user.role === role;
    const matchesDepartment = department === "all" || user.department === department;
    return matchesQ && matchesRole && matchesDepartment;
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const auth = await requireAction("users:create");
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const temporaryPassword = body.temporaryPassword || "Campus@123";
    const user = await createUser({
      campusId: String(body.campusId ?? "").trim().toUpperCase(),
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim().toLowerCase(),
      role: body.role as CampusRole,
      department: body.department,
      semester: body.semester,
      section: body.section,
      designation: body.designation,
      temporaryPassword,
      mustChangePassword: true
    });
    await audit({ actorCampusId: auth.user.campusId, action: "User created", target: user.campusId, details: user.role, role: auth.user.role });
    return NextResponse.json({ user, temporaryPassword });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create user" }, { status: 400 });
  }
}
