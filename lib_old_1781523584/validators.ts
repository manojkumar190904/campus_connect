import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["STUDENT", "FACULTY", "ADMIN"]).default("STUDENT"),
  department: z.string().min(2).max(80).default("Computer Applications"),
  usn: z.string().max(40).optional()
});

export const noteSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5).optional().default(""),
  department: z.string().min(2),
  subject: z.string().min(2),
  semester: z.coerce.number().min(1).max(10),
  fileUrl: z.string().url(),
  tags: z.array(z.string()).optional().default([])
});

export const placementSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  packageLpa: z.coerce.number().min(0),
  location: z.string().min(2),
  description: z.string().min(10),
  eligibility: z.string().min(3),
  deadline: z.coerce.date(),
  driveDate: z.coerce.date(),
  type: z.enum(["INTERNSHIP", "FULL_TIME", "BOTH"]).default("FULL_TIME"),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]).default("OPEN")
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["ACADEMIC", "CULTURAL", "SPORTS", "CLUB", "PLACEMENT", "WORKSHOP"]).default("CLUB"),
  department: z.string().min(2).default("All"),
  venue: z.string().min(2),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  capacity: z.coerce.number().min(1).default(100),
  posterUrl: z.string().url().optional().or(z.literal(""))
});

export const attendanceSchema = z.object({
  department: z.string().min(2),
  subject: z.string().min(2),
  semester: z.coerce.number().min(1).max(10),
  date: z.coerce.date(),
  records: z.array(z.object({ student: z.string(), status: z.enum(["PRESENT", "ABSENT", "OD"]) })).default([])
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  category: z.enum(["GENERAL", "EXAM", "PLACEMENT", "EVENT", "URGENT"]).default("GENERAL"),
  audience: z.enum(["ALL", "STUDENT", "FACULTY", "ADMIN"]).default("ALL"),
  department: z.string().default("All"),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]).default("NORMAL"),
  expiresAt: z.coerce.date().optional()
});

export const clubSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["Coding", "Sports", "Music", "Photography", "Entrepreneurship"]),
  description: z.string().min(10),
  coverUrl: z.string().url().optional().or(z.literal(""))
});

export const discussionSchema = z.object({
  title: z.string().min(5),
  body: z.string().min(10),
  category: z.enum(["QUESTION", "SUBJECT", "CAREER", "PROJECT", "GENERAL"]).default("QUESTION"),
  tags: z.array(z.string()).default([])
});

export const marketplaceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["Books", "Calculators", "Lab Equipment", "Electronics", "Other"]).default("Books"),
  price: z.coerce.number().min(0),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "USED"]).default("GOOD"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  contact: z.string().min(5)
});

export const lostFoundSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["LOST", "FOUND"]),
  category: z.string().min(2).default("General"),
  location: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")),
  contact: z.string().min(5)
});

export const alumniSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  graduationYear: z.coerce.number().min(1980).max(2100),
  department: z.string().min(2),
  currentRole: z.string().min(2),
  company: z.string().min(2),
  location: z.string().min(2).default("India"),
  linkedIn: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  mentorshipOpen: z.coerce.boolean().default(true)
});

export const notificationSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(5),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "PLACEMENT", "EVENT"]).default("INFO"),
  role: z.enum(["STUDENT", "FACULTY", "ADMIN", "ALL"]).default("ALL"),
  link: z.string().optional()
});


export const userManagementSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(["STUDENT", "FACULTY", "ADMIN"]).default("STUDENT"),
  department: z.string().min(2).default("Computer Applications"),
  usn: z.string().max(40).optional(),
  phone: z.string().max(20).optional(),
  isActive: z.coerce.boolean().default(true)
});

export const departmentSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10),
  description: z.string().min(5).optional().default(""),
  totalStudents: z.coerce.number().min(0).default(0),
  totalFaculty: z.coerce.number().min(0).default(0)
});
