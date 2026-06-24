import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRoleHome } from "@/lib/role-access";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.role) redirect("/login");
  if (!session.user.email || !session.user.isEmailVerified) redirect("/onboarding/email");
  if (session.user.mustChangePassword) redirect("/onboarding/change-password");
  redirect(getRoleHome(session.user.role));
}
