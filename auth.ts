import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAuthSecret } from "@/lib/auth-env";
import { resolveDatabaseMode } from "@/lib/db";
import { findUserByCampusId } from "@/lib/users";
import { audit } from "@/lib/workflows";
import { User } from "@/models/User";

function sessionUserFromCampusUser(user: any) {
  return {
    id: user.campusId,
    name: user.name,
    email: user.email,
    role: user.role,
    campusId: user.campusId,
    department: user.department,
    semester: user.semester,
    section: user.section,
    isEmailVerified: Boolean(user.isEmailVerified),
    mustChangePassword: Boolean(user.mustChangePassword)
  } as any;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  jwt: { maxAge: 7 * 24 * 60 * 60 },
  secret: getAuthSecret(),
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Campus ID",
      credentials: {
        campusId: { label: "Campus ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const submittedCampusId = credentials?.campusId?.trim() ?? "";
        const campusId = submittedCampusId.toUpperCase();
        const password = credentials?.password ?? "";
        if (!campusId || !password) return null;

        const mode = await resolveDatabaseMode();
        const user = mode === "mongodb"
          ? await (User as any)
            .findOne({ campusId: submittedCampusId.toUpperCase() })
            .select("+passwordHash")
            .lean()
          : await findUserByCampusId(campusId);

        if (!user?.isActive || !user.passwordHash) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return null;
        if (mode === "mongodb") {
          await (User as any).updateOne({ campusId }, { lastLoginAt: new Date() });
        } else {
          user.lastLoginAt = new Date().toISOString();
        }
        try {
          await audit({ actorCampusId: campusId, action: "Login", target: campusId, role: user.role });
        } catch {
          // Login must not fail if audit storage is unavailable.
        }
        return sessionUserFromCampusUser(user);
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.email = (user as any).email;
        token.role = (user as any).role;
        token.campusId = (user as any).campusId;
        token.department = (user as any).department;
        token.semester = (user as any).semester;
        token.section = (user as any).section;
        token.isEmailVerified = (user as any).isEmailVerified;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).email = token.email;
        (session.user as any).role = token.role;
        (session.user as any).campusId = token.campusId;
        (session.user as any).department = token.department;
        (session.user as any).semester = token.semester;
        (session.user as any).section = token.section;
        (session.user as any).isEmailVerified = token.isEmailVerified;
        (session.user as any).mustChangePassword = token.mustChangePassword;
      }
      return session;
    }
  }
};

export function auth() {
  return getServerSession(authOptions);
}

export const nextAuthHandler = NextAuth(authOptions);
