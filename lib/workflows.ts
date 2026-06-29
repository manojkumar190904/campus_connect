import { resolveDatabaseMode, useMongoDatabase } from "@/lib/db";
import {
  Assignment,
  AssignmentSubmission,
  AttendanceRecord,
  AttendanceSession,
  AuditLog,
  Announcement,
  Club,
  Event,
  EventRegistration,
  FeeRecord,
  LeaveRequest,
  Note,
  NoteApprovalLog,
  Notification,
  PlacementApplication,
  PlacementDrive,
  Subject
} from "@/models/CampusModels";
import type { CampusRole } from "@/lib/users";

type AnyRecord = Record<string, any>;

const demoSubjects = [
  { id: "SUB-DSA", code: "MCA201", name: "Data Structures", department: "MCA", semester: "2", facultyCampusId: "FAC2026001" },
  { id: "SUB-DBMS", code: "MCA202", name: "DBMS", department: "MCA", semester: "2", facultyCampusId: "FAC2026001" },
  { id: "SUB-OS", code: "MCA203", name: "Operating Systems", department: "MCA", semester: "2", facultyCampusId: "FAC2026001" }
];

const demoStoreSeed: Record<string, AnyRecord[]> = {
  subjects: demoSubjects,
  attendanceSessions: [
    { id: "ATT-1", department: "MCA", semester: "2", section: "A", subject: "Data Structures", subjectCode: "MCA201", date: "2026-06-15", facultyCampusId: "FAC2026001", qrToken: "QR-MCA201-2026", qrExpiresAt: new Date(Date.now() + 300000).toISOString(), status: "open" }
  ],
  attendanceRecords: [
    { id: "AR-1", sessionId: "ATT-1", studentCampusId: "MCA2026001", studentName: "Rahul Sharma", department: "MCA", semester: "2", section: "A", subject: "Data Structures", subjectCode: "MCA201", date: "2026-06-15", status: "present", markedBy: "FAC2026001" },
    { id: "AR-2", sessionId: "ATT-DB-1", studentCampusId: "MCA2026001", studentName: "Rahul Sharma", department: "MCA", semester: "2", section: "A", subject: "DBMS", subjectCode: "MCA202", date: "2026-06-14", status: "present", markedBy: "FAC2026001" },
    { id: "AR-3", sessionId: "ATT-OS-1", studentCampusId: "MCA2026001", studentName: "Rahul Sharma", department: "MCA", semester: "2", section: "A", subject: "Operating Systems", subjectCode: "MCA203", date: "2026-06-13", status: "absent", markedBy: "FAC2026001" }
  ],
  placementDrives: [
    { id: "DRV-MS", companyName: "Microsoft", role: "Software Engineer", package: "24 LPA", eligibility: "MCA/CSE, 75%+", lastDate: "2026-07-10", status: "Open", createdBy: "PLC001" },
    { id: "DRV-AMZ", companyName: "Amazon", role: "SDE Intern", package: "12 LPA", eligibility: "No active backlogs", lastDate: "2026-07-18", status: "Open", createdBy: "PLC001" }
  ],
  placementApplications: [
    { id: "APP-1", driveId: "DRV-MS", studentCampusId: "MCA2026001", studentName: "Rahul Sharma", resumeUrl: "resume.txt", status: "Under Review" }
  ],
  notes: [
    { id: "NOTE-1", title: "Data Structures and Algorithms", description: "Unit-wise notes", department: "MCA", semester: "2", section: "A", subject: "Data Structures", unit: "Unit 1", fileUrl: "/mock/dsa.pdf", fileName: "dsa.pdf", fileSize: 248000, uploadedBy: "FAC2026001", status: "Approved", approvalStatus: "approved" },
    { id: "NOTE-2", title: "Operating Systems Notes", description: "Process scheduling", department: "MCA", semester: "2", section: "A", subject: "Operating Systems", unit: "Unit 2", fileUrl: "/mock/os.pdf", fileName: "os.pdf", fileSize: 182000, uploadedBy: "FAC2026001", status: "Pending", approvalStatus: "pending_approval" }
  ],
  announcements: [
    { id: "ANN-1", title: "DBMS Lab Revision", message: "Bring your lab record for normalization revision.", category: "Academic", department: "MCA", semester: "2", section: "A", priority: "Normal", createdBy: "FAC2026001", status: "Published" }
  ],
  noteApprovalLogs: [],
  assignments: [
    { id: "ASG-1", title: "DBMS Normalization", subject: "DBMS", department: "MCA", semester: "2", section: "A", deadline: "2026-07-01", instructions: "Submit a normalized schema with notes.", createdBy: "FAC2026001" }
  ],
  assignmentSubmissions: [],
  leaveRequests: [
    { id: "LEV-1", requesterCampusId: "MCA2026001", requesterName: "Rahul Sharma", role: "student", department: "MCA", fromDate: "2026-06-20", toDate: "2026-06-21", reason: "Medical appointment", status: "Pending" }
  ],
  notifications: [
    { id: "NOT-1", recipientCampusId: "MCA2026001", role: "student", title: "Attendance Alert", message: "Operating Systems attendance is below target.", type: "attendance", read: false },
    { id: "NOT-2", recipientCampusId: "MCA2026001", role: "student", title: "DBMS Lab Revision", message: "Bring your lab record for normalization revision.", type: "announcement", read: false }
  ],
  auditLogs: [
    { id: "AUD-1", actorCampusId: "ADM001", action: "Login", target: "ADM001", details: "Admin signed in with Campus ID", role: "admin" },
    { id: "AUD-2", actorCampusId: "ADM001", action: "User created", target: "MCA2026001", details: "Demo student account created", role: "admin" },
    { id: "AUD-3", actorCampusId: "ADM001", action: "Password reset", target: "MCA2026001", details: "Temporary password issued", role: "admin" },
    { id: "AUD-4", actorCampusId: "FAC2026001", action: "Attendance marked", target: "ATT-1", details: "Data Structures attendance saved", role: "faculty" },
    { id: "AUD-5", actorCampusId: "HOD-CSE-001", action: "Note approved", target: "NOTE-1", details: "Data Structures and Algorithms", role: "hod" },
    { id: "AUD-6", actorCampusId: "PLC001", action: "Placement status changed", target: "APP-1", details: "Under Review", role: "placement_officer" }
  ],
  fees: [
    { id: "FEE-1", studentCampusId: "MCA2026001", studentName: "Rahul Sharma", amount: 60000, paidAmount: 42000, dueDate: "2026-07-15", status: "Pending" }
  ],
  events: [
    { id: "EVT-1", title: "Web Development Workshop", description: "Hands-on Next.js session", date: "2026-06-28", venue: "Lab 3", createdBy: "FAC2026001", department: "MCA", status: "Approved" },
    { id: "EVT-2", title: "CodeSprint 3.0", description: "Coding competition", date: "2026-07-05", venue: "Auditorium", createdBy: "MCA2026001", department: "MCA", status: "Pending" }
  ],
  eventRegistrations: [],
  clubs: [
    { id: "CLUB-1", name: "CodeCrafters Club", category: "Coding", members: 148, status: "Active" }
  ]
};

