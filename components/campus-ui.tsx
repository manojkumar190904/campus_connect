"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { canPerformAction, getRoleHome, getRoleMenu, type RoleMenuItem } from "@/lib/role-access";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  GraduationCap,
  Home,
  KeyRound,
  LibraryBig,
  LogOut,
  MapPin,
  Megaphone,
  MessageSquareText,
  PackageSearch,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  Upload,
  UserRound,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ModuleKey =
  | "notes"
  | "placements"
  | "events"
  | "attendance"
  | "announcements"
  | "clubs"
  | "lost-found"
  | "marketplace"
  | "alumni"
  | "discussions"
  | "resume"
  | "settings"
  | "admin"
  | "faculty"
  | "assignments"
  | "leave"
  | "fees";

type Tone = "indigo" | "cyan" | "emerald" | "amber" | "rose" | "violet" | "blue" | "slate";
type PortalKey = "student" | "faculty" | "hod" | "principal" | "admin" | "placement";
type MockItem = { title: string; meta: string; info: string; badge: string; tone: Tone };
type CampusSessionUser = {
  id?: string;
  campusId: string;
  name?: string;
  role: string;
  department?: string;
  semester?: string;
  section?: string;
  email?: string;
  isEmailVerified?: boolean;
  mustChangePassword?: boolean;
};
type ModalState =
  | { title: string; body: React.ReactNode }
  | null;

const toneMap: Record<Tone, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  cyan: "bg-cyan-50 text-cyan-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-700"
};

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Home,
  LibraryBig,
  Megaphone,
  PackageSearch,
  QrCode,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  Upload,
  UserRound,
  UsersRound
};

function resolveMenuIcon(item: RoleMenuItem) {
  return iconMap[item.icon] ?? Home;
}

function useCurrentUser() {
  const [user, setUser] = useState<CampusSessionUser | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/me")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (mounted) setUser(data?.user ?? null);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return user;
}

type NavigationItem = { id: string; label: string; href: string; icon: LucideIcon };

