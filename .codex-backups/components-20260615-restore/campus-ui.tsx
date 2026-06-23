"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  FileText,
  GraduationCap,
  Home,
  Library,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  Upload,
  Users,
  MapPin,
  Clock,
  Megaphone,
  BadgeCheck,
  LostItem,
  UserPlus,
  QrCode,
  ClipboardCheck,
  Building2,
  LucideIcon
} from "lucide-react";

type Tone =
  | "indigo"
  | "green"
  | "purple"
  | "orange"
  | "blue"
  | "red"
  | "cyan"
  | "slate";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Notices", href: "/announcements", icon: Megaphone },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Attendance", href: "/attendance", icon: CheckCircle2 },
  { label: "Placements", href: "/placements", icon: Briefcase },
  { label: "Clubs", href: "/clubs", icon: Users },
  { label: "Lost & Found", href: "/lost-found", icon: LostItem },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Alumni", href: "/alumni", icon: GraduationCap },
  { label: "Discussions", href: "/discussions", icon: MessageCircle },
  { label: "Resume", href: "/resume", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin", icon: ShieldCheck }
];

const mobileItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Notices", href: "/announcements", icon: Bell },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Profile", href: "/settings", icon: CircleUserRound }
];

const attendanceData = [
  { day: "1 May", value: 14 },
  { day: "6 May", value: 44 },
  { day: "11 May", value: 68 },
  { day: "16 May", value: 61 },
  { day: "21 May", value: 78 },
  { day: "26 May", value: 72 },
  { day: "31 May", value: 76 }
];

const notices = [
  {
    title: "Mid Semester Exams",
    text: "Exams will begin from 15th May.",
    meta: "Admin • 2 hours ago",
    tone: "red" as Tone,
    icon: Megaphone
  },
  {
    title: "Library Maintenance",
    text: "Library will remain closed on 18th May.",
    meta: "Admin • 5 hours ago",
    tone: "orange" as Tone,
    icon: BookOpen
  },
  {
    title: "Hackathon Registration",
    text: "CodeSprint 3.0 registration is open now.",
    meta: "Coding Club • 1 day ago",
    tone: "green" as Tone,
    icon: Trophy
  },
  {
    title: "Holiday Notice",
    text: "College will remain closed on 20th May.",
    meta: "Admin • 2 days ago",
    tone: "blue" as Tone,
    icon: Calendar
  }
];

const events = [
  {
    date: "17",
    month: "MAY",
    title: "Web Development Workshop",
    time: "10:00 AM - 1:00 PM",
    place: "Seminar Hall",
    tone: "red" as Tone
  },
  {
    date: "20",
    month: "MAY",
    title: "CodeSprint 3.0",
    time: "09:00 AM - 02:00 PM",
    place: "Block A",
    tone: "purple" as Tone
  },
  {
    date: "25",
    month: "MAY",
    title: "Annual Sports Meet",
    time: "08:00 AM - 05:00 PM",
    place: "Sports Ground",
    tone: "green" as Tone
  }
];

const notes = [
  {
    title: "Data Structures and Algorithms",
    author: "Priya Sharma",
    downloads: "2.4k Downloads"
  },
  {
    title: "Database Management System",
    author: "Amit Verma",
    downloads: "1.8k Downloads"
  },
  {
    title: "Operating Systems Notes",
    author: "Neha Singh",
    downloads: "1.2k Downloads"
  }
];

const placements = [
  {
    company: "Microsoft",
    role: "Software Engineer",
    package: "₹ 24 LPA",
    logo: "M"
  },
  {
    company: "Amazon",
    role: "SDE Intern",
    package: "₹ 12 LPA",
    logo: "a"
  },
  {
    company: "Google",
    role: "Associate Engineer",
    package: "₹ 20 LPA",
    logo: "G"
  },
  {
    company: "Deloitte",
    role: "Data Analyst",
    package: "₹ 8 LPA",
    logo: "D"
  }
];