declare global {
  // eslint-disable-next-line no-var
  var campusWorkflowStore: Record<string, AnyRecord[]> | undefined;
}

function store() {
  if (!global.campusWorkflowStore) global.campusWorkflowStore = JSON.parse(JSON.stringify(demoStoreSeed));
  return global.campusWorkflowStore;
}

const modelMap: Record<string, any> = {
  subjects: Subject,
  attendanceSessions: AttendanceSession,
  attendanceRecords: AttendanceRecord,
  placementDrives: PlacementDrive,
  placementApplications: PlacementApplication,
  notes: Note,
  announcements: Announcement,
  noteApprovalLogs: NoteApprovalLog,
  assignments: Assignment,
  assignmentSubmissions: AssignmentSubmission,
  leaveRequests: LeaveRequest,
  notifications: Notification,
  auditLogs: AuditLog,
  fees: FeeRecord,
  events: Event,
  eventRegistrations: EventRegistration,
  clubs: Club
};

function publicDoc(doc: any) {
  const raw = typeof doc?.toObject === "function" ? doc.toObject() : doc;
  if (!raw) return raw;
  const { __v, ...rest } = raw;
  return { ...rest, id: String(raw._id ?? raw.id) };
}

function matches(item: AnyRecord, query: AnyRecord) {
  return Object.entries(query).every(([key, value]) => value === undefined || value === "all" || String(item[key]) === String(value));
}

export async function listRecords(collection: string, query: AnyRecord = {}) {
  if (await useMongoDatabase()) {
    const docs = await modelMap[collection].find(query).sort({ createdAt: -1 }).lean();
    return docs.map(publicDoc);
  }
  return store()[collection].filter((item) => matches(item, query));
}

