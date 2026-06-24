import bcrypt from "bcryptjs";
import { resolveDatabaseMode, useMongoDatabase, type DatabaseMode } from "@/lib/db";
import { rolePortal } from "@/lib/permissions";
import { User } from "@/models/User";

export type CampusRole = "student" | "faculty" | "hod" | "principal" | "admin" | "super_admin" | "placement_officer";

export type CampusUser = {
  id: string;
  campusId: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
  emailOtp?: string;
  emailOtpExpiresAt?: string;
  phone?: string;
  passwordHash: string;
  role: CampusRole;
  department?: string;
  semester?: string;
  section?: string;
  designation?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  createdBy?: string;
  passwordChangedAt?: string;
  avatar?: string;
  temporaryPassword?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicCampusUser = Omit<CampusUser, "passwordHash" | "temporaryPassword" | "emailOtp">;

const defaultPassword = "Campus@123";
const now = () => new Date().toISOString();

function makeUser(input: Omit<CampusUser, "id" | "passwordHash" | "createdAt" | "updatedAt" | "isActive" | "temporaryPassword"> & { password?: string; isActive?: boolean; temporaryPassword?: string }): CampusUser {
  const password = input.password ?? input.temporaryPassword ?? defaultPassword;
  const timestamp = now();
  return {
    ...input,
    id: input.campusId,
    passwordHash: bcrypt.hashSync(password, 10),
    temporaryPassword: input.temporaryPassword ?? password,
    isActive: input.isActive ?? true,
    isEmailVerified: input.isEmailVerified ?? false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

const seedUsers: CampusUser[] = [
  makeUser({ campusId: "SUPER001", name: "Super Admin", email: "super@campus.test", role: "super_admin", department: "Administration", designation: "Super Admin", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "ADM001", name: "Admin Office", email: "admin@campus.test", role: "admin", department: "Administration", designation: "Admin", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "PRI001", name: "Dr. Principal", email: "principal@campus.test", role: "principal", department: "Campus", designation: "Principal", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "HOD-CSE-001", name: "Dr. Kavita Menon", email: "hod@campus.test", role: "hod", department: "CSE", designation: "HOD", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "FAC2026001", name: "Prof. Arjun Rao", email: "faculty@campus.test", role: "faculty", department: "MCA", designation: "Assistant Professor", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "PLC001", name: "Placement Officer", email: "placement@campus.test", role: "placement_officer", department: "Placement Cell", designation: "Placement Officer", isEmailVerified: true, emailVerifiedAt: now(), mustChangePassword: false }),
  makeUser({ campusId: "MCA2026001", name: "Rahul Sharma", email: "", role: "student", department: "MCA", semester: "2", section: "A", isEmailVerified: false, mustChangePassword: true })
];

declare global {
  // eslint-disable-next-line no-var
  var campusMockUsers: CampusUser[] | undefined;
}

function users() {
  if (!global.campusMockUsers) global.campusMockUsers = seedUsers.map((user) => ({ ...user }));
  return global.campusMockUsers;
}

function docToUser(doc: any): CampusUser {
  const object = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...object,
    id: object.campusId,
    createdAt: object.createdAt?.toISOString?.() ?? object.createdAt ?? now(),
    updatedAt: object.updatedAt?.toISOString?.() ?? object.updatedAt ?? now(),
    lastLoginAt: object.lastLoginAt?.toISOString?.() ?? object.lastLoginAt,
    passwordChangedAt: object.passwordChangedAt?.toISOString?.() ?? object.passwordChangedAt,
    emailVerifiedAt: object.emailVerifiedAt?.toISOString?.() ?? object.emailVerifiedAt,
    emailOtpExpiresAt: object.emailOtpExpiresAt?.toISOString?.() ?? object.emailOtpExpiresAt,
    isEmailVerified: Boolean(object.isEmailVerified)
  };
}

export function sanitizeUser(user: CampusUser): PublicCampusUser {
  const { passwordHash, temporaryPassword, emailOtp, ...safe } = user;
  return safe;
}

export async function getUsers() {
  if (await useMongoDatabase()) {
    const docs = await (User as any).find({}).sort({ createdAt: -1 }).lean();
    return docs.map((doc: any) => sanitizeUser(docToUser(doc)));
  }
  return users().map(sanitizeUser);
}

export async function findUserByCampusId(campusId: string) {
  const normalizedCampusId = campusId.trim().toUpperCase();
  if (await useMongoDatabase()) {
    const doc = await (User as any).findOne({ campusId: normalizedCampusId }).select("+passwordHash");
    return doc ? docToUser(doc) : undefined;
  }
  return users().find((user) => user.campusId.toUpperCase() === normalizedCampusId);
}

export async function verifyCampusLogin(campusId: string, password: string) {
  const user = await findUserByCampusId(campusId);
  if (!user || !user.isActive || !user.passwordHash) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  if (await useMongoDatabase()) {
    await (User as any).updateOne({ campusId: user.campusId }, { lastLoginAt: new Date() });
  } else {
    user.lastLoginAt = now();
  }
  return user;
}

export { rolePortal };

export async function createUser(input: Partial<CampusUser> & { campusId: string; name: string; email?: string; role: CampusRole; temporaryPassword?: string }) {
  if (await findUserByCampusId(input.campusId)) {
    throw new Error("Campus ID already exists");
  }
  const temporaryPassword = input.temporaryPassword ?? defaultPassword;
  if (await useMongoDatabase()) {
    const doc = await (User as any).create({
      campusId: input.campusId,
      name: input.name,
      email: input.email ?? "",
      isEmailVerified: input.isEmailVerified ?? false,
      emailVerifiedAt: input.emailVerifiedAt ? new Date(input.emailVerifiedAt) : undefined,
      phone: input.phone,
      passwordHash: bcrypt.hashSync(temporaryPassword, 10),
      role: input.role,
      department: input.department,
      semester: input.semester,
      section: input.section,
      designation: input.designation,
      mustChangePassword: input.mustChangePassword ?? true,
      createdBy: input.createdBy ?? "ADM001",
      isActive: input.isActive ?? true
    });
    return { ...sanitizeUser(docToUser(doc)), temporaryPassword };
  }
  const user = makeUser({
    campusId: input.campusId,
    name: input.name,
    email: input.email ?? "",
    isEmailVerified: input.isEmailVerified ?? false,
    emailVerifiedAt: input.emailVerifiedAt,
    phone: input.phone,
    role: input.role,
    department: input.department,
    semester: input.semester,
    section: input.section,
    designation: input.designation,
    mustChangePassword: input.mustChangePassword ?? true,
    createdBy: input.createdBy ?? "ADM001",
    temporaryPassword
  });
  users().push(user);
  return sanitizeUser(user);
}

export async function updateUser(campusId: string, patch: Partial<CampusUser>) {
  if (await useMongoDatabase()) {
    const { passwordHash, temporaryPassword, campusId: _campusId, ...safePatch } = patch;
    const doc = await (User as any).findOneAndUpdate({ campusId }, safePatch, { new: true });
    if (!doc) throw new Error("User not found");
    return sanitizeUser(docToUser(doc));
  }
  const user = users().find((row) => row.campusId.toUpperCase() === campusId.toUpperCase());
  if (!user) throw new Error("User not found");
  Object.assign(user, patch, { campusId: user.campusId, updatedAt: now() });
  return sanitizeUser(user);
}

export async function resetPassword(campusId: string, temporaryPassword = defaultPassword) {
  if (await useMongoDatabase()) {
    const doc = await (User as any).findOneAndUpdate(
      { campusId },
      { passwordHash: bcrypt.hashSync(temporaryPassword, 10), mustChangePassword: true },
      { new: true }
    );
    if (!doc) throw new Error("User not found");
    return sanitizeUser(docToUser(doc));
  }
  const user = users().find((row) => row.campusId.toUpperCase() === campusId.toUpperCase());
  if (!user) throw new Error("User not found");
  user.passwordHash = bcrypt.hashSync(temporaryPassword, 10);
  user.temporaryPassword = temporaryPassword;
  user.mustChangePassword = true;
  user.updatedAt = now();
  return sanitizeUser(user);
}

export async function changePassword(campusId: string, newPassword: string) {
  if (await useMongoDatabase()) {
    const doc = await (User as any).findOneAndUpdate(
      { campusId },
      { passwordHash: bcrypt.hashSync(newPassword, 10), mustChangePassword: false, passwordChangedAt: new Date() },
      { new: true }
    );
    if (!doc) throw new Error("User not found");
    return sanitizeUser(docToUser(doc));
  }
  const user = users().find((row) => row.campusId.toUpperCase() === campusId.toUpperCase());
  if (!user) throw new Error("User not found");
  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.mustChangePassword = false;
  user.passwordChangedAt = now();
  user.updatedAt = now();
  return sanitizeUser(user);
}

export function getOnboardingPath(user?: Pick<CampusUser, "email" | "isEmailVerified" | "mustChangePassword"> | null) {
  if (!user) return "/login";
  if (!user.email || !user.isEmailVerified) return "/onboarding/email";
  if (user.mustChangePassword) return "/onboarding/change-password";
  return null;
}

export async function sendEmailOtp(campusId: string, email: string) {
  const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address");
  }
  if (await useMongoDatabase()) {
    const doc = await (User as any).findOneAndUpdate(
      { campusId: campusId.trim().toUpperCase() },
      { email: normalizedEmail, isEmailVerified: false, emailOtp: demoOtp, emailOtpExpiresAt: expiresAt },
      { new: true }
    );
    if (!doc) throw new Error("User not found");
    return { user: sanitizeUser(docToUser(doc)), demoOtp };
  }
  const user = users().find((row) => row.campusId.toUpperCase() === campusId.toUpperCase());
  if (!user) throw new Error("User not found");
  user.email = normalizedEmail;
  user.isEmailVerified = false;
  user.emailOtp = demoOtp;
  user.emailOtpExpiresAt = expiresAt.toISOString();
  user.updatedAt = now();
  return { user: sanitizeUser(user), demoOtp };
}

export async function verifyEmailOtp(campusId: string, otp: string) {
  const user = await findUserByCampusId(campusId);
  if (!user) throw new Error("User not found");
  if (!user.emailOtp || user.emailOtp !== otp.trim()) throw new Error("Invalid OTP");
  if (user.emailOtpExpiresAt && new Date(user.emailOtpExpiresAt).getTime() < Date.now()) throw new Error("OTP expired");
  if (await useMongoDatabase()) {
    const doc = await (User as any).findOneAndUpdate(
      { campusId: campusId.trim().toUpperCase() },
      { $set: { isEmailVerified: true, emailVerifiedAt: new Date() }, $unset: { emailOtp: "", emailOtpExpiresAt: "" } },
      { new: true }
    );
    if (!doc) throw new Error("User not found");
    return sanitizeUser(docToUser(doc));
  }
  user.isEmailVerified = true;
  user.emailVerifiedAt = now();
  user.emailOtp = undefined;
  user.emailOtpExpiresAt = undefined;
  user.updatedAt = now();
  return sanitizeUser(user);
}

export async function bulkCreateStudents(input: { department: string; year: string; startRoll: number; count: number; section?: string; semester?: string; temporaryPassword?: string }) {
  const created: PublicCampusUser[] = [];
  const temporaryPassword = input.temporaryPassword ?? defaultPassword;
  for (let index = 0; index < input.count; index += 1) {
    const roll = String(input.startRoll + index).padStart(3, "0");
    const campusId = `${input.department.toUpperCase()}${input.year}${roll}`;
    if (await findUserByCampusId(campusId)) continue;
    created.push(await createUser({
      campusId,
      name: `${input.department.toUpperCase()} Student ${roll}`,
      email: `${campusId.toLowerCase()}@campus.test`,
      role: "student",
      department: input.department.toUpperCase(),
      semester: input.semester ?? "1",
      section: input.section ?? "A",
      isEmailVerified: false,
      temporaryPassword,
      mustChangePassword: true
    }));
  }
  return created;
}

export async function seedDemoUsers() {
  const mode: DatabaseMode = await resolveDatabaseMode();
  const seededCampusIds = await Promise.all(seedUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash("Campus@123", 10);
    if (mode === "mongodb") {
      await (User as any).findOneAndUpdate(
        { campusId: user.campusId },
        {
          $set: {
            campusId: user.campusId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            passwordHash,
            role: user.role,
            department: user.department,
            semester: user.semester,
            section: user.section,
            designation: user.designation,
            isEmailVerified: user.isEmailVerified,
            emailVerifiedAt: user.emailVerifiedAt ? new Date(user.emailVerifiedAt) : undefined,
            isActive: true,
            mustChangePassword: user.mustChangePassword
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return user.campusId;
    }

    const mockUsers = users();
    const existingIndex = mockUsers.findIndex((row) => row.campusId.toUpperCase() === user.campusId);
    const seededUser = {
      ...user,
      passwordHash,
      isActive: true,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      mustChangePassword: user.mustChangePassword,
      updatedAt: now()
    };
    if (existingIndex >= 0) {
      mockUsers[existingIndex] = { ...mockUsers[existingIndex], ...seededUser, createdAt: mockUsers[existingIndex].createdAt };
    } else {
      mockUsers.push({ ...seededUser, createdAt: now() });
    }
    return user.campusId;
  }));

  return { mode, users: seededCampusIds };
}

export function validateStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}
