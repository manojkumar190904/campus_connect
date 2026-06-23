import type { CampusRole } from "@/lib/users";

export const roleHome: Record<CampusRole, string> = {
  student: "/portal/student",
  faculty: "/portal/faculty",
  hod: "/portal/hod",
  principal: "/portal/principal",
  admin: "/portal/admin",
  super_admin: "/portal/admin",
  placement_officer: "/portal/placement"
};

export const rolePermissions: Record<CampusRole, string[]> = {
  student: ["attendance:read:self", "notes:read", "placements:apply", "events:register", "assignments:submit", "leave:create", "fees:read:self"],
  faculty: ["attendance:mark", "notes:create", "assignments:create", "assignments:grade", "leave:create", "events:create"],
  hod: ["department:read", "attendance:read:department", "notes:approve", "leave:approve:department", "events:approve"],
  principal: ["college:analytics", "attendance:read:college", "placements:analytics", "leave:read:all", "events:approve"],
  admin: ["admin:manage"],
  super_admin: ["admin:manage", "super:manage"],
  placement_officer: ["placements:manage", "placements:analytics"]
};

export function rolePortal(role: CampusRole) {
  return roleHome[role];
}

export function can(role: CampusRole | undefined, permission: string) {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || rolePermissions[role]?.includes("admin:manage") || role === "super_admin";
}

export function canAccessPortal(role: CampusRole | undefined, portal: string) {
  if (!role) return false;
  if (portal === "admin") return role === "admin" || role === "super_admin";
  if (portal === "placement") return role === "placement_officer" || role === "admin" || role === "super_admin";
  if (portal === "principal") return role === "principal" || role === "admin" || role === "super_admin";
  if (portal === "hod") return role === "hod" || role === "principal" || role === "admin" || role === "super_admin";
  if (portal === "faculty") return role === "faculty" || role === "hod" || role === "principal" || role === "admin" || role === "super_admin";
  return portal === role;
}
