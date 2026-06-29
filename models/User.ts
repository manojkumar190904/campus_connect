import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "student" | "faculty" | "hod" | "principal" | "admin" | "super_admin" | "placement_officer";

const UserSchema = new Schema(
  {
    campusId: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "", index: true },
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerifiedAt: { type: Date },
    emailOtpHash: { type: String },
    emailOtpExpiresAt: { type: Date },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "faculty", "hod", "principal", "admin", "super_admin", "placement_officer"], required: true, index: true },
    department: { type: String, index: true },
    semester: { type: String },
    section: { type: String },
    designation: { type: String },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    createdBy: { type: String },
    passwordChangedAt: { type: Date },
    avatar: { type: String }
  },
  { timestamps: true }
);

UserSchema.index({ campusId: 1 }, { unique: true });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

export const User = models.User || model("User", UserSchema);
export type UserDocument = mongoose.InferSchemaType<typeof UserSchema>;