const navItems: NavigationItem[] = [
  { id: "nav-dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
  { id: "nav-notices", label: "Notices", href: "/announcements", icon: Megaphone },
  { id: "nav-notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "nav-events", label: "Events", href: "/events", icon: CalendarDays },
  { id: "nav-attendance", label: "Attendance", href: "/attendance", icon: CheckCircle2 },
  { id: "nav-placements", label: "Placements", href: "/placements", icon: BriefcaseBusiness },
  { id: "nav-assignments", label: "Assignments", href: "/assignments", icon: ClipboardCheck },
  { id: "nav-leave", label: "Leave", href: "/leave", icon: CalendarDays },
  { id: "nav-fees", label: "Fees", href: "/fees", icon: FileText },
  { id: "nav-clubs", label: "Clubs", href: "/clubs", icon: UsersRound },
  { id: "nav-lost-found", label: "Lost & Found", href: "/lost-found", icon: PackageSearch },
  { id: "nav-marketplace", label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { id: "nav-alumni", label: "Alumni", href: "/alumni", icon: GraduationCap },
  { id: "nav-discussions", label: "Discussions", href: "/discussions", icon: MessageSquareText },
  { id: "nav-resume", label: "Resume", href: "/resume", icon: BookOpen },
  { id: "nav-settings", label: "Settings", href: "/settings", icon: Settings },
  { id: "nav-admin", label: "Admin", href: "/admin", icon: ShieldCheck }
];

const bottomItems = navItems.slice(0, 5);

const portalMeta: Record<PortalKey, { title: string; role: string; nav: NavigationItem[] }> = {
  student: {
    title: "Student Portal",
    role: "student",
    nav: [
      { id: "portal-student-dashboard", label: "Dashboard", href: "/portal/student", icon: Home },
      { id: "portal-student-notes", label: "Notes", href: "/notes", icon: FileText },
      { id: "portal-student-attendance", label: "Attendance", href: "/attendance", icon: CheckCircle2 },
      { id: "portal-student-events", label: "Events", href: "/events", icon: CalendarDays },
      { id: "portal-student-placements", label: "Placements", href: "/placements", icon: BriefcaseBusiness },
      { id: "portal-student-assignments", label: "Assignments", href: "/assignments", icon: ClipboardCheck },
      { id: "portal-student-leave", label: "Leave", href: "/leave", icon: CalendarDays },
      { id: "portal-student-fees", label: "Fees", href: "/fees", icon: FileText },
      { id: "portal-student-clubs", label: "Clubs", href: "/clubs", icon: UsersRound },
      { id: "portal-student-lost-found", label: "Lost & Found", href: "/lost-found", icon: PackageSearch },
      { id: "portal-student-marketplace", label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
      { id: "portal-student-resume", label: "Resume", href: "/resume", icon: BookOpen },
      { id: "portal-student-settings", label: "Settings", href: "/settings", icon: Settings }
    ]
  },
  faculty: {
    title: "Faculty Portal",
    role: "faculty",
    nav: [
      { id: "portal-faculty-overview", label: "Overview", href: "/portal/faculty", icon: Home },
      { id: "portal-faculty-attendance", label: "Attendance", href: "/attendance", icon: ClipboardCheck },
      { id: "portal-faculty-assignments", label: "Assignments", href: "/assignments", icon: ClipboardCheck },
      { id: "portal-faculty-leave", label: "Leave", href: "/leave", icon: CalendarDays },
      { id: "portal-faculty-notes", label: "Upload Notes", href: "/notes", icon: Upload },
      { id: "portal-faculty-announcements", label: "Announcements", href: "/announcements", icon: Megaphone },
      { id: "portal-faculty-events", label: "Events", href: "/events", icon: CalendarDays }
    ]
  },
  hod: {
    title: "HOD Portal",
    role: "hod",
    nav: [
      { id: "portal-hod-overview", label: "Overview", href: "/portal/hod", icon: Home },
      { id: "portal-hod-attendance", label: "Attendance", href: "/attendance", icon: ClipboardCheck },
      { id: "portal-hod-assignments", label: "Assignments", href: "/assignments", icon: ClipboardCheck },
      { id: "portal-hod-leave", label: "Leave", href: "/leave", icon: CalendarDays },
      { id: "portal-hod-notes", label: "Notes", href: "/notes", icon: FileText },
      { id: "portal-hod-notices", label: "Notices", href: "/announcements", icon: Megaphone }
    ]
  },
  principal: {
    title: "Principal Portal",
    role: "principal",
    nav: [
      { id: "portal-principal-overview", label: "Overview", href: "/portal/principal", icon: Home },
      { id: "portal-principal-attendance", label: "Attendance Analytics", href: "/attendance", icon: ClipboardCheck },
      { id: "portal-principal-placements", label: "Placement Reports", href: "/placements", icon: BriefcaseBusiness },
      { id: "portal-principal-fees", label: "Fees", href: "/fees", icon: FileText },
      { id: "portal-principal-leave", label: "Leave", href: "/leave", icon: CalendarDays },
      { id: "portal-principal-events", label: "Events Approval", href: "/events", icon: CalendarDays },
      { id: "portal-principal-notices", label: "Notices", href: "/announcements", icon: Megaphone }
    ]
  },
  admin: {
    title: "Admin Console",
    role: "admin",
    nav: [
      { id: "portal-admin-overview", label: "Overview", href: "/portal/admin", icon: Home },
      { id: "portal-admin-users", label: "Users", href: "/portal/admin/users", icon: UsersRound },
      { id: "portal-admin-placements", label: "Placements", href: "/placements", icon: BriefcaseBusiness },
      { id: "portal-admin-assignments", label: "Assignments", href: "/assignments", icon: ClipboardCheck },
      { id: "portal-admin-leave", label: "Leave", href: "/leave", icon: CalendarDays },
      { id: "portal-admin-fees", label: "Fees", href: "/fees", icon: FileText },
      { id: "portal-admin-audit-logs", label: "Audit Logs", href: "/portal/admin/audit-logs", icon: ShieldCheck },
      { id: "portal-admin-events", label: "Events", href: "/events", icon: CalendarDays },
      { id: "portal-admin-notices", label: "Notices", href: "/announcements", icon: Megaphone },
      { id: "portal-admin-settings", label: "Settings", href: "/settings", icon: Settings }
    ]
  },
  placement: {
    title: "Placement Cell",
    role: "placement_officer",
    nav: [
      { id: "portal-placement-overview", label: "Overview", href: "/portal/placement", icon: Home },
      { id: "portal-placement-drives", label: "Drives", href: "/placements", icon: BriefcaseBusiness },
      { id: "portal-placement-applications", label: "Applications", href: "/portal/placement/applications", icon: FileText },
      { id: "portal-placement-resumes", label: "Resume Database", href: "/resume", icon: BookOpen },
      { id: "portal-placement-notices", label: "Placement Notices", href: "/announcements", icon: Megaphone }
    ]
  }
};

const attendanceData = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 71 },
  { month: "Apr", value: 73 },
  { month: "May", value: 76 },
  { month: "Jun", value: 78 }
];

const stats = [
  { title: "Attendance", value: "78%", label: "Overall semester", icon: ClipboardCheck, tone: "indigo" as Tone },
  { title: "Upcoming Events", value: "06", label: "This month", icon: CalendarDays, tone: "cyan" as Tone },
  { title: "Notices", value: "12", label: "New updates", icon: Bell, tone: "amber" as Tone },
  { title: "Placements", value: "08", label: "Open drives", icon: BriefcaseBusiness, tone: "emerald" as Tone }
];

const notices = [
  { title: "Mid Semester Exams", meta: "Exam Cell", info: "Today", badge: "High", tone: "rose" as Tone },
  { title: "Library Maintenance", meta: "Library", info: "15 Jun", badge: "Normal", tone: "amber" as Tone },
  { title: "Hackathon Registration", meta: "MCA Club", info: "Open", badge: "New", tone: "indigo" as Tone },
  { title: "Holiday Notice", meta: "Administration", info: "18 Jun", badge: "Info", tone: "cyan" as Tone }
];

const events = [
  { title: "Web Development Workshop", meta: "10:00 AM", info: "Lab 3", badge: "Workshop", tone: "cyan" as Tone },
  { title: "CodeSprint 3.0", meta: "02:30 PM", info: "Auditorium", badge: "Coding", tone: "violet" as Tone },
  { title: "Annual Sports Meet", meta: "08:00 AM", info: "Main Ground", badge: "Sports", tone: "emerald" as Tone }
];

const notes = [
  { title: "Data Structures and Algorithms", meta: "MCA • 2nd Sem", info: "1,240 downloads", badge: "PDF", tone: "indigo" as Tone },
  { title: "Database Management System", meta: "MCA • 2nd Sem", info: "980 downloads", badge: "PDF", tone: "cyan" as Tone },
  { title: "Operating Systems Notes", meta: "MCA • 2nd Sem", info: "860 downloads", badge: "PDF", tone: "emerald" as Tone },
  { title: "Web Technologies Lab Manual", meta: "MCA • 2nd Sem", info: "640 downloads", badge: "PDF", tone: "amber" as Tone }
];

const placements = [
  { title: "Microsoft", meta: "Software Engineer", info: "₹24 LPA", badge: "Open", tone: "indigo" as Tone },
  { title: "Amazon", meta: "SDE Intern", info: "₹12 LPA", badge: "Open", tone: "amber" as Tone },
  { title: "Google", meta: "Associate Engineer", info: "₹20 LPA", badge: "Shortlist", tone: "emerald" as Tone },
  { title: "Deloitte", meta: "Data Analyst", info: "₹8 LPA", badge: "Open", tone: "cyan" as Tone }
];

const eligibilityCompanies = [
  { company: "Microsoft", role: "Software Engineer", minCgpa: 8, maxBacklogs: 0, skills: ["react", "typescript", "java", "mongodb"], package: "24 LPA" },
  { company: "Amazon", role: "SDE Intern", minCgpa: 7.5, maxBacklogs: 1, skills: ["java", "dsa", "react"], package: "12 LPA" },
  { company: "Google", role: "Associate Engineer", minCgpa: 8.5, maxBacklogs: 0, skills: ["react", "data", "typescript"], package: "20 LPA" },
  { company: "Deloitte", role: "Data Analyst", minCgpa: 6.5, maxBacklogs: 2, skills: ["sql", "data", "excel"], package: "8 LPA" }
];

const quickActions = [
  { label: "Upload Notes", icon: Upload, tone: "indigo" as Tone },
  { label: "Create Event", icon: CalendarDays, tone: "cyan" as Tone },
  { label: "Mark Attendance", icon: ClipboardCheck, tone: "emerald" as Tone },
  { label: "Post Notice", icon: Megaphone, tone: "amber" as Tone },
  { label: "Lost & Found", icon: PackageSearch, tone: "rose" as Tone },
  { label: "Join Club", icon: UsersRound, tone: "violet" as Tone },
  { label: "Resume", icon: BookOpen, tone: "blue" as Tone },
  { label: "QR Scanner", icon: QrCode, tone: "slate" as Tone }
];

const roleQuickActions: Record<string, Array<{ label: string; icon: LucideIcon; tone: Tone; href: string }>> = {
  student: [
    { label: "Download Notes", icon: Download, tone: "indigo", href: "/portal/student/notes" },
    { label: "Apply Placement", icon: BriefcaseBusiness, tone: "emerald", href: "/placements" },
    { label: "Register Event", icon: CalendarDays, tone: "cyan", href: "/events" },
    { label: "Resume Builder", icon: BookOpen, tone: "amber", href: "/resume" }
  ],
  faculty: [
    { label: "Mark Attendance", icon: ClipboardCheck, tone: "emerald", href: "/portal/faculty/attendance" },
    { label: "Upload Notes", icon: Upload, tone: "indigo", href: "/portal/faculty/notes" },
    { label: "Create Assignment", icon: FileText, tone: "cyan", href: "/assignments" },
    { label: "Post Announcement", icon: Megaphone, tone: "amber", href: "/announcements" }
  ],
  hod: [
    { label: "Approve Notes", icon: FileText, tone: "indigo", href: "/portal/hod/notes-approval" },
    { label: "View Attendance", icon: ClipboardCheck, tone: "emerald", href: "/portal/hod/attendance" },
    { label: "Department Reports", icon: ShieldCheck, tone: "violet", href: "/portal/hod" }
  ],
  admin: [
    { label: "Create User", icon: UsersRound, tone: "indigo", href: "/portal/admin/users" },
    { label: "Reset Password", icon: ShieldCheck, tone: "amber", href: "/portal/admin/users" },
    { label: "Export Users", icon: Download, tone: "emerald", href: "/portal/admin/users" },
    { label: "Audit Logs", icon: FileText, tone: "slate", href: "/portal/admin/audit-logs" }
  ],
  super_admin: [
    { label: "Create User", icon: UsersRound, tone: "indigo", href: "/portal/admin/users" },
    { label: "Reset Password", icon: ShieldCheck, tone: "amber", href: "/portal/admin/users" },
    { label: "Export Users", icon: Download, tone: "emerald", href: "/portal/admin/users" },
    { label: "Audit Logs", icon: FileText, tone: "slate", href: "/portal/admin/audit-logs" }
  ],
  principal: [
    { label: "View Reports", icon: ShieldCheck, tone: "indigo", href: "/portal/principal" },
    { label: "Approve Events", icon: CalendarDays, tone: "amber", href: "/events" },
    { label: "Department Analytics", icon: Building2, tone: "cyan", href: "/portal/principal/attendance" }
  ],
  placement_officer: [
    { label: "Create Drive", icon: BriefcaseBusiness, tone: "emerald", href: "/placements" },
    { label: "Applications", icon: FileText, tone: "indigo", href: "/portal/placement/applications" },
    { label: "Reports", icon: ShieldCheck, tone: "violet", href: "/portal/placement" }
  ]
};

const moduleContent: Record<ModuleKey, {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  action: string;
  items: MockItem[];
}> = {
  notes: {
    title: "Notes Library",
    subtitle: "Search, filter and download high-quality MCA study resources.",
    icon: FileText,
    action: "Download",
    items: notes
  },
  placements: {
    title: "Placement Hub",
    subtitle: "Explore company drives, packages, roles and application status.",
    icon: BriefcaseBusiness,
    action: "Apply Now",
    items: placements
  },
  events: {
    title: "Campus Events",
    subtitle: "Register for workshops, competitions and campus activities.",
    icon: CalendarDays,
    action: "Register",
    items: events
  },
  attendance: {
    title: "Attendance Analytics",
    subtitle: "Track subject-wise attendance and semester eligibility.",
    icon: ClipboardCheck,
    action: "View Report",
    items: [
      { title: "Data Structures", meta: "34 / 42 classes", info: "81%", badge: "Safe", tone: "emerald" },
      { title: "DBMS", meta: "31 / 40 classes", info: "78%", badge: "Safe", tone: "cyan" },
      { title: "Operating Systems", meta: "28 / 38 classes", info: "74%", badge: "Alert", tone: "amber" },
      { title: "Web Technologies", meta: "36 / 44 classes", info: "82%", badge: "Safe", tone: "indigo" }
    ]
  },
  announcements: {
    title: "Announcements",
    subtitle: "Important notices, exam updates and campus circulars.",
    icon: Megaphone,
    action: "Read More",
    items: notices
  },
  clubs: {
    title: "Clubs",
    subtitle: "Join coding, design, sports, security and entrepreneurship clubs.",
    icon: UsersRound,
    action: "Join Club",
    items: [
      { title: "CodeCrafters Club", meta: "Coding", info: "148 members", badge: "Active", tone: "indigo" },
      { title: "Design Studio", meta: "UI/UX", info: "86 members", badge: "Open", tone: "violet" },
      { title: "Cyber Cell", meta: "Security", info: "72 members", badge: "Active", tone: "emerald" },
      { title: "E-Cell", meta: "Startup", info: "103 members", badge: "Open", tone: "amber" }
    ]
  },
  "lost-found": {
    title: "Lost & Found",
    subtitle: "Report missing items and recover belongings quickly.",
    icon: PackageSearch,
    action: "Contact",
    items: [
      { title: "Black Laptop Bag", meta: "Library", info: "Rahul Sharma", badge: "LOST", tone: "rose" },
      { title: "Scientific Calculator", meta: "Lab 2", info: "MCA Office", badge: "FOUND", tone: "emerald" },
      { title: "ID Card", meta: "Canteen", info: "Security Desk", badge: "FOUND", tone: "cyan" },
      { title: "Blue Water Bottle", meta: "Auditorium", info: "Nisha Rao", badge: "LOST", tone: "amber" }
    ]
  },
  marketplace: {
    title: "Marketplace",
    subtitle: "Buy and sell books, devices and campus essentials.",
    icon: ShoppingBag,
    action: "Contact Seller",
    items: [
      { title: "DBMS Textbook", meta: "Seller: Aman", info: "₹450", badge: "Good", tone: "indigo" },
      { title: "Casio Calculator", meta: "Seller: Priya", info: "₹700", badge: "Like New", tone: "cyan" },
      { title: "Lab Coat", meta: "Seller: Rohit", info: "₹300", badge: "Used", tone: "amber" },
      { title: "Wireless Mouse", meta: "Seller: Meera", info: "₹550", badge: "Good", tone: "emerald" }
    ]
  },
  alumni: {
    title: "Alumni Network",
    subtitle: "Connect with mentors for careers, projects and interviews.",
    icon: GraduationCap,
    action: "Request Mentorship",
    items: [
      { title: "Ananya Rao", meta: "Software Engineer • Microsoft", info: "Batch 2022", badge: "React", tone: "indigo" },
      { title: "Vikram Iyer", meta: "Data Engineer • Amazon", info: "Batch 2021", badge: "AWS", tone: "amber" },
      { title: "Sneha Kulkarni", meta: "Product Analyst • Google", info: "Batch 2020", badge: "SQL", tone: "emerald" },
      { title: "Arjun Menon", meta: "Security Consultant • Deloitte", info: "Batch 2019", badge: "Cloud", tone: "cyan" }
    ]
  },
  discussions: {
    title: "Discussions",
    subtitle: "Ask questions, answer classmates and grow together.",
    icon: MessageSquareText,
    action: "Open Thread",
    items: [
      { title: "Best way to prepare DBMS joins?", meta: "Rahul Sharma", info: "12 answers", badge: "DBMS", tone: "indigo" },
      { title: "Need teammates for CodeSprint 3.0", meta: "Nisha Rao", info: "8 answers", badge: "Team", tone: "violet" },
      { title: "Operating Systems viva questions", meta: "Aman Verma", info: "17 answers", badge: "OS", tone: "cyan" },
      { title: "Resume review for SDE internships", meta: "Meera P", info: "6 answers", badge: "Resume", tone: "emerald" }
    ]
  },
  resume: {
    title: "Resume Builder",
    subtitle: "Create a clean placement-ready resume preview.",
    icon: BookOpen,
    action: "Download PDF",
    items: [
      { title: "Rahul Sharma", meta: "MCA Student • Full Stack Developer", info: "Next.js, Java, MongoDB", badge: "Preview", tone: "indigo" },
      { title: "Projects", meta: "Campus Connect SaaS", info: "Dashboard, routes, charts, UI system", badge: "ATS", tone: "cyan" },
      { title: "Education", meta: "MCA • 2026", info: "Computer Applications", badge: "Verified", tone: "emerald" }
    ]
  },
  settings: {
    title: "Settings",
    subtitle: "Manage profile, notifications, theme and account status.",
    icon: Settings,
    action: "Save",
    items: [
      { title: "Rahul Sharma", meta: "MCA - 2nd Year", info: "rahul@campus.test", badge: "Profile", tone: "indigo" },
      { title: "Notifications", meta: "Email and app alerts", info: "Enabled", badge: "On", tone: "emerald" },
      { title: "Theme", meta: "Light CampusOS theme", info: "Active", badge: "Default", tone: "cyan" }
    ]
  },
  assignments: {
    title: "Assignments",
    subtitle: "Create, submit, grade and track coursework deadlines.",
    icon: ClipboardCheck,
    action: "Submit",
    items: [
      { title: "DBMS Normalization", meta: "DBMS • Due 01 Jul", info: "Submitted: 0 / 64", badge: "Active", tone: "indigo" },
      { title: "OS Scheduling Lab", meta: "Operating Systems • Due 05 Jul", info: "Pending", badge: "New", tone: "cyan" },
      { title: "DSA Tree Problems", meta: "Data Structures • Due 09 Jul", info: "Grade pending", badge: "Review", tone: "amber" }
    ]
  },
  leave: {
    title: "Leave Management",
    subtitle: "Apply for leave, review approvals and track request status.",
    icon: CalendarDays,
    action: "Apply Leave",
    items: [
      { title: "Medical Leave", meta: "20 Jun - 21 Jun", info: "Rahul Sharma", badge: "Pending", tone: "amber" },
      { title: "Faculty Duty Leave", meta: "24 Jun", info: "Prof. Arjun Rao", badge: "Review", tone: "cyan" },
      { title: "Personal Leave", meta: "28 Jun", info: "MCA Student", badge: "Approved", tone: "emerald" }
    ]
  },
  fees: {
    title: "Fee Tracking",
    subtitle: "Track student fee dues, payments and due dates.",
    icon: FileText,
    action: "View Details",
    items: [
      { title: "Rahul Sharma", meta: "MCA2026001 • Due 15 Jul", info: "₹18,000 pending", badge: "Pending", tone: "amber" },
      { title: "MCA Student 002", meta: "MCA2026002 • Paid", info: "₹60,000 paid", badge: "Paid", tone: "emerald" },
      { title: "MCA Student 003", meta: "MCA2026003 • Due 20 Jul", info: "₹25,000 pending", badge: "Pending", tone: "rose" }
    ]
  },
  admin: {
    title: "Admin",
    subtitle: "Analytics, user management, placement drives and system status.",
    icon: ShieldCheck,
    action: "Manage",
    items: [
      { title: "Active Users", meta: "Students, faculty and admins", info: "1,248", badge: "Live", tone: "indigo" },
      { title: "Placement Drives", meta: "Open opportunities", info: "08", badge: "Open", tone: "emerald" },
      { title: "System Status", meta: "API and dashboard", info: "99.9%", badge: "Healthy", tone: "cyan" },
      { title: "User Table", meta: "Rahul, Nisha, Aman, Meera", info: "4 shown", badge: "Mock", tone: "amber" }
    ]
  },
  faculty: {
    title: "Faculty Dashboard",
    subtitle: "Upload notes, mark attendance and create announcements.",
    icon: LibraryBig,
    action: "Open",
    items: [
      { title: "Upload Notes", meta: "Share PDFs and lab manuals", info: "Ready", badge: "Notes", tone: "indigo" },
      { title: "Mark Attendance", meta: "Subject-wise daily attendance", info: "Today", badge: "Class", tone: "emerald" },
      { title: "Create Announcement", meta: "Publish notice to students", info: "Instant", badge: "Notice", tone: "amber" }
    ]
  }
};

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700", className)}>
      {children}
    </span>
  );
}

function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 active:translate-y-0",
        variant === "primary"
          ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_18px_38px_-22px_rgba(79,70,229,0.95)]"
          : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed right-5 top-5 z-[70] rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-black text-emerald-700 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      {message}
    </div>
  );
}

function Modal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-42px_rgba(15,23,42,0.75)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-950">{modal.title}</h2>
          <Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={onClose}>Close</Button>
        </div>
        {modal.body}
      </motion.div>
    </div>
  );
}

function ItemList({ rows, icon: Icon }: { rows: MockItem[]; icon: LucideIcon }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm", toneMap[row.tone])}><Icon size={17} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-950">{row.title}</p>
            <p className="truncate text-xs font-bold text-slate-500">{row.meta} • {row.info}</p>
          </div>
          <Badge>{row.badge}</Badge>
        </div>
      ))}
    </div>
  );
}

function CreateForm({ title, onDone }: { title: string; onDone: () => void }) {
  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onDone();
      }}
    >
      <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder={`${title} title`} />
      <input className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Category / department" />
      <textarea className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Description" />
      <Button type="submit">Create</Button>
    </form>
  );
}

function downloadMockFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_45%,#eef2ff_100%)] p-3 text-slate-950 sm:p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1480px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_30px_90px_-42px_rgba(79,70,229,0.55)] lg:h-[90vh] lg:min-h-0"
      >
        <Sidebar />
        <section className="flex min-w-0 flex-1 flex-col bg-[#fbfdff]">
          <Topbar />
          <div className="mobile-safe-bottom flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-7">{children}</div>
        </section>
      </motion.div>
      <MobileBottomNav />
    </main>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const portalKey = pathname.startsWith("/portal/")
    ? (pathname.split("/")[2] as PortalKey)
    : null;
  const activePortal = portalKey && portalMeta[portalKey] ? portalMeta[portalKey] : null;
  const items = user
    ? getRoleMenu(user.role).map((item) => ({ ...item, icon: resolveMenuIcon(item) }))
    : activePortal?.nav ?? [];
  const initials = (user?.name ?? user?.campusId ?? "CC").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const logout = () => {
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
      <Link href="/" className="mb-7 flex items-center gap-3 px-2">
        <span className="grid size-11 place-items-center rounded-[18px] bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white">
          <GraduationCap size={23} />
        </span>
        <span>
          <span className="block text-xl font-black tracking-tight text-slate-950">CampusOS</span>
          {activePortal ? <span className="block text-xs font-black text-slate-400">{activePortal.title}</span> : null}
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition",
                active ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_16px_30px_-20px_rgba(79,70,229,0.9)]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              <Icon size={18} className={active ? "text-white" : "text-slate-400 transition group-hover:text-indigo-600"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-white">{initials}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">{user?.name ?? "Campus User"}</p>
            <p className="truncate text-xs font-bold text-slate-500">{user?.role?.replace(/_/g, " ") ?? activePortal?.title ?? "CampusOS"}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const portalKey = pathname.startsWith("/portal/") ? (pathname.split("/")[2] as PortalKey) : null;
  const label = portalKey && portalMeta[portalKey] ? portalMeta[portalKey].title : pathname === "/" ? "Dashboard" : pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ?? "Dashboard";
  const [topSearch, setTopSearch] = useState("");
  const [toast, setToast] = useState("");
  const [unread, setUnread] = useState(0);
  const initials = (user?.name ?? user?.campusId ?? "CC").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const logout = () => {
    void signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUnread(data?.unread ?? 0))
      .catch(() => setUnread(0));
  }, [pathname]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <header className="flex min-h-[72px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <Toast message={toast} />
      <div className="lg:hidden">
        <p className="text-lg font-black capitalize text-slate-950">{label}</p>
        <p className="text-xs font-bold text-slate-500">CampusOS</p>
      </div>
      <div className="hidden w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:flex">
        <Search size={18} className="text-slate-400" />
        <input
          value={topSearch}
          onChange={(event) => {
            setTopSearch(event.target.value);
            if (event.target.value.length > 1) notify(`Searching for "${event.target.value}"`);
          }}
          className="h-12 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="Search notes, notices, events..."
        />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Badge className="hidden border-cyan-100 bg-cyan-50 text-cyan-700 sm:inline-flex">15 Jun 2026</Badge>
        <button onClick={() => notify(`You have ${unread || 0} unread campus notifications`)} className="relative hidden size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm sm:grid">
          <Bell size={18} />
          {unread ? <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-black text-white">{unread}</span> : null}
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-white">{initials}</div>
          <div className="hidden pr-2 md:block">
            <p className="text-sm font-black leading-4 text-slate-950">{user?.name ?? "Campus User"}</p>
            <p className="text-xs font-bold text-slate-500">{user ? `${user.campusId} • ${user.role.replace(/_/g, " ")}` : "CampusOS"}</p>
          </div>
        </div>
        <button onClick={logout} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 shadow-sm transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 sm:px-4">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const items = user ? getRoleMenu(user.role).slice(0, 5).map((item) => ({ ...item, icon: resolveMenuIcon(item) })) : [];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[24px] border border-slate-200 bg-white/95 px-2 py-2 shadow-[0_18px_55px_-18px_rgba(15,23,42,0.35)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.id} href={item.href} className={cn("flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-black transition", active ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white" : "text-slate-500")}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function StatCard({ title, value, label, icon: Icon, tone }: { title: string; value: string; label: string; icon: LucideIcon; tone: Tone }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.01 }}>
      <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
        <span className={cn("grid size-11 place-items-center rounded-2xl", toneMap[tone])}><Icon size={21} /></span>
        <p className="mt-4 text-sm font-bold text-slate-500">{title}</p>
        <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

export function SectionCard({
  title,
  eyebrow,
  icon: Icon,
  action,
  children
}: {
  title: string;
  eyebrow?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-sm font-bold text-slate-500">{eyebrow}</p> : null}
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {Icon ? <span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon size={21} /></span> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function AttendanceChart() {
  return (
    <SectionCard title="Attendance Overview" eyebrow="Semester progress" icon={ClipboardCheck}>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData} margin={{ left: -18, right: 8, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 6" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }} domain={[50, 90]} />
            <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "16px" }} />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fill="url(#attendanceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function ListRows({ rows, icon: Icon }: { rows: MockItem[]; icon: LucideIcon }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm", toneMap[row.tone])}><Icon size={17} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-950">{row.title}</p>
            <p className="truncate text-xs font-bold text-slate-500">{row.meta} • {row.info}</p>
          </div>
          <Badge>{row.badge}</Badge>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const actions = user ? roleQuickActions[user.role] ?? roleQuickActions.student : quickActions.map((action) => ({ ...action, href: "/dashboard" }));

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function openList(title: string, rows: MockItem[], icon: LucideIcon) {
    setModal({ title, body: <ItemList rows={rows} icon={icon} /> });
  }

  function handleQuickAction(label: string, href?: string) {
    const routes: Record<string, string> = {
      "Upload Notes": "/notes",
      "Create Event": "/events",
      "Mark Attendance": "/attendance",
      "Post Notice": "/announcements",
      "Lost & Found": "/lost-found",
      "Join Club": "/clubs",
      Resume: "/resume"
    };

    if (label === "QR Scanner") {
      setModal({
        title: "QR Scanner",
        body: (
          <div className="text-center">
            <div className="mx-auto grid size-44 place-items-center rounded-3xl border-8 border-slate-900 bg-white">
              <QrCode size={96} className="text-slate-950" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-600">Mock scanner ready. Point a campus QR pass at the camera.</p>
          </div>
        )
      });
      return;
    }

    notify(`${label} opened`);
    router.push(href ?? routes[label] ?? getRoleHome(user?.role));
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <Modal modal={modal} onClose={() => setModal(null)} />
      <section className="mb-6">
        <Badge className="mb-3 bg-white text-indigo-700 shadow-sm"><Sparkles size={13} className="mr-1" /> CampusOS dashboard</Badge>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Good Morning, {user?.name?.split(" ")[0] ?? "Campus"}! 👋</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500 sm:text-base">Here’s what’s happening in your campus today.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <AttendanceChart />
        <SectionCard title="Attendance" eyebrow="Current score" icon={CheckCircle2}>
          <div className="grid min-h-[230px] place-items-center text-center">
            <div>
              <div className="mx-auto grid size-36 place-items-center rounded-full bg-[conic-gradient(#4f46e5_78%,#eef2ff_0)] p-3">
                <div className="grid size-full place-items-center rounded-full bg-white">
                  <div>
                    <p className="text-4xl font-black text-slate-950">78%</p>
                    <p className="text-xs font-black text-slate-400">Healthy</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-500">Minimum target: 75%</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="mt-6">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-500">Quick Actions</p>
          <h2 className="text-xl font-black text-slate-950">Campus shortcuts</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={() => handleQuickAction(action.label, "href" in action ? action.href : undefined)} className="flex h-[104px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-3 text-center shadow-[0_14px_34px_-30px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-md">
                <span className={cn("grid size-11 place-items-center rounded-2xl", toneMap[action.tone])}><Icon size={20} /></span>
                <span className="text-xs font-black leading-tight text-slate-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <SectionCard title="Latest Notices" eyebrow="Campus updates" icon={Megaphone} action={<Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => openList("Latest Notices", notices, Megaphone)}>View All</Button>}><ListRows rows={notices} icon={Megaphone} /></SectionCard>
        <SectionCard title="Upcoming Events" eyebrow="This week" icon={CalendarDays} action={<Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => openList("Upcoming Events", events, CalendarDays)}>View All</Button>}><ListRows rows={events} icon={CalendarDays} /></SectionCard>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <SectionCard title="Notes Library" eyebrow="Recommended" icon={FileText} action={<Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => openList("Notes Library", notes, FileText)}>View All</Button>}><ListRows rows={notes.slice(0, 3)} icon={FileText} /></SectionCard>
        <SectionCard title="Placement Opportunities" eyebrow="Open drives" icon={BriefcaseBusiness} action={<Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => openList("Placement Opportunities", placements, Building2)}>View All</Button>}><ListRows rows={placements} icon={Building2} /></SectionCard>
      </section>
    </AppShell>
  );
}

