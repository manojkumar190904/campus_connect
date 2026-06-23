import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  FileUp,
  Megaphone,
  PackageSearch,
  QrCode,
  ScrollText,
  UsersRound
} from "lucide-react";

export const stats = [
  { title: "Attendance", value: "78%", label: "Overall semester", tone: "indigo" as const },
  { title: "Upcoming Events", value: "06", label: "This month", tone: "cyan" as const },
  { title: "Notices", value: "12", label: "New updates", tone: "amber" as const },
  { title: "Placements", value: "08", label: "Open drives", tone: "emerald" as const }
];

export const attendanceTrend = [
  { month: "Jan", value: 62 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 71 },
  { month: "Apr", value: 73 },
  { month: "May", value: 76 },
  { month: "Jun", value: 78 }
];

export const subjectAttendance = [
  { subject: "Data Structures", attended: 34, total: 42, percent: 81 },
  { subject: "DBMS", attended: 31, total: 40, percent: 78 },
  { subject: "Operating Systems", attended: 28, total: 38, percent: 74 },
  { subject: "Web Technologies", attended: 36, total: 44, percent: 82 }
];

export const notices = [
  { title: "Mid Semester Exams", category: "Exam", date: "13 Jun", body: "Internal exam timetable is published for MCA 2nd year.", priority: "High" },
  { title: "Library Maintenance", category: "Library", date: "15 Jun", body: "Digital library services will pause from 6 PM to 9 PM.", priority: "Normal" },
  { title: "Hackathon Registration", category: "Event", date: "Open", body: "Register for the 24-hour campus innovation challenge.", priority: "New" },
  { title: "Holiday Notice", category: "General", date: "18 Jun", body: "College remains closed for the announced public holiday.", priority: "Info" }
];

export const events = [
  { title: "Web Development Workshop", category: "Workshop", date: "14 Jun", time: "10:00 AM", venue: "Lab 3", seats: 80 },
  { title: "CodeSprint 3.0", category: "Coding", date: "18 Jun", time: "02:30 PM", venue: "Auditorium", seats: 120 },
  { title: "Annual Sports Meet", category: "Sports", date: "23 Jun", time: "08:00 AM", venue: "Main ground", seats: 300 }
];

export const notes = [
  { title: "Data Structures and Algorithms", subject: "DSA", department: "MCA", semester: "2nd", downloads: 1240, type: "PDF" },
  { title: "Database Management System", subject: "DBMS", department: "MCA", semester: "2nd", downloads: 980, type: "PDF" },
  { title: "Operating Systems Notes", subject: "OS", department: "MCA", semester: "2nd", downloads: 860, type: "PDF" },
  { title: "Web Technologies Lab Manual", subject: "Web", department: "MCA", semester: "2nd", downloads: 640, type: "PDF" }
];

export const placements = [
  { company: "Microsoft", role: "Software Engineer", package: "₹24 LPA", location: "Bengaluru", status: "Open", type: "Full Time" },
  { company: "Amazon", role: "SDE Intern", package: "₹12 LPA", location: "Hyderabad", status: "Open", type: "Internship" },
  { company: "Google", role: "Associate Engineer", package: "₹20 LPA", location: "Bengaluru", status: "Shortlisting", type: "Full Time" },
  { company: "Deloitte", role: "Data Analyst", package: "₹8 LPA", location: "Remote", status: "Open", type: "Full Time" }
];

export const quickActions = [
  { label: "Upload Notes", icon: FileUp, tone: "bg-indigo-50 text-primary" },
  { label: "Create Event", icon: CalendarDays, tone: "bg-cyan-50 text-cyan-600" },
  { label: "Mark Attendance", icon: ClipboardCheck, tone: "bg-emerald-50 text-emerald-600" },
  { label: "Post Notice", icon: Megaphone, tone: "bg-amber-50 text-amber-600" },
  { label: "Lost & Found", icon: PackageSearch, tone: "bg-rose-50 text-rose-600" },
  { label: "Join Club", icon: UsersRound, tone: "bg-violet-50 text-violet-600" },
  { label: "Resume Builder", icon: ScrollText, tone: "bg-blue-50 text-blue-600" },
  { label: "QR Scanner", icon: QrCode, tone: "bg-slate-100 text-slate-700" }
];

export const clubs = [
  { name: "CodeCrafters Club", category: "Coding", members: 148, description: "Weekly coding contests, project reviews and hackathon teams." },
  { name: "Design Studio", category: "UI/UX", members: 86, description: "Product design, posters, interface reviews and design systems." },
  { name: "Cyber Cell", category: "Security", members: 72, description: "CTF practice, awareness sessions and secure coding clinics." },
  { name: "Entrepreneurship Cell", category: "Startup", members: 103, description: "Pitch practice, idea validation and founder talks." }
];

export const lostFound = [
  { title: "Black Laptop Bag", type: "LOST", location: "Library", contact: "Rahul Sharma", category: "Bag" },
  { title: "Scientific Calculator", type: "FOUND", location: "Lab 2", contact: "MCA Office", category: "Electronics" },
  { title: "ID Card", type: "FOUND", location: "Canteen", contact: "Security Desk", category: "ID" },
  { title: "Blue Water Bottle", type: "LOST", location: "Auditorium", contact: "Nisha Rao", category: "Bottle" }
];

export const marketplace = [
  { title: "DBMS Textbook", price: "₹450", seller: "Aman Verma", condition: "Good", category: "Books" },
  { title: "Casio Calculator", price: "₹700", seller: "Priya Nair", condition: "Like New", category: "Electronics" },
  { title: "Lab Coat", price: "₹300", seller: "Rohit S", condition: "Used", category: "Lab" },
  { title: "Wireless Mouse", price: "₹550", seller: "Meera P", condition: "Good", category: "Accessories" }
];

export const alumni = [
  { name: "Ananya Rao", role: "Software Engineer", company: "Microsoft", batch: "2022", skills: ["React", "System Design"] },
  { name: "Vikram Iyer", role: "Data Engineer", company: "Amazon", batch: "2021", skills: ["Python", "AWS"] },
  { name: "Sneha Kulkarni", role: "Product Analyst", company: "Google", batch: "2020", skills: ["SQL", "Analytics"] },
  { name: "Arjun Menon", role: "Security Consultant", company: "Deloitte", batch: "2019", skills: ["Security", "Cloud"] }
];

export const discussions = [
  { title: "Best way to prepare DBMS joins?", tags: ["DBMS", "Exam"], answers: 12, author: "Rahul Sharma" },
  { title: "Need teammates for CodeSprint 3.0", tags: ["Hackathon", "Team"], answers: 8, author: "Nisha Rao" },
  { title: "Operating Systems viva questions", tags: ["OS", "Viva"], answers: 17, author: "Aman Verma" },
  { title: "Resume review for SDE internships", tags: ["Placement", "Resume"], answers: 6, author: "Meera P" }
];

export const users = [
  { name: "Rahul Sharma", role: "STUDENT", department: "MCA", status: "Active" },
  { name: "Dr. Kavita Menon", role: "FACULTY", department: "Computer Applications", status: "Active" },
  { name: "Aman Verma", role: "STUDENT", department: "MCA", status: "Active" },
  { name: "Admin Office", role: "ADMIN", department: "Administration", status: "Active" }
];

export const dashboardIcons = {
  Attendance: ClipboardCheck,
  "Upcoming Events": CalendarDays,
  Notices: Bell,
  Placements: BriefcaseBusiness,
  Notes: BookOpen
};