export async function createRecord(collection: string, input: AnyRecord) {
  if (await useMongoDatabase()) {
    const doc = await modelMap[collection].create(input);
    return publicDoc(doc);
  }
  const record = { id: `${collection}-${Date.now()}`, ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store()[collection].unshift(record);
  return record;
}

export async function updateRecord(collection: string, id: string, patch: AnyRecord) {
  if (await useMongoDatabase()) {
    const doc = await modelMap[collection].findByIdAndUpdate(id, patch, { new: true });
    if (!doc) throw new Error("Record not found");
    return publicDoc(doc);
  }
  const rows = store()[collection];
  const index = rows.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Record not found");
  rows[index] = { ...rows[index], ...patch, updatedAt: new Date().toISOString() };
  return rows[index];
}

export async function notify(input: { recipientCampusId?: string; role?: CampusRole | string; title: string; message: string; type: string }) {
  return createRecord("notifications", { ...input, read: false });
}

export async function audit(input: { actorCampusId: string; action: string; target?: string; details?: string; role?: string }) {
  return createRecord("auditLogs", input);
}

export async function createAttendanceSession(input: AnyRecord, actorCampusId: string) {
  const qrToken = `QR-${input.subjectCode || "CLASS"}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const session = await createRecord("attendanceSessions", { ...input, facultyCampusId: actorCampusId, qrToken, qrExpiresAt: new Date(Date.now() + 5 * 60 * 1000), status: "open" });
  await audit({ actorCampusId, action: "Attendance session created", target: session.id, details: input.subject });
  return session;
}

export async function markAttendance(input: AnyRecord, actorCampusId: string) {
  const session = await createAttendanceSession(input, actorCampusId);
  const records = await Promise.all((input.records ?? []).map((record: AnyRecord) => createRecord("attendanceRecords", {
    sessionId: session.id,
    studentCampusId: record.studentCampusId,
    studentName: record.studentName,
    department: input.department,
    semester: input.semester,
    section: input.section,
    subject: input.subject,
    subjectCode: input.subjectCode,
    date: input.date,
    status: record.status,
    remarks: record.remarks,
    markedBy: actorCampusId
  })));
  await Promise.all(records
    .filter((record: AnyRecord) => record.status === "absent")
    .map((record: AnyRecord) => notify({
      recipientCampusId: record.studentCampusId,
      title: "Attendance Alert",
      message: `You were marked absent for ${input.subject} on ${input.date}.`,
      type: "attendance"
    })));
  await audit({ actorCampusId, action: "Attendance marked", target: session.id, details: `${records.length} records` });
  return { session, records };
}

export async function scanAttendance(qrToken: string, user: { campusId: string; name?: string; department?: string }) {
  const sessions = await listRecords("attendanceSessions", { qrToken });
  const session = sessions[0];
  if (!session) throw new Error("Invalid QR code");
  if (new Date(session.qrExpiresAt).getTime() < Date.now()) throw new Error("QR session expired");
  const existing = (await listRecords("attendanceRecords", { sessionId: session.id })).find((row) => row.studentCampusId === user.campusId);
  if (existing) throw new Error("Attendance already marked");
  const record = await createRecord("attendanceRecords", {
    sessionId: session.id,
    studentCampusId: user.campusId,
    studentName: user.name ?? user.campusId,
    department: session.department,
    semester: session.semester,
    section: session.section,
    subject: session.subject,
    subjectCode: session.subjectCode,
    date: session.date,
    status: "present",
    markedBy: "QR"
  });
  await notify({ recipientCampusId: user.campusId, title: "Attendance marked", message: `${session.subject} attendance saved.`, type: "attendance" });
  return record;
}

export async function applyPlacement(driveId: string, user: { campusId: string; name?: string }, resumeUrl?: string) {
  const existing = (await listRecords("placementApplications", { driveId })).find((row) => row.studentCampusId === user.campusId);
  if (existing) return existing;
  const application = await createRecord("placementApplications", { driveId, studentCampusId: user.campusId, studentName: user.name ?? user.campusId, resumeUrl, status: "Applied" });
  await notify({ role: "placement_officer", title: "New placement application", message: `${application.studentName} applied for a drive.`, type: "placement" });
  return application;
}

export async function approveNote(noteId: string, status: "Approved" | "Rejected", actorCampusId: string, comment?: string) {
  const note = await updateRecord("notes", noteId, { status, reviewedBy: actorCampusId, reviewComment: comment });
  await createRecord("noteApprovalLogs", { noteId, action: status, actorCampusId, comment });
  await audit({ actorCampusId, action: `Note ${status.toLowerCase()}`, target: noteId, details: note.title });
  await notify({ recipientCampusId: note.uploadedBy, title: `Note ${status}`, message: `${note.title} was ${status.toLowerCase()}.`, type: "notes" });
  return note;
}

export async function seedWorkflowData() {
  const mode = await resolveDatabaseMode();
  if (mode === "mongodb") {
    await Promise.all(Object.values(modelMap).map((model) => model.deleteMany({})));
    for (const [collection, rows] of Object.entries(demoStoreSeed)) {
      await modelMap[collection].insertMany(rows.map(({ id, ...row }) => row));
    }
  } else {
    global.campusWorkflowStore = JSON.parse(JSON.stringify(demoStoreSeed));
  }
  return { seeded: true, mode };
}