const moduleData = {
  notes: {
    title: "Notes Library",
    subtitle: "Access premium subject notes, PDFs and study material.",
    icon: FileText,
    action: "Download",
    items: notes.map((item) => ({
      title: item.title,
      meta: `By ${item.author}`,
      info: item.downloads,
      badge: "PDF",
      tone: "red" as Tone
    }))
  },
  placements: {
    title: "Placement Hub",
    subtitle: "Apply for drives and track campus opportunities.",
    icon: Briefcase,
    action: "Apply Now",
    items: placements.map((item) => ({
      title: item.company,
      meta: item.role,
      info: item.package,
      badge: "Open",
      tone: "blue" as Tone
    }))
  },
  events: {
    title: "Campus Events",
    subtitle: "Register for workshops, fests and club activities.",
    icon: Calendar,
    action: "Register",
    items: events.map((item) => ({
      title: item.title,
      meta: item.time,
      info: item.place,
      badge: `${item.date} ${item.month}`,
      tone: item.tone
    }))
  },
  attendance: {
    title: "Attendance Analytics",
    subtitle: "Track monthly attendance and subject-wise reports.",
    icon: CheckCircle2,
    action: "View Report",
    items: [
      {
        title: "Data Structures",
        meta: "42 / 48 classes attended",
        info: "88%",
        badge: "Safe",
        tone: "green" as Tone
      },
      {
        title: "DBMS",
        meta: "36 / 44 classes attended",
        info: "82%",
        badge: "Safe",
        tone: "blue" as Tone
      },
      {
        title: "Operating System",
        meta: "30 / 42 classes attended",
        info: "71%",
        badge: "Alert",
        tone: "orange" as Tone
      }
    ]
  },
  announcements: {
    title: "Notice Board",
    subtitle: "Official notices, circulars and department updates.",
    icon: Megaphone,
    action: "Read",
    items: notices.map((item) => ({
      title: item.title,
      meta: item.text,
      info: item.meta,
      badge: "Notice",
      tone: item.tone
    }))
  },
  clubs: {
    title: "Club Management",
    subtitle: "Join clubs, attend events and build your student profile.",
    icon: Users,
    action: "Join Club",
    items: [
      {
        title: "Coding Club",
        meta: "Hackathons, coding contests and projects",
        info: "248 Members",
        badge: "Active",
        tone: "indigo" as Tone
      },
      {
        title: "Sports Club",
        meta: "Football, cricket, athletics and tournaments",
        info: "312 Members",
        badge: "Active",
        tone: "green" as Tone
      },
      {
        title: "Photography Club",
        meta: "Campus events, reels and creative shoots",
        info: "129 Members",
        badge: "Creative",
        tone: "orange" as Tone
      },
      {
        title: "Entrepreneurship Cell",
        meta: "Startup ideas, pitching and business events",
        info: "97 Members",
        badge: "Premium",
        tone: "purple" as Tone
      }
    ]
  },
  lostFound: {
    title: "Lost & Found",
    subtitle: "Report lost items and help students find belongings.",
    icon: LostItem,
    action: "Claim",
    items: [
      {
        title: "Black Calculator",
        meta: "Found near CSE Lab",
        info: "Today",
        badge: "Found",
        tone: "green" as Tone
      },
      {
        title: "Blue Notebook",
        meta: "Lost near library",
        info: "Yesterday",
        badge: "Lost",
        tone: "red" as Tone
      },
      {
        title: "ID Card",
        meta: "Rahul Sharma - MCA",
        info: "2 days ago",
        badge: "Found",
        tone: "blue" as Tone
      }
    ]
  },
  marketplace: {
    title: "Campus Marketplace",
    subtitle: "Buy and sell books, calculators and lab equipment.",
    icon: ShoppingBag,
    action: "Contact",
    items: [
      {
        title: "DBMS Textbook",
        meta: "Seller: Ankit",
        info: "₹350",
        badge: "Book",
        tone: "blue" as Tone
      },
      {
        title: "Scientific Calculator",
        meta: "Seller: Priya",
        info: "₹600",
        badge: "Tool",
        tone: "green" as Tone
      },
      {
        title: "Lab Coat",
        meta: "Seller: Neha",
        info: "₹250",
        badge: "Lab",
        tone: "orange" as Tone
      }
    ]
  },
  alumni: {
    title: "Alumni Network",
    subtitle: "Connect with alumni for mentorship and career guidance.",
    icon: GraduationCap,
    action: "Request Mentor",
    items: [
      {
        title: "Arjun Rao",
        meta: "Software Engineer at Microsoft",
        info: "Batch 2021",
        badge: "Mentor",
        tone: "blue" as Tone
      },
      {
        title: "Sneha Iyer",
        meta: "Product Analyst at Google",
        info: "Batch 2020",
        badge: "Mentor",
        tone: "green" as Tone
      },
      {
        title: "Kiran Kumar",
        meta: "Founder at EduTech Labs",
        info: "Batch 2019",
        badge: "Founder",
        tone: "purple" as Tone
      }
    ]
  },
  discussions: {
    title: "Discussion Forum",
    subtitle: "Ask questions, discuss subjects and share knowledge.",
    icon: MessageCircle,
    action: "Answer",
    items: [
      {
        title: "How to prepare DBMS for semester exams?",
        meta: "Asked by Rahul",
        info: "14 Answers",
        badge: "DBMS",
        tone: "blue" as Tone
      },
      {
        title: "Best MCA mini project ideas?",
        meta: "Asked by Priya",
        info: "22 Answers",
        badge: "Projects",
        tone: "purple" as Tone
      },
      {
        title: "Placement aptitude resources",
        meta: "Asked by Amit",
        info: "9 Answers",
        badge: "Placement",
        tone: "green" as Tone
      }
    ]
  },
  resume: {
    title: "Resume Builder",
    subtitle: "Create ATS-friendly resumes for campus placements.",
    icon: BookOpen,
    action: "Edit",
    items: [
      {
        title: "Rahul Sharma Resume",
        meta: "MCA student • Full Stack Developer",
        info: "ATS Score 86%",
        badge: "Draft",
        tone: "indigo" as Tone
      },
      {
        title: "Skills Section",
        meta: "Java, React, MongoDB, Next.js",
        info: "Updated",
        badge: "Strong",
        tone: "green" as Tone
      },
      {
        title: "Projects Section",
        meta: "Campus Connect SaaS Platform",
        info: "Premium",
        badge: "Winner",
        tone: "orange" as Tone
      }
    ]
  },
  settings: {
    title: "Settings",
    subtitle: "Manage profile, notifications and account preferences.",
    icon: Settings,
    action: "Update",
    items: [
      {
        title: "Profile Information",
        meta: "Rahul Sharma • MCA - 2nd Year",
        info: "Complete",
        badge: "Profile",
        tone: "blue" as Tone
      },
      {
        title: "Notifications",
        meta: "Events, notices and placement alerts",
        info: "Enabled",
        badge: "Active",
        tone: "green" as Tone
      },
      {
        title: "Privacy",
        meta: "Control visibility and account security",
        info: "Secure",
        badge: "Safe",
        tone: "purple" as Tone
      }
    ]
  },
  admin: {
    title: "Admin Control Center",
    subtitle: "Manage users, departments, events and placement drives.",
    icon: ShieldCheck,
    action: "Manage",
    items: [
      {
        title: "Total Students",
        meta: "Active registered students",
        info: "2,840",
        badge: "Users",
        tone: "blue" as Tone
      },
      {
        title: "Faculty Members",
        meta: "Across all departments",
        info: "168",
        badge: "Faculty",
        tone: "green" as Tone
      },
      {
        title: "Placement Drives",
        meta: "Companies visiting this month",
        info: "18",
        badge: "Drives",
        tone: "orange" as Tone
      },
      {
        title: "System Health",
        meta: "All modules operational",
        info: "99.9%",
        badge: "Live",
        tone: "purple" as Tone
      }
    ]
  },
  faculty: {
    title: "Faculty Workspace",
    subtitle: "Upload notes, manage attendance and post announcements.",
    icon: Building2,
    action: "Open",
    items: [
      {
        title: "Upload Notes",
        meta: "Share PDF notes with students",
        info: "12 Uploaded",
        badge: "Notes",
        tone: "red" as Tone
      },
      {
        title: "Mark Attendance",
        meta: "Today’s MCA classes",
        info: "3 Classes",
        badge: "Pending",
        tone: "orange" as Tone
      },
      {
        title: "Student Analytics",
        meta: "Performance and attendance insights",
        info: "View",
        badge: "Analytics",
        tone: "blue" as Tone
      }
    ]
  }
};

