import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Department } from "@/models/Department";
import { Note } from "@/models/Note";
import { Event } from "@/models/Event";
import { Placement } from "@/models/Placement";
import { Announcement } from "@/models/Announcement";
import { Club } from "@/models/Club";
import { Discussion } from "@/models/Discussion";
import { MarketplaceItem } from "@/models/MarketplaceItem";
import { LostFound } from "@/models/LostFound";
import { Alumni } from "@/models/Alumni";
import { Notification } from "@/models/Notification";

export async function seedCampusData() {
  const password = await bcrypt.hash("Campus@123", 12);
  const [student, faculty, admin] = await Promise.all([
    User.findOneAndUpdate({ email: "student@campus.test" }, { name: "Aarav Student", email: "student@campus.test", password, role: "STUDENT", department: "Computer Applications", usn: "MCA001", skills: ["React", "Java", "MongoDB"], points: 860, badges: ["Attendance Hero", "Club Star"] }, { upsert: true, new: true }),
    User.findOneAndUpdate({ email: "faculty@campus.test" }, { name: "Dr. Priya Faculty", email: "faculty@campus.test", password, role: "FACULTY", department: "Computer Applications", skills: ["AI", "DBMS", "Mentoring"], points: 1200 }, { upsert: true, new: true }),
    User.findOneAndUpdate({ email: "admin@campus.test" }, { name: "Campus Admin", email: "admin@campus.test", password, role: "ADMIN", department: "Administration", points: 2000 }, { upsert: true, new: true })
  ]);

  await Department.findOneAndUpdate({ code: "MCA" }, { name: "Computer Applications", code: "MCA", description: "MCA and BCA programmes with industry-aligned curriculum.", head: faculty._id, totalStudents: 360, totalFaculty: 28 }, { upsert: true });

  await Note.findOneAndUpdate({ title: "Advanced DBMS Unit 1 Notes" }, { title: "Advanced DBMS Unit 1 Notes", description: "ER modelling, normalization, transactions and indexing.", department: "Computer Applications", subject: "DBMS", semester: 2, fileUrl: "https://res.cloudinary.com/demo/image/upload/sample.pdf", uploadedBy: faculty._id, tags: ["dbms", "mca", "unit1"] }, { upsert: true });

  await Event.findOneAndUpdate({ title: "Campus Hack Sprint" }, { title: "Campus Hack Sprint", description: "24-hour innovation hackathon for real campus problems.", category: "WORKSHOP", department: "All", venue: "Innovation Lab", startsAt: new Date(Date.now() + 86400000 * 7), endsAt: new Date(Date.now() + 86400000 * 8), capacity: 120, status: "APPROVED", createdBy: faculty._id }, { upsert: true });

  await Placement.findOneAndUpdate({ company: "TechNova", role: "Full Stack Developer Intern" }, { company: "TechNova", role: "Full Stack Developer Intern", packageLpa: 6, location: "Bengaluru", description: "Build SaaS dashboards with React, Node.js and MongoDB.", eligibility: "MCA/BCA, 70%+, strong projects", deadline: new Date(Date.now() + 86400000 * 12), driveDate: new Date(Date.now() + 86400000 * 18), type: "INTERNSHIP", status: "OPEN", createdBy: admin._id }, { upsert: true });

  await Announcement.findOneAndUpdate({ title: "Internal Assessment Schedule Released" }, { title: "Internal Assessment Schedule Released", body: "IA-2 timetable is published. Students must check department notice board and carry ID cards.", category: "EXAM", audience: "STUDENT", department: "All", priority: "HIGH", publishedBy: admin._id }, { upsert: true });

  await Club.findOneAndUpdate({ name: "CodeForge Club" }, { name: "CodeForge Club", category: "Coding", description: "Competitive programming, open-source and product building club.", facultyCoordinator: faculty._id, studentLead: student._id, members: [student._id] }, { upsert: true });
  await Club.findOneAndUpdate({ name: "LensLife Photography" }, { name: "LensLife Photography", category: "Photography", description: "Campus storytelling through photography and short films.", members: [student._id] }, { upsert: true });

  await Discussion.findOneAndUpdate({ title: "How to prepare DBMS for placements?" }, { title: "How to prepare DBMS for placements?", body: "Share the best topics, SQL practice plans and interview resources.", category: "CAREER", tags: ["dbms", "placement"], author: student._id, votes: 24 }, { upsert: true });

  await MarketplaceItem.findOneAndUpdate({ title: "Engineering Mathematics Book" }, { title: "Engineering Mathematics Book", description: "Clean copy, useful for MCA bridge course and quantitative prep.", category: "Books", price: 250, condition: "GOOD", seller: student._id, contact: "student@campus.test" }, { upsert: true });

  await LostFound.findOneAndUpdate({ title: "Found Scientific Calculator" }, { title: "Found Scientific Calculator", description: "Casio calculator found near seminar hall after workshop.", type: "FOUND", category: "Calculator", location: "Seminar Hall", reportedBy: faculty._id, contact: "faculty@campus.test" }, { upsert: true });

  await Alumni.findOneAndUpdate({ email: "neha.alumni@example.com" }, { name: "Neha Rao", email: "neha.alumni@example.com", graduationYear: 2022, department: "Computer Applications", currentRole: "Software Engineer", company: "Stripe", location: "Bengaluru", linkedIn: "https://linkedin.com", skills: ["System Design", "React", "Career Guidance"], mentorshipOpen: true }, { upsert: true });

  await Notification.findOneAndUpdate({ title: "Welcome to Campus Connect" }, { title: "Welcome to Campus Connect", body: "Explore notes, placements, clubs, events and campus discussions from one mobile-first dashboard.", type: "SUCCESS", role: "ALL", link: "/dashboard" }, { upsert: true });

  return { student: student.email, faculty: faculty.email, admin: admin.email };
}
