import type { CampusRole } from "@/lib/users";

export type RoleAction =
  | "attendance:mark"
  | "attendance:view:self"
  | "attendance:view:department"
  | "attendance:view:college"
  | "notes:upload"
  | "notes:approve"
  | "notes:download"
  | "users:create"
  | "users:reset-password"
  | "placements:manage"
  | "placements:apply"
  | "placements:update-application"
  | "events:register"
  | "events:approve"
  | "events:create"
  | "assignments:create"
  | "assignments:submit"
  | "assignments:grade"
  | "leave:create"
  | "leave:review"
  | "fees:create"
  | "reports:view:college";

export type RoleMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

const roleHome: Record<CampusRole, string> = {
  student: "/portal/student",
  faculty: "/portal/faculty",
  hod: "/portal/hod",
  principal: "/portal/principal",
  admin: "/portal/admin",
  super_admin: "/portal/admin",
  placement_officer: "/portal/placement"
};

const roleMenus: Record<CampusRole, RoleMenuItem[]> = {
  student: [
    { id: "student-dashboard", label: "Dashboard", href: "/portal/student", icon: "Home" },
    { id: "student-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "student-id-card", label: "Digital ID Card", href: "/portal/student/id-card", icon: "UserRound" },
    { id: "student-scan-attendance", label: "Scan Attendance", href: "/portal/student/scan-attendance", icon: "QrCode" },
    { id: "student-notes", label: "Notes", href: "/portal/student/notes", icon: "FileText" },
    { id: "student-attendance", label: "Attendance", href: "/portal/student/attendance", icon: "CheckCircle2" },
    { id: "student-placement-eligibility", label: "Placement Eligibility", href: "/portal/student/placement-eligibility", icon: "Trophy" },
    { id: "student-events", label: "Events", href: "/events", icon: "CalendarDays" },
    { id: "student-placements", label: "Placements", href: "/placements", icon: "BriefcaseBusiness" },
    { id: "student-clubs", label: "Clubs", href: "/clubs", icon: "UsersRound" },
    { id: "student-lost-found", label: "Lost & Found", href: "/lost-found", icon: "PackageSearch" },
    { id: "student-marketplace", label: "Marketplace", href: "/marketplace", icon: "ShoppingBag" },
    { id: "student-resume", label: "Resume", href: "/resume", icon: "BookOpen" },
    { id: "student-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  faculty: [
    { id: "faculty-dashboard", label: "Faculty Dashboard", href: "/portal/faculty", icon: "Home" },
    { id: "faculty-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "faculty-qr-attendance", label: "QR Attendance", href: "/portal/faculty/qr-attendance", icon: "QrCode" },
    { id: "faculty-attendance", label: "Mark Attendance", href: "/portal/faculty/attendance", icon: "ClipboardCheck" },
    { id: "faculty-notes", label: "Upload Notes", href: "/portal/faculty/notes", icon: "Upload" },
    { id: "faculty-assignments", label: "Assignments", href: "/assignments", icon: "ClipboardCheck" },
    { id: "faculty-announcements", label: "Announcements", href: "/announcements", icon: "Megaphone" },
    { id: "faculty-events", label: "Events", href: "/events", icon: "CalendarDays" },
    { id: "faculty-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  hod: [
    { id: "hod-dashboard", label: "HOD Dashboard", href: "/portal/hod", icon: "Home" },
    { id: "hod-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "hod-attendance", label: "Attendance Reports", href: "/portal/hod/attendance", icon: "ClipboardCheck" },
    { id: "hod-notes-approval", label: "Notes Approval", href: "/portal/hod/notes-approval", icon: "FileText" },
    { id: "hod-assignments", label: "Assignments", href: "/assignments", icon: "ClipboardCheck" },
    { id: "hod-notices", label: "Department Notices", href: "/announcements", icon: "Megaphone" },
    { id: "hod-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  principal: [
    { id: "principal-dashboard", label: "Principal Dashboard", href: "/portal/principal", icon: "Home" },
    { id: "principal-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "principal-attendance", label: "Attendance Analytics", href: "/portal/principal/attendance", icon: "ClipboardCheck" },
    { id: "principal-event-approvals", label: "Event Approvals", href: "/events", icon: "CalendarDays" },
    { id: "principal-notices", label: "Notices", href: "/announcements", icon: "Megaphone" },
    { id: "principal-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  admin: [
    { id: "admin-dashboard", label: "Admin Dashboard", href: "/portal/admin", icon: "Home" },
    { id: "admin-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "admin-users", label: "User Management", href: "/portal/admin/users", icon: "UsersRound" },
    { id: "admin-bulk-students", label: "Bulk Student Generator", href: "/portal/admin/bulk-students", icon: "GraduationCap" },
    { id: "admin-placements", label: "Placements", href: "/placements", icon: "BriefcaseBusiness" },
    { id: "admin-events", label: "Events", href: "/events", icon: "CalendarDays" },
    { id: "admin-notices", label: "Notices", href: "/announcements", icon: "Megaphone" },
    { id: "admin-audit-logs", label: "Audit Logs", href: "/portal/admin/audit-logs", icon: "ShieldCheck" },
    { id: "admin-demo-mode", label: "Demo Mode", href: "/portal/admin/demo-mode", icon: "Sparkles" },
    { id: "admin-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  super_admin: [
    { id: "super-admin-dashboard", label: "Admin Dashboard", href: "/portal/admin", icon: "Home" },
    { id: "super-admin-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "super-admin-users", label: "User Management", href: "/portal/admin/users", icon: "UsersRound" },
    { id: "super-admin-bulk-students", label: "Bulk Student Generator", href: "/portal/admin/bulk-students", icon: "GraduationCap" },
    { id: "super-admin-placements", label: "Placements", href: "/placements", icon: "BriefcaseBusiness" },
    { id: "super-admin-events", label: "Events", href: "/events", icon: "CalendarDays" },
    { id: "super-admin-notices", label: "Notices", href: "/announcements", icon: "Megaphone" },
    { id: "super-admin-audit-logs", label: "Audit Logs", href: "/portal/admin/audit-logs", icon: "ShieldCheck" },
    { id: "super-admin-demo-mode", label: "Demo Mode", href: "/portal/admin/demo-mode", icon: "Sparkles" },
    { id: "super-admin-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ],
  placement_officer: [
    { id: "placement-dashboard", label: "Placement Dashboard", href: "/portal/placement", icon: "Home" },
    { id: "placement-assistant", label: "AI Assistant", href: "/assistant", icon: "Sparkles" },
    { id: "placement-drives", label: "Drives", href: "/placements", icon: "BriefcaseBusiness" },
    { id: "placement-applications", label: "Applications", href: "/portal/placement/applications", icon: "FileText" },
    { id: "placement-settings", label: "Settings", href: "/settings", icon: "Settings" }
  ]
};

const actionRoles: Record<RoleAction, CampusRole[]> = {
  "attendance:mark": ["faculty"],
  "attendance:view:self": ["student"],
  "attendance:view:department": ["hod"],
  "attendance:view:college": ["principal"],
  "notes:upload": ["faculty"],
  "notes:approve": ["hod"],
  "notes:download": ["student"],
  "users:create": ["admin", "super_admin"],
  "users:reset-password": ["admin", "super_admin"],
  "placements:manage": ["placement_officer", "admin", "super_admin"],
  "placements:apply": ["student"],
  "placements:update-application": ["placement_officer", "admin", "super_admin"],
  "events:register": ["student"],
  "events:approve": ["principal", "hod", "admin", "super_admin"],
  "events:create": ["faculty", "admin", "super_admin"],
  "assignments:create": ["faculty", "admin", "super_admin"],
  "assignments:submit": ["student"],
  "assignments:grade": ["faculty", "admin", "super_admin"],
  "leave:create": ["student", "faculty"],
  "leave:review": ["hod", "admin", "super_admin"],
  "fees:create": ["admin", "super_admin"],
  "reports:view:college": ["principal"]
};

const exactRouteRoles: Record<string, CampusRole[]> = {
  "/portal/student": ["student"],
  "/portal/student/notes": ["student"],
  "/portal/student/attendance": ["student"],
  "/portal/student/scan-attendance": ["student"],
  "/portal/student/placement-eligibility": ["student"],
  "/portal/student/id-card": ["student"],
  "/portal/faculty": ["faculty"],
  "/portal/faculty/attendance": ["faculty"],
  "/portal/faculty/qr-attendance": ["faculty"],
  "/portal/faculty/notes": ["faculty"],
  "/portal/hod": ["hod"],
  "/portal/hod/attendance": ["hod"],
  "/portal/hod/notes-approval": ["hod"],
  "/portal/principal": ["principal"],
  "/portal/principal/attendance": ["principal"],
  "/portal/admin": ["admin", "super_admin"],
  "/portal/admin/users": ["admin", "super_admin"],
  "/portal/admin/bulk-students": ["admin", "super_admin"],
  "/portal/admin/audit-logs": ["admin", "super_admin"],
  "/portal/admin/demo-mode": ["admin", "super_admin"],
  "/portal/placement": ["placement_officer"],
  "/portal/placement/applications": ["placement_officer"],
  "/change-password": ["student", "faculty", "hod", "principal", "admin", "super_admin", "placement_officer"],
  "/admin": ["admin", "super_admin"],
  "/faculty": ["faculty"],
  "/faculty/mark-attendance": ["faculty"]
};

const sharedRouteRoles: Record<string, CampusRole[]> = {
  "/dashboard": ["student", "faculty", "hod", "principal", "admin", "super_admin", "placement_officer"],
  "/assistant": ["student", "faculty", "hod", "principal", "admin", "super_admin", "placement_officer"],
  "/notes": ["student", "faculty", "hod"],
  "/attendance": ["student", "faculty", "hod", "principal"],
  "/assignments": ["student", "faculty", "hod"],
  "/announcements": ["faculty", "hod", "principal", "admin", "super_admin"],
  "/events": ["student", "faculty", "hod", "principal", "admin", "super_admin"],
  "/placements": ["student", "placement_officer", "admin", "super_admin", "principal"],
  "/leave": ["student", "faculty", "hod", "principal", "admin", "super_admin"],
  "/fees": ["student", "principal", "admin", "super_admin"],
  "/alumni": ["student", "faculty", "hod", "principal", "admin", "super_admin"],
  "/discussions": ["student", "faculty", "hod", "principal", "admin", "super_admin"],
  "/clubs": ["student"],
  "/lost-found": ["student"],
  "/marketplace": ["student"],
  "/resume": ["student"],
  "/settings": ["student", "faculty", "hod", "principal", "admin", "super_admin", "placement_officer"]
};

export function normalizeRole(role?: string | null): CampusRole | undefined {
  if (!role) return undefined;
  return role as CampusRole;
}

export function getRoleHome(role?: string | null) {
  const normalized = normalizeRole(role);
  return normalized ? roleHome[normalized] : "/login";
}

export function getRoleMenu(role?: string | null): RoleMenuItem[] {
  const normalized = normalizeRole(role);
  return normalized ? roleMenus[normalized] ?? [] : [];
}

export function canPerformAction(role: string | null | undefined, action: RoleAction) {
  const normalized = normalizeRole(role);
  return Boolean(normalized && actionRoles[action]?.includes(normalized));
}

export function canAccessRoute(role: string | null | undefined, path: string) {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  const pathname = path.split("?")[0];
  const exact = exactRouteRoles[pathname];
  if (exact) return exact.includes(normalized);
  const shared = Object.entries(sharedRouteRoles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (shared) return shared[1].includes(normalized);
  return false;
}