export function ModulePage({ module }: { module: ModuleKey }) {
  const currentUser = useCurrentUser();
  const data = moduleContent[module];
  const Icon = data.icon;
  const showChart = module === "attendance";
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const isAdminRole = currentUser?.role === "admin" || currentUser?.role === "super_admin";
  const canCreateModule =
    module === "placements" ? canPerformAction(currentUser?.role, "placements:manage") :
    module === "events" ? currentUser?.role === "faculty" || isAdminRole :
    module === "assignments" ? currentUser?.role === "faculty" || isAdminRole :
    module === "leave" ? currentUser?.role === "student" || currentUser?.role === "faculty" :
    module === "fees" ? isAdminRole :
    module === "lost-found" || module === "marketplace" || module === "clubs" || module === "discussions";

  if ((module === "notes" || module === "attendance" || module === "placements") && !currentUser) {
    return (
      <AppShell>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">Loading workspace...</section>
      </AppShell>
    );
  }

  if (module === "notes" && currentUser?.role === "student") return <StudentNotesPage />;
  if (module === "notes" && currentUser?.role === "faculty") return <FacultyNotesPage />;
  if (module === "notes" && currentUser?.role === "hod") return <HodNotesApprovalPage />;
  if (module === "attendance" && currentUser?.role === "student") return <StudentAttendancePage />;
  if (module === "attendance" && currentUser?.role === "faculty") return <FacultyAttendancePage />;
  if (module === "attendance" && currentUser?.role === "hod") return <HodAttendancePage />;
  if (module === "attendance" && currentUser?.role === "principal") return <HodAttendancePage principal />;
  if (module === "placements" && currentUser) return <PlacementHubPage />;

  const filteredItems = useMemo(() => {
    return data.items.filter((item, index) => {
      const haystack = `${item.title} ${item.meta} ${item.info} ${item.badge}`.toLowerCase();
      const matchesSearch = haystack.includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Recent" && index < 2) ||
        (filter === "Popular" && /1,|980|860|148|1,248|99/.test(item.info)) ||
        (filter === "Active" && /open|active|safe|healthy|live/i.test(item.badge));
      return matchesSearch && matchesFilter;
    });
  }, [data.items, filter, searchQuery]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function closeModal() {
    setModal(null);
  }

  async function apiRequest(path: string, options: RequestInit = {}) {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "Request failed");
    return payload;
  }

  function createTitle() {
    const titles: Partial<Record<ModuleKey, string>> = {
      notes: "Upload Note",
      events: "Create Event",
      announcements: "Post Notice",
      marketplace: "Sell Item",
      "lost-found": "Report Item",
      clubs: "Create Club Event",
      discussions: "Ask Question",
      faculty: "Faculty Action"
    };
    return titles[module] ?? `Create New ${data.title}`;
  }

  function openCreateModal(title = createTitle()) {
    setModal({
      title,
      body: <CreateForm title={title} onDone={async () => { await createWorkflowRecord(title); closeModal(); notify(`${title} saved`); }} />
    });
  }

  async function createWorkflowRecord(title: string) {
    try {
      if (module === "notes" || title.includes("Upload Notes")) {
        await apiRequest("/api/notes", { method: "POST", body: JSON.stringify({ title: "Faculty Uploaded Note", description: "Uploaded from CampusOS", department: "MCA", semester: "2", subject: "DBMS" }) });
      } else if (module === "events" || title.includes("Event")) {
        await apiRequest("/api/events", { method: "POST", body: JSON.stringify({ title: "Campus Tech Talk", description: "Created from CampusOS", date: "2026-07-12", venue: "Auditorium" }) });
      } else if (module === "placements") {
        await apiRequest("/api/placements/drives", { method: "POST", body: JSON.stringify({ companyName: "Infosys", role: "Systems Engineer", package: "6 LPA", eligibility: "60%+", lastDate: "2026-07-30", status: "Open" }) });
      } else if (module === "assignments") {
        await apiRequest("/api/assignments", { method: "POST", body: JSON.stringify({ title: "New Campus Assignment", subject: "DBMS", department: "MCA", semester: "2", section: "A", deadline: "2026-07-20", instructions: "Submit through CampusOS." }) });
      } else if (module === "leave") {
        await apiRequest("/api/leave", { method: "POST", body: JSON.stringify({ fromDate: "2026-07-01", toDate: "2026-07-02", reason: "CampusOS leave request" }) });
      } else if (module === "fees") {
        await apiRequest("/api/fees", { method: "POST", body: JSON.stringify({ studentCampusId: "MCA2026001", studentName: "Rahul Sharma", amount: 60000, paidAmount: 42000, dueDate: "2026-07-15", status: "Pending" }) });
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : "Saved locally");
    }
  }

  function openAttendanceReport() {
    const rows = moduleContent.attendance.items;
    setModal({
      title: "Attendance Report",
      body: (
        <div>
          <div className="mb-4 rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm font-bold text-slate-600">Total attendance</p>
            <p className="text-4xl font-black text-slate-950">78%</p>
            <p className="mt-1 text-sm font-bold text-emerald-700">You are above the 75% minimum.</p>
          </div>
          <ItemList rows={rows} icon={ClipboardCheck} />
          {rows.some((row) => Number.parseInt(row.info, 10) < 75) ? (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">Warning: One subject is below 75%. Attend the next classes.</p>
          ) : null}
        </div>
      )
    });
  }

  async function registerEvent(item: MockItem) {
    setRegisteredEvents((current) => Array.from(new Set([...current, item.title])));
    await apiRequest("/api/events/register", { method: "POST", body: JSON.stringify({ eventId: "EVT-1" }) }).catch((error) => notify(error.message));
    notify(`${item.title} registered`);
    setModal({
      title: "QR Pass Generated",
      body: (
        <div className="text-center">
          <div className="mx-auto grid size-44 place-items-center rounded-3xl border-8 border-slate-900 bg-white">
            <QrCode size={96} className="text-slate-950" />
          </div>
          <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
          <p className="mt-1 text-sm font-bold text-slate-500">Student: Rahul Sharma</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Pass ID: CC-{item.title.slice(0, 4).toUpperCase()}-2026</p>
        </div>
      )
    });
  }

  async function applyJob(item: MockItem) {
    setAppliedJobs((current) => Array.from(new Set([...current, item.title])));
    await apiRequest("/api/placements/apply", { method: "POST", body: JSON.stringify({ driveId: item.title === "Amazon" ? "DRV-AMZ" : "DRV-MS", resumeUrl: "resume.txt" }) }).catch((error) => notify(error.message));
    notify(`Applied to ${item.title}`);
    setModal({
      title: "Application Tracking",
      body: (
        <div className="space-y-3">
          {["Applied", "Under Review", "Shortlisted"].map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <span className={cn("grid size-9 place-items-center rounded-full text-sm font-black", index === 0 ? "bg-emerald-500 text-white" : "bg-indigo-50 text-indigo-700")}>{index + 1}</span>
              <div>
                <p className="font-black text-slate-950">{step}</p>
                <p className="text-sm font-bold text-slate-500">{index === 0 ? "Completed just now" : "Mock status queued"}</p>
              </div>
            </div>
          ))}
        </div>
      )
    });
  }

  function downloadNote(item: MockItem) {
    downloadMockFile(`${item.title.replace(/\s+/g, "-").toLowerCase()}.txt`, `${item.title}\n${item.meta}\nMock PDF download for CampusOS.`);
    notify("Download started");
  }

  async function handleItemAction(item: MockItem) {
    if (module === "notes") return downloadNote(item);
    if (module === "events") {
      if (currentUser?.role === "student") return registerEvent(item);
      setModal({ title: item.title, body: <ItemList rows={[item]} icon={CalendarDays} /> });
      notify(`${item.title} opened`);
      return;
    }
    if (module === "placements") return applyJob(item);
    if (module === "attendance") return openAttendanceReport();
    if (module === "assignments") {
      if (currentUser?.role !== "student") {
        setModal({ title: item.title, body: <ItemList rows={[item]} icon={ClipboardCheck} /> });
        notify(`${item.title} opened`);
        return;
      }
      await apiRequest("/api/assignments/submit", { method: "POST", body: JSON.stringify({ assignmentId: "ASG-1", link: "https://example.com/submission" }) }).catch((error) => notify(error.message));
      notify(`${item.title} submitted`);
      return;
    }
    if (module === "leave") {
      if (currentUser?.role !== "student" && currentUser?.role !== "faculty") {
        setModal({ title: item.title, body: <ItemList rows={[item]} icon={CalendarDays} /> });
        notify(`${item.title} opened`);
        return;
      }
      await apiRequest("/api/leave", { method: "POST", body: JSON.stringify({ fromDate: "2026-07-01", toDate: "2026-07-02", reason: item.title }) }).catch((error) => notify(error.message));
      notify("Leave request saved");
      return;
    }
    if (module === "fees") {
      setModal({ title: "Fee Details", body: <ItemList rows={[item]} icon={FileText} /> });
      return;
    }
    if (module === "clubs") {
      setJoinedClubs((current) => Array.from(new Set([...current, item.title])));
      notify(`Joined ${item.title}`);
      return;
    }
    if (module === "admin") {
      setModal({ title: item.title, body: <ItemList rows={moduleContent.admin.items} icon={ShieldCheck} /> });
      return;
    }
    if (module === "faculty") {
      openCreateModal(item.title);
      return;
    }
    if (module === "resume") {
      downloadMockFile("rahul-sharma-resume.txt", "Rahul Sharma\nMCA Student\nSkills: Next.js, TypeScript, Java\nProject: Campus Connect");
      notify("Resume downloaded");
      return;
    }
    if (module === "settings") {
      notify(`${item.title} updated`);
      return;
    }
    setModal({ title: item.title, body: <ItemList rows={[item]} icon={Icon} /> });
  }

  function itemActionLabel(item: MockItem) {
    if (module === "events" && currentUser?.role !== "student") return "Open";
    if (module === "assignments" && currentUser?.role !== "student") return "Open";
    if (module === "leave" && currentUser?.role !== "student" && currentUser?.role !== "faculty") return "Open";
    if (module === "events" && registeredEvents.includes(item.title)) return "Registered";
    if (module === "placements" && appliedJobs.includes(item.title)) return "Applied";
    if (module === "clubs" && joinedClubs.includes(item.title)) return "Joined";
    return data.action;
  }

  if (module === "resume") {
    return <ResumeBuilderScreen />;
  }

  if (module === "settings") {
    return <SettingsScreen />;
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <Modal modal={modal} onClose={closeModal} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{data.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">{data.subtitle}</p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white"><Icon size={26} /></span>
        </div>
      </section>

      {showChart ? <div className="mb-5"><AttendanceChart /></div> : null}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder={`Search ${data.title.toLowerCase()}...`} />
        </div>
        <Button variant="outline" onClick={() => setModal({
          title: "Filter",
          body: (
            <div className="grid gap-2 sm:grid-cols-2">
              {["All", "Recent", "Popular", "Active"].map((option) => (
                <Button key={option} variant={filter === option ? "primary" : "outline"} onClick={() => { setFilter(option); closeModal(); notify(`Filter: ${option}`); }}>{option}</Button>
              ))}
            </div>
          )
        })}>Filter: {filter}</Button>
        {canCreateModule ? <Button onClick={() => openCreateModal()}>{module === "lost-found" ? "Report Item" : "Create New"}</Button> : null}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("grid size-12 place-items-center rounded-2xl", toneMap[item.tone])}><Icon size={22} /></span>
                <Badge>{item.badge}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{item.meta}</p>
              <p className="mt-4 text-lg font-black text-slate-700">{item.info}</p>
              <Button className="mt-5 w-full" onClick={() => handleItemAction(item)}>
                {module === "notes" ? <Download size={16} /> : null}
                {itemActionLabel(item)}
              </Button>
            </div>
          </motion.div>
        ))}
      </section>
      {filteredItems.length === 0 ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">No matching mock records found.</div> : null}
    </AppShell>
  );
}