const toneStyles: Record<Tone, string> = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  purple: "bg-violet-50 text-violet-600 ring-violet-100",
  orange: "bg-amber-50 text-amber-600 ring-amber-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  red: "bg-rose-50 text-rose-600 ring-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
  slate: "bg-slate-50 text-slate-600 ring-slate-100"
};

function IconBox({
  icon: Icon,
  tone = "indigo"
}: {
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${toneStyles[tone]}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-slate-200/80 bg-white/95 p-5 lg:flex lg:flex-col">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
          <GraduationCap className="h-6 w-6" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-950">
          Campus<span className="text-indigo-600">OS</span>
        </span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-sm">
        <div className="mb-3 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-100 text-indigo-600">
          <UserPlus className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-slate-950">Connect. Learn. Grow.</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Everything you need in one campus platform.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-100"
        >
          Explore More
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-200 to-blue-200 text-sm font-bold text-slate-900">
          RS
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            Rahul Sharma
          </p>
          <p className="truncate text-xs text-slate-500">MCA - 2nd Year</p>
        </div>
        <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[74px] items-center gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl lg:px-7">
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-extrabold text-slate-950">
          Campus<span className="text-indigo-600">OS</span>
        </span>
      </Link>

      <div className="hidden h-11 w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 lg:flex">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search for notes, events, people..."
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <button className="hidden h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm sm:grid">
          <MessageCircle className="h-5 w-5" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-200 to-blue-200 text-sm font-bold text-slate-900">
          RS
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {mobileItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold ${
                active ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef2ff,transparent_30%),linear-gradient(135deg,#f8fafc_0%,#f5f3ff_45%,#ffffff_100%)] p-0 lg:p-5">
      <section className="mx-auto flex min-h-screen max-w-[1420px] overflow-hidden border border-slate-200 bg-white/90 shadow-soft backdrop-blur-xl lg:min-h-[calc(100vh-40px)] lg:rounded-[28px]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 lg:px-7 lg:pb-7">
            {children}
          </div>
        </div>
        <MobileBottomNav />
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone: Tone;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card"
    >
      <div className="flex items-start gap-4">
        <IconBox icon={icon} tone={tone} />
        <div>
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 h-10 rounded-2xl bg-gradient-to-r from-transparent via-slate-50 to-transparent">
        <svg viewBox="0 0 220 44" className="h-full w-full">
          <path
            d="M2 32 C30 10, 48 40, 73 20 S116 31, 140 15 178 35, 218 17"
            fill="none"
            stroke={
              tone === "green"
                ? "#10b981"
                : tone === "orange"
                ? "#f59e0b"
                : tone === "blue"
                ? "#2563eb"
                : "#4f46e5"
            }
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

function SectionCard({
  title,
  action,
  children
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
        {action ? (
          <button className="text-sm font-bold text-indigo-600">{action}</button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Donut() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(#4f46e5_78%,#ede9fe_0)]">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
          <span className="text-4xl font-extrabold text-slate-950">78%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-950">Overall Attendance</p>
      <p className="mt-2 max-w-40 text-center text-sm leading-6 text-slate-500">
        You need <span className="font-bold text-emerald-600">75%</span> to be
        eligible for exams.
      </p>
    </div>
  );
}

export function DashboardPage() {
  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Good Morning, Rahul! 👋
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Here’s what’s happening in your campus today.
            </p>
          </div>
          <div className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            Thursday, 16 May 2024
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Attendance"
            value="78%"
            subtitle="This Month  ↑ 5%"
            icon={BadgeCheck}
            tone="green"
          />
          <StatCard
            title="Upcoming Events"
            value="06"
            subtitle="This Week"
            icon={Calendar}
            tone="purple"
          />
          <StatCard
            title="Notices"
            value="12"
            subtitle="New Notices"
            icon={Megaphone}
            tone="orange"
          />
          <StatCard
            title="Placements"
            value="08"
            subtitle="New Opportunities"
            icon={Briefcase}
            tone="blue"
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Attendance Overview" action="This Month">
            <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="attendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fill="url(#attendance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <Donut />
            </div>
          </SectionCard>

          <SectionCard title="Latest Notices" action="View All">
            <div className="space-y-4">
              {notices.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <IconBox icon={item.icon} tone={item.tone} />
                  <div>
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.text}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <SectionCard title="Upcoming Events" action="View All">
            <div className="space-y-4">
              {events.map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div className={`rounded-2xl px-4 py-3 text-center ring-1 ${toneStyles[item.tone]}`}>
                    <p className="text-xl font-extrabold">{item.date}</p>
                    <p className="text-xs font-bold">{item.month}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {item.place}
                    </p>
                  </div>
                  <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 text-xs font-bold text-white">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Notes Library" action="View All">
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {["All", "CSE", "Mathematics", "DBMS", "OS"].map((tag) => (
                <button
                  key={tag}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${
                    tag === "All"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {notes.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      By {item.author} • PDF • {item.downloads}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Placement Opportunities" action="View All">
            <div className="space-y-4">
              {placements.map((item) => (
                <div key={item.company} className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-lg font-black text-slate-950">
                    {item.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-950">{item.company}</h3>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">
                    {item.package}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Quick Actions" >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {[
              ["Upload Notes", Upload],
              ["Create Event", Calendar],
              ["Mark Attendance", ClipboardCheck],
              ["Post Notice", Megaphone],
              ["Lost & Found", LostItem],
              ["Join Club", Users],
              ["Resume Builder", BookOpen],
              ["QR Scanner", QrCode]
            ].map(([label, Icon]) => {
              const ActionIcon = Icon as LucideIcon;
              return (
                <button
                  key={label as string}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600"
                >
                  <ActionIcon className="h-4 w-4" />
                  {label as string}
                </button>
              );
            })}
          </div>
        </SectionCard>
      </motion.div>
    </AppShell>
  );
}

export function ModulePage({
  module
}: {
  module: keyof typeof moduleData;
}) {
  const data = moduleData[module];
  const Icon = data.icon;

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <IconBox icon={Icon} tone="indigo" />
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                  {data.title}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {data.subtitle}
                </p>
              </div>
            </div>

            <button className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-100">
              + Create New
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder={`Search ${data.title.toLowerCase()}...`}
              />
            </div>
            <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
              Filter
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <IconBox icon={Icon} tone={item.tone} />
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${toneStyles[item.tone]}`}>
                  {item.badge}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.meta}</p>
              <p className="mt-4 text-lg font-black text-slate-900">{item.info}</p>

              <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-100">
                {data.action}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#eef2ff,transparent_35%),linear-gradient(135deg,#f8fafc,#f5f3ff,#ffffff)] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-950">
            Campus<span className="text-indigo-600">OS</span>
          </span>
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-950">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isLogin
            ? "Login to access your smart campus dashboard."
            : "Join your digital campus ecosystem."}
        </p>

        <div className="mt-6 space-y-4">
          {!isLogin && (
            <input
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400"
              placeholder="Full name"
            />
          )}
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400"
            placeholder="Email address"
            defaultValue={isLogin ? "student@campus.test" : ""}
          />
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-400"
            placeholder="Password"
            type="password"
            defaultValue={isLogin ? "Campus@123" : ""}
          />
          <Link
            href="/dashboard"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-sm font-extrabold text-white shadow-lg shadow-indigo-100"
          >
            {isLogin ? "Login" : "Register"}
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "New to CampusOS?" : "Already have an account?"}{" "}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-extrabold text-indigo-600"
          >
            {isLogin ? "Create account" : "Login"}
          </Link>
        </p>
      </div>
    </main>
  );
}