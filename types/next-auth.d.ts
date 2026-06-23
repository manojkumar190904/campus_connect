import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";
import type { CampusRole } from "@/lib/users";

declare module "next-auth" {
  interface Session {
    user: {
      campusId: string;
      role: CampusRole;
      department?: string;
      mustChangePassword?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    campusId?: string;
    role?: CampusRole;
    department?: string;
    mustChangePassword?: boolean;
  }
}
