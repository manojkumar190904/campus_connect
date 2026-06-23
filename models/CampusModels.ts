import { Schema, models, model } from "mongoose";

const base = { timestamps: true };

const SubjectSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  department: { type: String, required: true, index: true },
  semester: { type: String, required: true },
  facultyCampusId: { type: String, index: true }
}, base);

const AttendanceSessionSchema = new Schema({
  department: { type: String, required: true, index: true },
  semester: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  subjectCode: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  facultyCampusId: { type: String, required: true, index: true },
  qrToken: { type: String, index: true },
  qrExpiresAt: { type: Date },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, base);

const AttendanceRecordSchema = new Schema({
  sessionId: { type: String, required: true, index: true },
  studentCampusId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  department: { type: String, required: true, index: true },
  semester: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  subjectCode: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  status: { type: String, enum: ["present", "absent"], required: true },
  markedBy: { type: String, required: true }
}, base);
AttendanceRecordSchema.index({ sessionId: 1, studentCampusId: 1 }, { unique: true });

const PlacementDriveSchema = new Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String, required: true },
  eligibility: { type: String, required: true },
  lastDate: { type: String, required: true },
  status: { type: String, enum: ["Draft", "Open", "Closed"], default: "Open", index: true },
  createdBy: { type: String, required: true }
}, base);

const PlacementApplicationSchema = new Schema({
  driveId: { type: String, required: true, index: true },
  studentCampusId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  resumeUrl: { type: String },
  status: { type: String, enum: ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"], default: "Applied" }
}, base);
PlacementApplicationSchema.index({ driveId: 1, studentCampusId: 1 }, { unique: true });

const NoteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true, index: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String },
  uploadedBy: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
  reviewedBy: { type: String },
  reviewComment: { type: String }
}, base);

const NoteApprovalLogSchema = new Schema({
  noteId: { type: String, required: true, index: true },
  action: { type: String, enum: ["Pending", "Approved", "Rejected"], required: true },
  actorCampusId: { type: String, required: true },
  comment: { type: String }
}, base);

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true, index: true },
  semester: { type: String, required: true },
  section: { type: String, default: "A" },
  deadline: { type: String, required: true },
  instructions: { type: String, required: true },
  attachmentUrl: { type: String },
  createdBy: { type: String, required: true }
}, base);

const AssignmentSubmissionSchema = new Schema({
  assignmentId: { type: String, required: true, index: true },
  studentCampusId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String },
  link: { type: String },
  status: { type: String, enum: ["Submitted", "Graded"], default: "Submitted" },
  grade: { type: String },
  feedback: { type: String }
}, base);
AssignmentSubmissionSchema.index({ assignmentId: 1, studentCampusId: 1 }, { unique: true });

const LeaveRequestSchema = new Schema({
  requesterCampusId: { type: String, required: true, index: true },
  requesterName: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, index: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  attachmentUrl: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
  reviewedBy: { type: String },
  reviewComment: { type: String }
}, base);

const NotificationSchema = new Schema({
  recipientCampusId: { type: String, index: true },
  role: { type: String, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false, index: true }
}, base);

const AuditLogSchema = new Schema({
  actorCampusId: { type: String, required: true },
  action: { type: String, required: true, index: true },
  target: { type: String },
  details: { type: String },
  role: { type: String }
}, base);

const FeeRecordSchema = new Schema({
  studentCampusId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" }
}, base);

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  createdBy: { type: String, required: true },
  department: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
  reviewedBy: { type: String }
}, base);

const EventRegistrationSchema = new Schema({
  eventId: { type: String, required: true, index: true },
  studentCampusId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  qrPass: { type: String, required: true }
}, base);
EventRegistrationSchema.index({ eventId: 1, studentCampusId: 1 }, { unique: true });

const ClubSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  members: { type: Number, default: 0 },
  status: { type: String, default: "Active" }
}, base);

export const Subject = models.Subject || model("Subject", SubjectSchema);
export const AttendanceSession = models.AttendanceSession || model("AttendanceSession", AttendanceSessionSchema);
export const AttendanceRecord = models.AttendanceRecord || model("AttendanceRecord", AttendanceRecordSchema);
export const PlacementDrive = models.PlacementDrive || model("PlacementDrive", PlacementDriveSchema);
export const PlacementApplication = models.PlacementApplication || model("PlacementApplication", PlacementApplicationSchema);
export const Note = models.Note || model("Note", NoteSchema);
export const NoteApprovalLog = models.NoteApprovalLog || model("NoteApprovalLog", NoteApprovalLogSchema);
export const Assignment = models.Assignment || model("Assignment", AssignmentSchema);
export const AssignmentSubmission = models.AssignmentSubmission || model("AssignmentSubmission", AssignmentSubmissionSchema);
export const LeaveRequest = models.LeaveRequest || model("LeaveRequest", LeaveRequestSchema);
export const Notification = models.Notification || model("Notification", NotificationSchema);
export const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);
export const FeeRecord = models.FeeRecord || model("FeeRecord", FeeRecordSchema);
export const Event = models.Event || model("Event", EventSchema);
export const EventRegistration = models.EventRegistration || model("EventRegistration", EventRegistrationSchema);
export const Club = models.Club || model("Club", ClubSchema);