function ResumeBuilderScreen() {
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    name: "Rahul Sharma",
    email: "rahul@campus.test",
    skills: "Next.js, TypeScript, Java, MongoDB",
    education: "MCA - 2nd Year, Computer Applications",
    projects: "Campus Connect - Premium campus SaaS dashboard"
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Resume Builder</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Create a clean placement-ready resume preview.</p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white"><BookOpen size={26} /></span>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
          <div className="grid gap-3">
            {(Object.keys(form) as Array<keyof typeof form>).map((key) => (
              <label key={key} className="text-sm font-black capitalize text-slate-700">
                {key}
                <textarea
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  rows={key === "name" || key === "email" ? 1 : 3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </label>
            ))}
            <Button onClick={() => { downloadMockFile("rahul-sharma-resume.txt", Object.values(form).join("\n\n")); notify("Resume downloaded"); }}>
              <Download size={16} /> Download
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Live Preview</p>
          <h2 className="mt-4 text-3xl font-black text-slate-950">{form.name}</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{form.email}</p>
          {(["skills", "education", "projects"] as Array<keyof typeof form>).map((key) => (
            <section key={key} className="mt-5 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">{key}</h3>
              <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">{form[key]}</p>
            </section>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SettingsScreen() {
  const [toast, setToast] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({ name: "Rahul Sharma", email: "rahul@campus.test" });
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name ?? "", email: user.email ?? "" });
    }
  }, [user]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function logout() {
    void signOut({ callbackUrl: "/login" });
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Settings</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Manage profile, notifications, theme and account status.</p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white"><Settings size={26} /></span>
        </div>
      </section>

      <section className={cn("grid gap-5 xl:grid-cols-[1fr_0.8fr]", darkMode && "rounded-3xl bg-slate-900 p-4")}>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
          <h2 className="text-xl font-black text-slate-950">Profile</h2>
          <div className="mt-4 grid gap-3">
            <input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            <input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            <Button onClick={() => notify("Profile updated")}>Save Profile</Button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Notifications</h2>
                <p className="text-sm font-bold text-slate-500">{notifications ? "Enabled" : "Disabled"}</p>
              </div>
              <Button onClick={() => { setNotifications((value) => !value); notify("Notification setting updated"); }}>{notifications ? "Turn Off" : "Turn On"}</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Dark mode UI</h2>
                <p className="text-sm font-bold text-slate-500">{darkMode ? "Preview enabled" : "Preview disabled"}</p>
              </div>
              <Button variant="outline" onClick={() => { setDarkMode((value) => !value); notify("Theme preview updated"); }}>{darkMode ? "Light" : "Dark"}</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
            <h2 className="text-xl font-black text-slate-950">Account</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{user?.campusId ?? "Campus ID"} • {user?.role?.replace(/_/g, " ") ?? "Campus user"}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/settings/change-password" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 active:translate-y-0">
                <KeyRound size={16} />
                Change Password
              </Link>
              <Button variant="outline" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

const demoStudents = [
  { campusId: "MCA2026001", name: "Rahul Sharma", department: "MCA", semester: "2", section: "A" },
  { campusId: "MCA2026002", name: "MCA Student 002", department: "MCA", semester: "2", section: "A" },
  { campusId: "MCA2026003", name: "MCA Student 003", department: "MCA", semester: "2", section: "A" }
];

const subjectOptions = [
  { code: "MCA201", name: "Data Structures" },
  { code: "MCA202", name: "DBMS" },
  { code: "MCA203", name: "Operating Systems" }
];

async function jsonRequest(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "Request failed");
    return payload;
  } catch (error) {
    if (typeof window !== "undefined" && window.localStorage.getItem("campusDemoMode") === "enabled") {
      return demoPayloadFor(path);
    }
    throw error;
  }
}

function demoPayloadFor(path: string) {
  const token = `QR-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (path.includes("/api/attendance/session")) {
    return { session: { id: `DEMO-${Date.now()}`, qrToken: token, qrExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), status: "open" }, records: [] };
  }
  if (path.includes("/api/attendance/scan")) {
    return { record: { id: `SCAN-${Date.now()}`, status: "present" } };
  }
  if (path.includes("/api/admin/users/bulk-create-students")) {
    return { users: [], temporaryPassword: "Campus@123" };
  }
  if (path.includes("/api/placements/apply")) {
    return { application: { id: `APP-${Date.now()}`, status: "Applied" } };
  }
  return { success: true, demo: true };
}

function assistantReply(question: string, user?: CampusSessionUser | null) {
  const q = question.toLowerCase();
  if (/attendance|present|absent/.test(q)) {
    return "Your attendance dashboard shows subject-wise percentages. DBMS is safe in the demo data, and Operating Systems needs attention if it drops below 75%.";
  }
  if (/placement|company|drive|job/.test(q)) {
    return "Open demo drives include Microsoft, Amazon and Deloitte. Use Placement Eligibility to check CGPA, backlogs and skills against company criteria.";
  }
  if (/dbms|note|notes|pdf/.test(q)) {
    return "DBMS notes are available in the Notes section. Students see only approved notes, while faculty uploads go to HOD approval first.";
  }
  if (/event|workshop|upcoming/.test(q)) {
    return "Upcoming demo events include Web Development Workshop, CodeSprint 3.0 and Annual Sports Meet. Students can register and generate a QR pass.";
  }
  return `Hi ${user?.name || "there"}, I can help with attendance, notes, events, placements, ID card and campus workflows. Try asking: Show my attendance.`;
}

export function AssistantPage() {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; text: string }>>([
    { id: "welcome", role: "assistant", text: "Campus Assistant is ready. Ask about attendance, notes, events or placements." }
  ]);
  const examples = ["Show my attendance", "What placements are open?", "Find DBMS notes", "What events are upcoming?"];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function ask(question = input) {
    try {
      const clean = question.trim();
      if (!clean) {
        notify("Ask a campus question");
        return;
      }
      const userMessage = { id: `user-${Date.now()}`, role: "user" as const, text: clean };
      const assistantMessage = { id: `assistant-${Date.now()}`, role: "assistant" as const, text: assistantReply(clean, user) };
      setMessages((current) => [...current, userMessage, assistantMessage]);
      setInput("");
    } catch {
      notify("Assistant answered in demo mode");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">AI Campus Assistant</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Mock assistant for notes, attendance, events and placements. No paid API required.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
        <SectionCard title="Campus Chat" eyebrow="Demo assistant" icon={Sparkles}>
          <div className="mb-4 max-h-[420px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-3">
            {messages.map((message) => (
              <div key={message.id} className={cn("max-w-[88%] rounded-2xl p-3 text-sm font-bold leading-6", message.role === "assistant" ? "bg-white text-slate-700 shadow-sm" : "ml-auto bg-indigo-600 text-white")}>{message.text}</div>
            ))}
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void ask(); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} className="h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Ask about attendance, notes, events..." />
            <Button type="submit">Ask</Button>
          </form>
        </SectionCard>
        <SectionCard title="Example Questions" eyebrow="One tap prompts" icon={MessageSquareText}>
          <div className="grid gap-3">
            {examples.map((question) => <Button key={question} variant="outline" onClick={() => { void ask(question); }}>{question}</Button>)}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function PlacementEligibilityPage() {
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ cgpa: "8.0", backlogs: "0", skills: "React, Java, SQL" });
  const [checked, setChecked] = useState(false);
  const skillSet = form.skills.toLowerCase().split(",").map((skill) => skill.trim()).filter(Boolean);
  const results = eligibilityCompanies.map((company) => {
    const cgpaOk = Number(form.cgpa) >= company.minCgpa;
    const backlogsOk = Number(form.backlogs) <= company.maxBacklogs;
    const matchedSkills = company.skills.filter((skill) => skillSet.includes(skill));
    const skillsOk = matchedSkills.length > 0;
    const eligible = cgpaOk && backlogsOk && skillsOk;
    const reason = eligible
      ? `Matched ${matchedSkills.join(", ")} and meets CGPA/backlog criteria.`
      : [
        !cgpaOk ? `CGPA needs ${company.minCgpa}+` : "",
        !backlogsOk ? `Backlogs must be ${company.maxBacklogs} or less` : "",
        !skillsOk ? `Add one skill from ${company.skills.join(", ")}` : ""
      ].filter(Boolean).join(". ");
    return { ...company, eligible, reason };
  });

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function checkEligibility() {
    try {
      setChecked(true);
      notify("Eligibility checked");
    } catch {
      notify("Eligibility checked in demo mode");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Placement Eligibility</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Check CGPA, backlogs and skills against demo company criteria.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Student Profile" eyebrow="Eligibility inputs" icon={Trophy}>
          <div className="grid gap-3">
            <input value={form.cgpa} onChange={(event) => setForm((current) => ({ ...current, cgpa: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="CGPA" />
            <input value={form.backlogs} onChange={(event) => setForm((current) => ({ ...current, backlogs: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Backlogs" />
            <input value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Skills separated by comma" />
            <Button onClick={checkEligibility}>Check Eligibility</Button>
          </div>
        </SectionCard>
        <SectionCard title="Company Match" eyebrow={checked ? "Results ready" : "Preview"} icon={BriefcaseBusiness}>
          <div className="space-y-3">
            {results.map((company) => (
              <div key={company.company} className={cn("rounded-2xl p-4", company.eligible ? "bg-emerald-50" : "bg-slate-50")}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{company.company}</p>
                    <p className="text-xs font-bold text-slate-500">{company.role} • {company.package}</p>
                  </div>
                  <Badge className={company.eligible ? "bg-white text-emerald-700" : "bg-white text-slate-600"}>{company.eligible ? "Eligible" : "Not Eligible"}</Badge>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">{company.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function DigitalIdCardPage() {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const profile = {
    name: user?.name || "Rahul Sharma",
    campusId: user?.campusId || "MCA2026001",
    department: user?.department || "MCA",
    semester: user?.semester || "2",
    section: user?.section || "A"
  };

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function downloadId() {
    try {
      downloadMockFile(`${profile.campusId}-digital-id.txt`, Object.entries(profile).map(([key, value]) => `${key}: ${value}`).join("\n"));
      notify("Digital ID downloaded");
    } catch {
      notify("Digital ID ready");
    }
  }

  function printId() {
    try {
      window.print();
      notify("Print dialog opened");
    } catch {
      notify("Print ready");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Digital ID Card</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Student verification card with QR-style campus proof.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1fr]">
        <SectionCard title="Student ID" eyebrow="Verified profile" icon={UserRound} action={<div className="flex gap-2"><Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={downloadId}>Download</Button><Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={printId}>Print</Button></div>}>
          <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl font-black text-white">{profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">{profile.name}</h2>
                <p className="text-sm font-bold text-slate-500">{profile.campusId}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-3"><p className="text-xs font-bold text-slate-400">Department</p><p className="font-black text-slate-950">{profile.department}</p></div>
              <div className="rounded-2xl bg-white p-3"><p className="text-xs font-bold text-slate-400">Semester</p><p className="font-black text-slate-950">{profile.semester}</p></div>
              <div className="rounded-2xl bg-white p-3"><p className="text-xs font-bold text-slate-400">Section</p><p className="font-black text-slate-950">{profile.section}</p></div>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Verification QR" eyebrow="Campus Connect" icon={QrCode}>
          <div className="mx-auto grid max-w-[260px] aspect-square grid-cols-7 gap-1 rounded-3xl border-8 border-slate-900 bg-white p-4">
            {Array.from({ length: 49 }).map((_, index) => {
              const active = (profile.campusId.charCodeAt(index % profile.campusId.length) + index) % 3 !== 0;
              return <span key={`id-qr-${index}`} className={cn("rounded-sm", active ? "bg-slate-950" : "bg-white")} />;
            })}
          </div>
          <p className="mt-4 text-center text-sm font-bold text-slate-500">Verification ID: CC-{profile.campusId}</p>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function AdminBulkStudentsPage() {
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ department: "MCA", year: "2026", startRoll: "1", count: "5", semester: "1", section: "A", temporaryPassword: "Campus@123" });
  const preview = useMemo(() => {
    return Array.from({ length: Math.max(0, Number(form.count || 0)) }, (_, index) => {
      const roll = String(Number(form.startRoll || 1) + index).padStart(3, "0");
      const campusId = `${form.department.toUpperCase()}${form.year}${roll}`;
      return { campusId, name: `${form.department.toUpperCase()} Student ${roll}`, password: form.temporaryPassword };
    });
  }, [form]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function createStudents() {
    try {
      const payload = await jsonRequest("/api/admin/users/bulk-create-students", { method: "POST", body: JSON.stringify({ ...form, startRoll: Number(form.startRoll), count: Number(form.count) }) });
      notify(`${payload.users?.length ?? preview.length} student IDs created`);
    } catch {
      notify("Student IDs created in local demo mode");
    }
  }

  function exportCsv() {
    try {
      const csv = ["Campus ID,Name,Temporary Password", ...preview.map((student) => `${student.campusId},${student.name},${student.password}`)].join("\n");
      downloadMockFile("bulk-student-credentials.csv", csv);
      notify("Credentials CSV exported");
    } catch {
      notify("CSV ready");
    }
  }

  async function copyCredentials() {
    try {
      await navigator.clipboard?.writeText(preview.map((student) => `${student.campusId} / ${student.password}`).join("\n"));
      notify("Credentials copied");
    } catch {
      exportCsv();
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Bulk Student Generator</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Preview, create, copy and export generated student credentials.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Generator" eyebrow="Admin workflow" icon={GraduationCap}>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={form.department} onChange={(event) => update("department", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold uppercase outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Department" />
              <input value={form.year} onChange={(event) => update("year", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Year" />
              <input value={form.startRoll} onChange={(event) => update("startRoll", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Start roll" />
              <input value={form.count} onChange={(event) => update("count", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Count" />
              <input value={form.semester} onChange={(event) => update("semester", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Semester" />
              <input value={form.section} onChange={(event) => update("section", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold uppercase outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Section" />
            </div>
            <input value={form.temporaryPassword} onChange={(event) => update("temporaryPassword", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Temporary password" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { void createStudents(); }}>Create</Button>
              <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
              <Button variant="outline" onClick={() => { void copyCredentials(); }}>Copy Credentials</Button>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Preview" eyebrow={`${preview.length} ID(s)`} icon={UsersRound}>
          <div className="space-y-3">
            {preview.map((student) => (
              <div key={student.campusId} className="grid gap-2 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_auto] md:items-center">
                <div><p className="font-black text-slate-950">{student.name}</p><p className="text-xs font-bold text-slate-500">{student.campusId}</p></div>
                <Badge>{student.password}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function DemoModePage() {
  const [toast, setToast] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(typeof window !== "undefined" && window.localStorage.getItem("campusDemoMode") === "enabled");
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function enableDemoMode() {
    try {
      window.localStorage.setItem("campusDemoMode", "enabled");
      setEnabled(true);
      const response = await fetch("/api/seed");
      if (!response.ok) {
        notify("Demo mode enabled locally. Seed route unavailable.");
        return;
      }
      notify("Demo mode enabled and sample data seeded");
    } catch {
      window.localStorage.setItem("campusDemoMode", "enabled");
      setEnabled(true);
      notify("Demo mode enabled locally");
    }
  }

  function disableDemoMode() {
    try {
      window.localStorage.removeItem("campusDemoMode");
      setEnabled(false);
      notify("Demo mode disabled");
    } catch {
      notify("Demo mode updated");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Demo Mode</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Prepare the app for a safe presentation flow with seeded sample data and local success fallback.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Submission Demo Mode" eyebrow={enabled ? "Enabled" : "Disabled"} icon={Sparkles}>
          <div className="space-y-4">
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">Demo mode seeds sample data when allowed and makes demo actions fall back to success locally if MongoDB/API calls are unavailable.</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { void enableDemoMode(); }}>Enable Demo Mode</Button>
              <Button variant="outline" onClick={disableDemoMode}>Disable</Button>
              <Button variant="outline" onClick={() => notify("Demo action completed successfully")}>Test Success Toast</Button>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Presentation Checklist" eyebrow="Crash-safe flow" icon={ShieldCheck}>
          <div className="space-y-3">
            {["Login demo accounts", "Open AI Assistant", "Generate QR attendance", "Scan attendance", "Export bulk credentials", "Show audit logs"].map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">{item}</div>)}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function FacultyAttendancePage() {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ subjectCode: "MCA201", semester: "2", section: "A", date: new Date().toISOString().slice(0, 10) });
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>({ MCA2026001: "present", MCA2026002: "present", MCA2026003: "absent" });
  const subject = subjectOptions.find((item) => item.code === form.subjectCode) ?? subjectOptions[0];
  const students = demoStudents.filter((student) => student.semester === form.semester && student.section === form.section);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function saveAttendance() {
    try {
      await jsonRequest("/api/attendance/session", {
        method: "POST",
        body: JSON.stringify({
          department: user?.department || "MCA",
          semester: form.semester,
          section: form.section,
          subject: subject.name,
          subjectCode: subject.code,
          date: form.date,
          records: students.map((student) => ({
            studentCampusId: student.campusId,
            studentName: student.name,
            status: statuses[student.campusId] || "absent"
          }))
        })
      });
      notify("Attendance saved successfully");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Attendance saved in demo mode");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Mark Attendance</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Save daily subject-wise attendance for your class.</p>
      </section>
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Class Details" eyebrow="Faculty workflow" icon={ClipboardCheck}>
          <div className="grid gap-3">
            <select value={form.subjectCode} onChange={(event) => setForm((current) => ({ ...current, subjectCode: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">
              {subjectOptions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
            <select value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="1">Semester 1</option><option value="2">Semester 2</option></select>
            <select value={form.section} onChange={(event) => setForm((current) => ({ ...current, section: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="A">Section A</option><option value="B">Section B</option></select>
            <input value={form.date} type="date" onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            <Button onClick={saveAttendance}>Save Attendance</Button>
          </div>
        </SectionCard>
        <SectionCard title="Student List" eyebrow={`${subject.name} • ${form.date}`} icon={UsersRound}>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.campusId} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-black text-slate-950">{student.name}</p>
                  <p className="text-xs font-bold text-slate-500">{student.campusId} • Semester {student.semester} • Section {student.section}</p>
                </div>
                <div className="flex gap-2">
                  {(["present", "absent"] as const).map((status) => (
                    <Button key={status} variant={statuses[student.campusId] === status ? "primary" : "outline"} className="min-h-9 px-3 py-1.5 capitalize" onClick={() => setStatuses((current) => ({ ...current, [student.campusId]: status }))}>{status}</Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function FacultyQrAttendancePage() {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ subjectCode: "MCA201", semester: "2", section: "A", date: new Date().toISOString().slice(0, 10) });
  const [session, setSession] = useState<any>(null);
  const subject = subjectOptions.find((item) => item.code === form.subjectCode) ?? subjectOptions[0];
  const token = session?.qrToken || "";

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function generateToken() {
    try {
      const payload = await jsonRequest("/api/attendance/session", {
        method: "POST",
        body: JSON.stringify({
          department: user?.department || "MCA",
          semester: form.semester,
          section: form.section,
          subject: subject.name,
          subjectCode: subject.code,
          date: form.date
        })
      });
      setSession(payload.session ?? payload);
      notify("QR attendance token generated");
    } catch {
      setSession({
        id: `LOCAL-${Date.now()}`,
        qrToken: `QR-${subject.code}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        qrExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        status: "open"
      });
      notify("Demo QR token generated locally");
    }
  }

  async function copyToken() {
    try {
      await navigator.clipboard?.writeText(token);
      notify("Token copied");
    } catch {
      notify("Token ready to share");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">QR Attendance</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Generate a five-minute attendance token for students to scan.</p>
      </section>
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Session Details" eyebrow="Faculty QR demo" icon={QrCode}>
          <div className="grid gap-3">
            <select value={form.subjectCode} onChange={(event) => setForm((current) => ({ ...current, subjectCode: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">
              {subjectOptions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <select value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="1">Semester 1</option><option value="2">Semester 2</option></select>
              <select value={form.section} onChange={(event) => setForm((current) => ({ ...current, section: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="A">Section A</option><option value="B">Section B</option></select>
            </div>
            <input value={form.date} type="date" onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            <Button onClick={() => { void generateToken(); }}>Generate QR Token</Button>
          </div>
        </SectionCard>
        <SectionCard title="QR Token" eyebrow={token ? "Expires in 5 minutes" : "Not generated"} icon={QrCode} action={token ? <Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => { void copyToken(); }}>Copy</Button> : null}>
          <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
            <div className="grid aspect-square grid-cols-7 gap-1 rounded-3xl border-8 border-slate-900 bg-white p-4">
              {Array.from({ length: 49 }).map((_, index) => {
                const active = token ? (token.charCodeAt(index % token.length) + index) % 3 !== 0 : index % 2 === 0;
                return <span key={`faculty-qr-${index}`} className={cn("rounded-sm", active ? "bg-slate-950" : "bg-white")} />;
              })}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Share token</p>
              <p className="mt-3 break-all rounded-2xl bg-slate-50 p-4 text-lg font-black text-slate-950">{token || "Generate a token to start attendance."}</p>
              {session?.qrExpiresAt ? <p className="mt-3 text-sm font-bold text-slate-500">Expires at {new Date(session.qrExpiresAt).toLocaleTimeString()}</p> : null}
            </div>
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function StudentScanAttendancePage() {
  const [toast, setToast] = useState("");
  const [token, setToken] = useState("QR-MCA201-2026");
  const [scannedTokens, setScannedTokens] = useState<string[]>([]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function scanToken() {
    const normalized = token.trim().toUpperCase();
    if (!normalized) {
      notify("Enter attendance token");
      return;
    }
    if (scannedTokens.includes(normalized)) {
      notify("Attendance already marked for this token");
      return;
    }
    try {
      await jsonRequest("/api/attendance/scan", { method: "POST", body: JSON.stringify({ qrToken: normalized }) });
      setScannedTokens((current) => [...current, normalized]);
      notify("Attendance marked successfully");
    } catch {
      setScannedTokens((current) => [...current, normalized]);
      notify("Demo attendance marked locally");
    }
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Scan Attendance</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Enter the faculty QR token to mark today's class attendance.</p>
      </section>
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Attendance Token" eyebrow="Student scan demo" icon={QrCode}>
          <div className="grid gap-3">
            <input value={token} onChange={(event) => setToken(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold uppercase outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="QR-MCA201-2026" />
            <Button onClick={() => { void scanToken(); }}>Mark Attendance</Button>
          </div>
        </SectionCard>
        <SectionCard title="Scan Status" eyebrow={`${scannedTokens.length} token(s) marked`} icon={CheckCircle2}>
          <div className="space-y-3">
            {scannedTokens.map((item) => <div key={item} className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4"><span className="font-black text-slate-950">{item}</span><Badge className="bg-white text-emerald-700">Present</Badge></div>)}
            {!scannedTokens.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No attendance marked in this demo session.</p> : null}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function StudentAttendancePage() {
  const [toast, setToast] = useState("");
  const [summary, setSummary] = useState<{ records: any[]; subjects: any[]; total: number; warning: boolean }>({ records: [], subjects: [], total: 0, warning: false });

  useEffect(() => {
    fetch("/api/attendance/me")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load attendance")))
      .then((data) => setSummary(data))
      .catch((error) => setToast(error.message));
  }, []);

  const monthly = Object.values(summary.records.reduce((acc: Record<string, any>, record: any) => {
    const month = new Date(record.date).toLocaleString("en", { month: "short" });
    acc[month] ??= { month, total: 0, present: 0 };
    acc[month].total += 1;
    if (record.status === "present") acc[month].present += 1;
    return acc;
  }, {})).map((row: any) => ({ ...row, percentage: row.total ? Math.round((row.present / row.total) * 100) : 0 }));
  const lowSubjects = summary.subjects
    .filter((subject: any) => Number(subject.percentage) < 75)
    .map((subject: any) => ({
      ...subject,
      needed: Math.max(1, Math.ceil(((0.75 * Number(subject.total || 0)) - Number(subject.present || 0)) / 0.25))
    }));

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Attendance</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Subject-wise and monthly attendance summary.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Overall Attendance" eyebrow="Current semester" icon={CheckCircle2}>
          <div className="grid place-items-center py-8 text-center">
            <p className="text-5xl font-black text-slate-950">{summary.total}%</p>
            <p className={cn("mt-3 rounded-2xl px-4 py-2 text-sm font-black", summary.warning ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700")}>{summary.warning ? "Low attendance warning: below 75%" : "Above 75% minimum"}</p>
          </div>
        </SectionCard>
        <SectionCard title="Subject Percentages" eyebrow="Only your records" icon={ClipboardCheck}>
          <div className="space-y-3">
            {summary.subjects.map((subject: any) => <div key={subject.subject} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div><p className="font-black text-slate-950">{subject.subject}</p><p className="text-xs font-bold text-slate-500">{subject.present}/{subject.total} present</p></div><Badge>{subject.percentage}%</Badge></div>)}
          </div>
        </SectionCard>
      </section>
      <section className="mt-5">
        <SectionCard title="Smart Low Attendance Alerts" eyebrow={lowSubjects.length ? "Action needed" : "All clear"} icon={ShieldCheck}>
          <div className="space-y-3">
            {lowSubjects.map((subject: any) => (
              <div key={`low-${subject.subject}`} className="rounded-2xl bg-amber-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{subject.subject}</p>
                    <p className="text-sm font-bold text-amber-700">{subject.percentage}% attendance. Attend the next {subject.needed} class(es) to reach the safe zone.</p>
                  </div>
                  <Badge className="bg-white text-amber-700">Below 75%</Badge>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Suggestion: prioritize this subject this week and avoid optional absences until it crosses 75%.</p>
              </div>
            ))}
            {!lowSubjects.length ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-700">No subject is below 75%. Keep attending regularly to stay safe.</p> : null}
          </div>
        </SectionCard>
      </section>
      <section className="mt-5">
        <SectionCard title="Monthly Attendance" eyebrow="Month-wise trend" icon={CalendarDays}>
          <div className="grid gap-3 md:grid-cols-3">
            {monthly.map((row: any) => <div key={row.month} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-slate-950">{row.month}</p><p className="mt-1 text-2xl font-black text-slate-700">{row.percentage}%</p></div>)}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function HodAttendancePage({ principal = false }: { principal?: boolean }) {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const [filters, setFilters] = useState({ semester: "2", section: "A", subject: "Data Structures" });
  const [data, setData] = useState<{ records: any[]; students: any[]; lowAttendance: any[] }>({ records: [], students: [], lowAttendance: [] });

  async function load() {
    const params = new URLSearchParams({ semester: filters.semester, section: filters.section, subject: filters.subject, department: user?.department || "MCA" });
    const response = await fetch(`/api/attendance/department?${params.toString()}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Unable to load attendance");
    setData(payload);
  }

  useEffect(() => {
    load().catch((error) => setToast(error.message));
  }, [filters.semester, filters.section, filters.subject, user?.department]);

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{principal ? "Attendance Analytics" : "Department Attendance"}</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Filter by semester, section and subject to review low attendance.</p>
      </section>
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <select value={filters.semester} onChange={(event) => setFilters((current) => ({ ...current, semester: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="1">Semester 1</option><option value="2">Semester 2</option></select>
        <select value={filters.section} onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="A">Section A</option><option value="B">Section B</option></select>
        <select value={filters.subject} onChange={(event) => setFilters((current) => ({ ...current, subject: event.target.value }))} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">{subjectOptions.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}</select>
      </div>
      <section className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Student Attendance" eyebrow={`${data.records.length} records`} icon={ClipboardCheck}>
          <div className="space-y-3">
            {data.students.map((student) => <div key={student.studentCampusId} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div><p className="font-black text-slate-950">{student.studentName}</p><p className="text-xs font-bold text-slate-500">{student.studentCampusId}</p></div><Badge>{student.percentage}%</Badge></div>)}
          </div>
        </SectionCard>
        <SectionCard title="Low Attendance Students" eyebrow="Below 75%" icon={ShieldCheck}>
          <div className="space-y-3">
            {data.lowAttendance.map((student) => <div key={student.studentCampusId} className="rounded-2xl bg-amber-50 p-3"><p className="font-black text-slate-950">{student.studentName}</p><p className="text-sm font-bold text-amber-700">{student.percentage}% attendance</p></div>)}
            {!data.lowAttendance.length ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-700">No low attendance students for this filter.</p> : null}
          </div>
        </SectionCard>
      </section>
    </AppShell>
  );
}

export function FacultyNotesPage() {
  const user = useCurrentUser();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", subject: "Data Structures", department: "MCA", semester: "2", fileUrl: "", description: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await jsonRequest("/api/notes", { method: "POST", body: JSON.stringify({ ...form, department: form.department || user?.department || "MCA" }) });
    setToast("Note uploaded for HOD approval");
    setForm((current) => ({ ...current, title: "", fileUrl: "", description: "" }));
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Upload Notes</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Submit study material for HOD approval.</p>
      </section>
      <SectionCard title="Note Details" eyebrow="Faculty upload" icon={Upload}>
        <form onSubmit={submit} className="grid gap-3">
          <input value={form.title} onChange={(event) => update("title", event.target.value)} required className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Note title" />
          <select value={form.subject} onChange={(event) => update("subject", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">{subjectOptions.map((item) => <option key={item.code}>{item.name}</option>)}</select>
          <div className="grid gap-3 md:grid-cols-3">
            <input value={form.department} onChange={(event) => update("department", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Department" />
            <select value={form.semester} onChange={(event) => update("semester", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="1">Semester 1</option><option value="2">Semester 2</option></select>
            <input value={form.fileUrl} onChange={(event) => update("fileUrl", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="PDF/file URL or leave blank" />
          </div>
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Description" />
          <Button type="submit">Submit</Button>
        </form>
      </SectionCard>
    </AppShell>
  );
}

export function HodNotesApprovalPage() {
  const [toast, setToast] = useState("");
  const [notesList, setNotesList] = useState<any[]>([]);

  async function load() {
    const response = await fetch("/api/notes?status=Pending");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Unable to load notes");
    setNotesList(payload.notes ?? []);
  }

  useEffect(() => {
    load().catch((error) => setToast(error.message));
  }, []);

  async function review(noteId: string, status: "Approved" | "Rejected") {
    await jsonRequest("/api/notes/approve", { method: "POST", body: JSON.stringify({ noteId, status }) });
    setNotesList((current) => current.filter((note) => note.id !== noteId));
    setToast(`Note ${status.toLowerCase()}`);
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Notes Approval</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Approve or reject faculty uploads.</p>
      </section>
      <SectionCard title="Pending Notes" eyebrow={`${notesList.length} waiting`} icon={FileText}>
        <div className="space-y-3">
          {notesList.map((note) => (
            <div key={note.id} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_auto] md:items-center">
              <div><p className="font-black text-slate-950">{note.title}</p><p className="text-xs font-bold text-slate-500">{note.subject} • Semester {note.semester} • {note.uploadedBy}</p></div>
              <div className="flex gap-2"><Button className="min-h-9 px-3 py-1.5" onClick={() => review(note.id, "Approved")}>Approve</Button><Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={() => review(note.id, "Rejected")}>Reject</Button></div>
            </div>
          ))}
          {!notesList.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No pending notes.</p> : null}
        </div>
      </SectionCard>
    </AppShell>
  );
}

export function StudentNotesPage() {
  const [toast, setToast] = useState("");
  const [notesList, setNotesList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  useEffect(() => {
    fetch("/api/notes?status=Approved")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load notes")))
      .then((data) => setNotesList(data.notes ?? []))
      .catch((error) => setToast(error.message));
  }, []);

  const subjects = Array.from(new Set(notesList.map((note) => note.subject).filter(Boolean)));
  const filtered = notesList.filter((note) => `${note.title} ${note.subject}`.toLowerCase().includes(search.toLowerCase()) && (subject === "all" || note.subject === subject));

  function downloadNote(note: any) {
    if (note.fileUrl && !String(note.fileUrl).startsWith("/mock")) {
      window.open(note.fileUrl, "_blank");
    } else {
      downloadMockFile(`${String(note.title).replace(/\s+/g, "-").toLowerCase()}.txt`, `${note.title}\n${note.subject}\n${note.description || "Approved campus note download."}`);
    }
    setToast("Download started");
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Notes</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Approved notes only.</p>
      </section>
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Search notes" />
        <select value={subject} onChange={(event) => setSubject(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="all">All subjects</option>{subjects.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((note) => (
          <div key={note.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
            <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><FileText size={22} /></span>
            <h2 className="mt-5 text-xl font-black text-slate-950">{note.title}</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{note.subject} • Semester {note.semester}</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">{note.description || "Approved study material"}</p>
            <Button className="mt-5 w-full" onClick={() => downloadNote(note)}><Download size={16} /> Download</Button>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

export function PlacementApplicationsPage() {
  const [toast, setToast] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const statuses = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];

  async function load() {
    const response = await fetch("/api/placements/applications");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Unable to load applications");
    setApplications(payload.applications ?? []);
  }

  useEffect(() => {
    load().catch((error) => setToast(error.message));
  }, []);

  async function updateStatus(id: string, status: string) {
    await jsonRequest("/api/placements/applications", { method: "PATCH", body: JSON.stringify({ id, status }) });
    setApplications((current) => current.map((application) => application.id === id ? { ...application, status } : application));
    setToast("Application status updated");
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Applications</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Review and update placement application status.</p>
      </section>
      <SectionCard title="Placement Applications" eyebrow={`${applications.length} records`} icon={BriefcaseBusiness}>
        <div className="space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_220px] md:items-center">
              <div><p className="font-black text-slate-950">{application.studentName}</p><p className="text-xs font-bold text-slate-500">{application.studentCampusId} • {application.driveId}</p></div>
              <select value={application.status} onChange={(event) => updateStatus(application.id, event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            </div>
          ))}
          {!applications.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">No applications yet.</p> : null}
        </div>
      </SectionCard>
    </AppShell>
  );
}

export function PlacementHubPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [drives, setDrives] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [form, setForm] = useState({ companyName: "", role: "", package: "", eligibility: "", lastDate: new Date().toISOString().slice(0, 10), status: "Open" });
  const canManage = canPerformAction(user?.role, "placements:manage");
  const canApply = canPerformAction(user?.role, "placements:apply");

  async function load() {
    const [drivesResponse, applicationsResponse] = await Promise.all([
      fetch("/api/placements/drives"),
      fetch("/api/placements/applications")
    ]);
    const drivesPayload = await drivesResponse.json();
    const applicationsPayload = await applicationsResponse.json();
    if (!drivesResponse.ok) throw new Error(drivesPayload.message || "Unable to load drives");
    setDrives(drivesPayload.drives ?? []);
    setApplications(applicationsResponse.ok ? applicationsPayload.applications ?? [] : []);
  }

  useEffect(() => {
    load().catch((error) => setToast(error.message));
  }, [user?.role]);

  async function applyToDrive(drive: any) {
    const payload = await jsonRequest("/api/placements/apply", { method: "POST", body: JSON.stringify({ driveId: drive.id, resumeUrl: "resume.txt" }) });
    setApplications((current) => [...current.filter((item) => item.driveId !== drive.id), payload.application]);
    setToast("Status changed to Applied");
  }

  async function createDrive(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = await jsonRequest("/api/placements/drives", { method: "POST", body: JSON.stringify(form) });
    setDrives((current) => [payload.drive, ...current]);
    setForm({ companyName: "", role: "", package: "", eligibility: "", lastDate: new Date().toISOString().slice(0, 10), status: "Open" });
    setToast("Placement drive created");
  }

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applicationFor(driveId: string) {
    return applications.find((application) => application.driveId === driveId);
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Placement Hub</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Drives, applications and placement status.</p>
      </section>
      {canManage ? (
        <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <SectionCard title="Create Placement Drive" eyebrow="Placement officer/admin" icon={BriefcaseBusiness}>
            <form onSubmit={createDrive} className="grid gap-3">
              <input value={form.companyName} onChange={(event) => update("companyName", event.target.value)} required className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Company" />
              <div className="grid gap-3 md:grid-cols-2">
                <input value={form.role} onChange={(event) => update("role", event.target.value)} required className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Role" />
                <input value={form.package} onChange={(event) => update("package", event.target.value)} required className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Package" />
              </div>
              <input value={form.eligibility} onChange={(event) => update("eligibility", event.target.value)} required className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Eligibility" />
              <input value={form.lastDate} type="date" onChange={(event) => update("lastDate", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
              <Button type="submit">Create Drive</Button>
            </form>
          </SectionCard>
          <SectionCard title="Applications" eyebrow="Review pipeline" icon={FileText}>
            <Button className="w-full" onClick={() => router.push("/portal/placement/applications")}>View Applications</Button>
          </SectionCard>
        </section>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {drives.map((drive) => {
          const application = applicationFor(drive.id);
          return (
            <div key={drive.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><BriefcaseBusiness size={22} /></span>
              <h2 className="mt-5 text-xl font-black text-slate-950">{drive.companyName}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{drive.role} • {drive.eligibility}</p>
              <p className="mt-4 text-lg font-black text-slate-700">{drive.package}</p>
              {application ? <Badge className="mt-4">{application.status}</Badge> : null}
              {canApply ? <Button className="mt-5 w-full" onClick={() => applyToDrive(drive)}>{application ? application.status : "Apply"}</Button> : null}
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}

export function AdminUsersPage() {
  return <AdminPortalPage />;
}

function portalItems(portal: PortalKey): MockItem[] {
  const maps: Record<PortalKey, MockItem[]> = {
    student: [
      { title: "Attendance", meta: "Current semester", info: "78%", badge: "Safe", tone: "indigo" },
      { title: "Notes", meta: "Recommended PDFs", info: "4 new", badge: "Download", tone: "cyan" },
      { title: "Events", meta: "Registered events", info: "2 upcoming", badge: "QR Ready", tone: "emerald" },
      { title: "Achievements", meta: "Campus badges", info: "8 earned", badge: "Profile", tone: "amber" }
    ],
    faculty: moduleContent.faculty.items,
    hod: [
      { title: "Department Students", meta: "MCA / CSE", info: "420", badge: "Live", tone: "indigo" },
      { title: "Department Faculty", meta: "Assigned subjects", info: "32", badge: "Active", tone: "cyan" },
      { title: "Low Attendance", meta: "Below 75%", info: "18 students", badge: "Review", tone: "amber" },
      { title: "Event Requests", meta: "Pending approval", info: "06", badge: "Pending", tone: "violet" }
    ],
    principal: [
      { title: "Total Students", meta: "All departments", info: "4,820", badge: "Campus", tone: "indigo" },
      { title: "Total Faculty", meta: "All departments", info: "286", badge: "Faculty", tone: "cyan" },
      { title: "Placement Stats", meta: "Average package", info: "₹8.4 LPA", badge: "Reports", tone: "emerald" },
      { title: "Events Pending", meta: "Major approvals", info: "09", badge: "Approval", tone: "amber" },
      { title: "HOD Reports", meta: "Monthly submissions", info: "12", badge: "Reports", tone: "violet" },
      { title: "System Overview", meta: "CampusOS health", info: "99.9%", badge: "Healthy", tone: "blue" }
    ],
    admin: moduleContent.admin.items,
    placement: [
      { title: "Companies", meta: "Recruiter partners", info: "42", badge: "CRM", tone: "indigo" },
      { title: "Placement Drives", meta: "Open drives", info: "08", badge: "Open", tone: "emerald" },
      { title: "Applications", meta: "Current season", info: "318", badge: "Review", tone: "cyan" },
      { title: "Shortlisted", meta: "Across drives", info: "86", badge: "Shortlist", tone: "amber" },
      { title: "Package Analytics", meta: "Highest package", info: "₹24 LPA", badge: "Stats", tone: "violet" },
      { title: "Resume Database", meta: "Verified resumes", info: "740", badge: "ATS", tone: "blue" }
    ]
  };
  return maps[portal];
}

export function PortalPage({ portal }: { portal: PortalKey }) {
  const meta = portalMeta[portal];
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  if (portal === "admin") {
    return <AdminPortalPage />;
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <Modal modal={modal} onClose={() => setModal(null)} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{meta.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Role-based CampusOS workspace for {meta.role.replace("_", " ")} permissions.</p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white"><ShieldCheck size={26} /></span>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portalItems(portal).map((item) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
              <span className={cn("grid size-12 place-items-center rounded-2xl", toneMap[item.tone])}><ShieldCheck size={22} /></span>
              <h2 className="mt-5 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{item.meta}</p>
              <p className="mt-4 text-lg font-black text-slate-700">{item.info}</p>
              <Button className="mt-5 w-full" onClick={() => { setModal({ title: item.title, body: <ItemList rows={[item]} icon={ShieldCheck} /> }); notify(`${item.title} opened`); }}>Open</Button>
            </div>
          </motion.div>
        ))}
      </section>
    </AppShell>
  );
}

function AdminUserCreateForm({ kind, onCreate }: { kind: string; onCreate: (user: any) => Promise<void> }) {
  const normalizedRole = kind.toLowerCase().replace(" ", "_");
  const prefix: Record<string, string> = { student: "MCA2026", faculty: "FAC2026", hod: "HOD-CSE-", principal: "PRI", placement_officer: "PLC" };
  const [form, setForm] = useState({
    campusId: `${prefix[normalizedRole] ?? "USR"}001`,
    name: `New ${kind}`,
    role: normalizedRole,
    department: normalizedRole === "hod" ? "CSE" : "MCA",
    semester: normalizedRole === "student" ? "1" : "",
    section: normalizedRole === "student" ? "A" : "",
    temporaryPassword: "Campus@123"
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onCreate({
          ...form,
          campusId: form.campusId.trim().toUpperCase(),
          email: `${form.campusId.trim().toLowerCase()}@campus.test`,
          isActive: true
        });
      }}
    >
      <input value={form.campusId} onChange={(event) => update("campusId", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Campus ID" />
      <input value={form.name} onChange={(event) => update("name", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Name" />
      <select value={form.role} onChange={(event) => update("role", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold">
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
        <option value="hod">HOD</option>
        <option value="principal">Principal</option>
        <option value="placement_officer">Placement Officer</option>
      </select>
      <div className="grid gap-3 md:grid-cols-3">
        <input value={form.department} onChange={(event) => update("department", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Department" />
        <input value={form.semester} onChange={(event) => update("semester", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Semester" />
        <input value={form.section} onChange={(event) => update("section", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Section" />
      </div>
      <input value={form.temporaryPassword} onChange={(event) => update("temporaryPassword", event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Temporary Password" />
      <Button type="submit">Create User</Button>
    </form>
  );
}

function AdminPortalPage() {
  const [users, setUsers] = useState<Array<any>>([
    { campusId: "MCA2026001", name: "Rahul Sharma", role: "student", department: "MCA", semester: "2", isActive: true },
    { campusId: "FAC2026001", name: "Prof. Arjun Rao", role: "faculty", department: "MCA", semester: "-", isActive: true },
    { campusId: "HOD-CSE-001", name: "Dr. Kavita Menon", role: "hod", department: "CSE", semester: "-", isActive: true }
  ]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [department, setDepartment] = useState("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const [lastCredentials, setLastCredentials] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.users) setUsers(data.users);
      })
      .catch(() => undefined);
  }, []);

  const filtered = users.filter((user) => {
    const text = `${user.campusId} ${user.name}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (role === "all" || user.role === role) && (department === "all" || user.department === department);
  });

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function adminRequest(path: string, options: RequestInit = {}) {
    const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "Request failed");
    return payload;
  }

  function exportCsv() {
    const csv = ["Campus ID,Name,Role,Department,Semester,Temporary Password", ...users.map((user) => `${user.campusId},${user.name},${user.role},${user.department},${user.semester},${user.temporaryPassword ?? ""}`)].join("\n");
    downloadMockFile("campus-login-credentials.csv", csv);
    notify("Credentials CSV exported");
  }

  function createUserForm(kind: string) {
    setModal({
      title: `Create ${kind}`,
      body: (
        <AdminUserCreateForm
          kind={kind}
          onCreate={async (next) => {
            const payload = await adminRequest("/api/admin/users", { method: "POST", body: JSON.stringify(next) });
            const createdUser = { ...payload.user, temporaryPassword: payload.temporaryPassword };
            setUsers((current) => [...current.filter((row) => row.campusId !== createdUser.campusId), createdUser]);
            setLastCredentials(`${createdUser.campusId} / ${payload.temporaryPassword}`);
            setModal(null);
            notify(`${kind} created`);
          }}
        />
      )
    });
  }

  async function bulkCreate() {
    const payload = await adminRequest("/api/admin/users/bulk-create-students", { method: "POST", body: JSON.stringify({ department: "MCA", year: "2026", startRoll: 2, count: 5, section: "A", semester: "1" }) }).catch((error) => {
      notify(error.message);
      return null;
    });
    if (!payload?.users) return;
    const created = payload.users.map((user: any) => ({ ...user, temporaryPassword: payload.temporaryPassword }));
    setUsers((current) => [...current.filter((user) => !created.some((next: any) => next.campusId === user.campusId)), ...created]);
    setLastCredentials(`${created.length} student IDs / ${payload.temporaryPassword}`);
    notify("Bulk student IDs generated in database");
  }

  return (
    <AppShell>
      <Toast message={toast} />
      <Modal modal={modal} onClose={() => setModal(null)} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Admin Console</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Create login IDs, manage roles, reset passwords, and export credentials.</p>
      </section>
      <div className="mb-5 flex flex-wrap gap-3">
        {["Student", "Faculty", "HOD", "Principal", "Placement Officer"].map((kind) => <Button key={kind} onClick={() => createUserForm(kind)}>Create {kind}</Button>)}
        <Button variant="outline" onClick={bulkCreate}>Generate Bulk Student IDs</Button>
        <Button variant="outline" onClick={exportCsv}>Export Credentials CSV</Button>
        {lastCredentials ? <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(lastCredentials); notify("Credentials copied"); }}>Copy Last Credentials</Button> : null}
      </div>
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Search users" />
        <select value={role} onChange={(event) => setRole(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="all">All roles</option><option value="student">Student</option><option value="faculty">Faculty</option><option value="hod">HOD</option><option value="principal">Principal</option><option value="admin">Admin</option><option value="placement_officer">Placement Officer</option></select>
        <select value={department} onChange={(event) => setDepartment(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold"><option value="all">All departments</option><option value="MCA">MCA</option><option value="CSE">CSE</option></select>
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
        <div className="space-y-3">
          {filtered.map((user) => (
            <div key={user.campusId} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_120px_120px_auto] md:items-center">
              <div><p className="font-black text-slate-950">{user.name}</p><p className="text-xs font-bold text-slate-500">{user.campusId} • {user.department}</p></div>
              <Badge>{user.role}</Badge>
              <Badge className={user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}>{user.isActive ? "Active" : "Inactive"}</Badge>
              <div className="flex gap-2">
                <Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={async () => { try { await adminRequest(`/api/admin/users/${user.campusId}`, { method: "PATCH", body: JSON.stringify({ isActive: !user.isActive }) }); setUsers((current) => current.map((row) => row.campusId === user.campusId ? { ...row, isActive: !row.isActive } : row)); notify("User status updated"); } catch (error) { notify(error instanceof Error ? error.message : "Unable to update user"); } }}>{user.isActive ? "Deactivate" : "Activate"}</Button>
                <Button variant="outline" className="min-h-9 px-3 py-1.5" onClick={async () => { try { const payload = await adminRequest("/api/admin/users/reset-password", { method: "POST", body: JSON.stringify({ campusId: user.campusId, temporaryPassword: "Campus@123" }) }); setUsers((current) => current.map((row) => row.campusId === user.campusId ? { ...row, temporaryPassword: payload.temporaryPassword } : row)); setLastCredentials(`${user.campusId} / ${payload.temporaryPassword}`); notify(`Password reset for ${user.campusId}`); } catch (error) { notify(error instanceof Error ? error.message : "Unable to reset password"); } }}>Reset</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState<Array<{ id: string; action: string; actorCampusId: string; target?: string; details?: string; createdAt?: string }>>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setLogs(data?.auditLogs ?? []))
      .catch(() => setToast("Unable to load audit logs"));
  }, []);

  return (
    <AppShell>
      <Toast message={toast} />
      <section className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-[0_24px_60px_-36px_rgba(79,70,229,0.95)]">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Audit Logs</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/85 sm:text-base">Enterprise activity trail for users, attendance, notes, placements, leave and assignments.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)]">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_160px_160px] md:items-center">
              <div>
                <p className="font-black text-slate-950">{log.action}</p>
                <p className="text-xs font-bold text-slate-500">{log.details || log.target || "CampusOS activity"}</p>
              </div>
              <Badge>{log.actorCampusId}</Badge>
              <p className="text-xs font-bold text-slate-500">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Demo log"}</p>
            </div>
          ))}
          {logs.length === 0 ? <p className="text-sm font-bold text-slate-500">No audit logs found.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}

export function ChangePasswordPage() {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) {
        setToast(data.message || "Unable to change password");
        return;
      }
      setToast("Password changed");
      router.push(data.redirectTo || "/dashboard");
    } catch {
      setToast("Unable to change password");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#eef2ff_100%)] p-5">
      <Toast message={toast} />
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-44px_rgba(79,70,229,0.75)]">
        <h1 className="text-3xl font-black text-slate-950">Change Password</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Your Campus ID is locked. Set a new password to continue.</p>
        <input value={form.newPassword} onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))} className="mt-6 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="New password" type="password" />
        <input value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Confirm password" type="password" />
        <Button type="submit" className="mt-5 w-full">Update Password</Button>
      </form>
    </main>
  );
}

export function OnboardingEmailPage() {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<CampusSessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load profile")))
      .then((data) => {
        setUser(data.user ?? null);
        setEmail(data.user?.email ?? "");
      })
      .catch((error) => setToast(error.message));
  }, []);

  async function sendOtp(successMessage = "Demo OTP generated") {
    try {
      const response = await fetch("/api/onboarding/email/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) {
        setToast(data.message || "Unable to send OTP");
        return;
      }
      setDemoOtp(data.demoOtp);
      setOtp(data.demoOtp);
      setToast(successMessage);
    } catch {
      setToast("Unable to send OTP");
    }
  }

  async function verifyOtp() {
    try {
      const response = await fetch("/api/onboarding/email/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ otp }) });
      const data = await response.json();
      if (!response.ok) {
        setToast(data.message || "Unable to verify email");
        return;
      }
      const onboardingPassword = window.sessionStorage.getItem("campusOnboardingPassword");
      if (user?.campusId && onboardingPassword) {
        const result = await signIn("credentials", { campusId: user.campusId, password: onboardingPassword, redirect: false });
        if (result?.error) {
          setToast("Email verified. Please login again to continue.");
          window.sessionStorage.removeItem("campusOnboardingPassword");
          window.setTimeout(() => { void signOut({ callbackUrl: "/login" }); }, 900);
          return;
        }
      } else {
        setToast("Email verified. Please login again to continue.");
        window.setTimeout(() => { void signOut({ callbackUrl: "/login" }); }, 900);
        return;
      }
      setToast("Email verified");
      router.push(data.user?.mustChangePassword ? "/onboarding/change-password" : getRoleHome(data.user?.role));
    } catch {
      setToast("Unable to verify email");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#eef2ff_100%)] p-5">
      <Toast message={toast} />
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-44px_rgba(79,70,229,0.75)]">
        <div className="mb-6 flex items-center gap-3 text-xl font-black text-slate-950">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white"><GraduationCap size={22} /></span>
          CampusOS
        </div>
        <h1 className="text-3xl font-black text-slate-950">Verify Email</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Complete email verification before opening your campus portal.</p>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
          <p>Name: {user?.name ?? "Loading..."}</p>
          <p>Campus ID: {user?.campusId ?? "Loading..."}</p>
        </div>
        <div className="mt-5 grid gap-3">
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Email address" type="email" />
          <Button onClick={() => { void sendOtp("Email saved. Demo OTP generated"); }}>Save Email</Button>
          <Button variant="outline" onClick={() => { void sendOtp(); }}>Send Verification OTP</Button>
          {demoOtp ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-black text-emerald-700">Demo OTP: {demoOtp}</div> : null}
          <input value={otp} onChange={(event) => setOtp(event.target.value)} className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Enter OTP" />
          <Button variant="outline" onClick={() => { void verifyOtp(); }}>Verify Email</Button>
        </div>
      </div>
    </main>
  );
}

export function OnboardingChangePasswordPage() {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [campusId, setCampusId] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setCampusId(data?.user?.campusId ?? ""))
      .catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/onboarding/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) {
        setToast(data.message || "Unable to change password");
        return;
      }
      if (campusId) {
        const result = await signIn("credentials", { campusId, password: form.newPassword, redirect: false });
        if (result?.error) {
          setToast("Password changed. Please login again to continue.");
          window.sessionStorage.removeItem("campusOnboardingPassword");
          window.setTimeout(() => { void signOut({ callbackUrl: "/login" }); }, 900);
          return;
        }
      }
      window.sessionStorage.removeItem("campusOnboardingPassword");
      setToast("Password changed");
      router.push(data.redirectTo || getRoleHome(data.user?.role));
    } catch {
      setToast("Unable to change password");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#eef2ff_100%)] p-5">
      <Toast message={toast} />
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-44px_rgba(79,70,229,0.75)]">
        <h1 className="text-3xl font-black text-slate-950">Set Password</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Create a strong password to finish onboarding.</p>
        <input value={form.newPassword} onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))} className="mt-6 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="New password" type="password" />
        <input value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Confirm password" type="password" />
        <Button type="submit" className="mt-5 w-full">Finish Onboarding</Button>
      </form>
    </main>
  );
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [campusId, setCampusId] = useState("MCA2026001");
  const [password, setPassword] = useState("Campus@123");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCampusId = campusId.trim().toUpperCase();
    if (!normalizedCampusId) {
      setToast("Enter your Campus ID.");
      return;
    }
    if (!password) {
      setToast("Enter your password.");
      return;
    }

    try {
      const result = await signIn("credentials", { campusId: normalizedCampusId, password, redirect: false });
      if (result?.error) {
        const error = decodeURIComponent(result.error);
        setToast(error.includes("MongoDB not connected") ? "MongoDB not connected" : "Invalid Campus ID or password. Seed demo users, then use Campus@123.");
        return;
      }
      if (!result?.ok) {
        setToast("Unable to sign in. Please try again.");
        return;
      }
      const response = await fetch("/api/me");
      if (!response.ok) {
        setToast("Signed in, but profile could not be loaded. Please refresh.");
        return;
      }
      const data = await response.json();
      const signedInUser = data.user as CampusSessionUser | undefined;
      if (!signedInUser?.role) {
        setToast("Signed in, but role could not be loaded. Please refresh.");
        return;
      }
      const needsEmailOnboarding = !signedInUser.email || !signedInUser.isEmailVerified;
      const needsPasswordOnboarding = Boolean(signedInUser.mustChangePassword);
      if (needsEmailOnboarding || needsPasswordOnboarding) {
        window.sessionStorage.setItem("campusOnboardingPassword", password);
      } else {
        window.sessionStorage.removeItem("campusOnboardingPassword");
      }
      if (needsEmailOnboarding) {
        router.push("/onboarding/email");
        return;
      }
      if (needsPasswordOnboarding) {
        router.push("/onboarding/change-password");
        return;
      }
      router.push(getRoleHome(signedInUser.role));
    } catch {
      setToast("Unable to sign in. Please try again.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_50%,#eef2ff_100%)] p-5">
      <Toast message={toast} />
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-44px_rgba(79,70,229,0.75)]">
        <Link href="/" className="mb-8 flex items-center gap-3 text-xl font-black text-slate-950">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white"><GraduationCap size={22} /></span>
          CampusOS
        </Link>
        <h1 className="text-3xl font-black text-slate-950">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          {mode === "login" ? "Login to your premium campus SaaS dashboard." : "Join the CampusOS workspace for MCA students."}
        </p>
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-700">
          Demo logins: MCA2026001 student, ADM001 admin, FAC2026001 faculty. Password: Campus@123
        </div>
        {mode === "register" ? (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-700">
            Students cannot self-register. Admin creates Campus IDs and temporary passwords.
          </div>
        ) : null}
        <form
          onSubmit={submit}
          className="mt-7 space-y-4"
        >
          <input name="campusId" value={campusId} onChange={(event) => setCampusId(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Campus ID" autoComplete="username" />
          <input name="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Campus@123" type="password" autoComplete="current-password" />
          <Button type="submit" className="w-full">{mode === "login" ? "Login" : "Go to Login"}</Button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold text-slate-500">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <Link className="font-black text-indigo-700" href={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </main>
  );
}
