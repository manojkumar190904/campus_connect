import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-env";
import { canAccessRoute, getRoleHome } from "@/lib/role-access";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: getAuthSecret() });
  const roleHome = getRoleHome(String(token?.role ?? ""));
  const onboardingPath = token
    ? !token.email || !token.isEmailVerified
      ? "/onboarding/email"
      : token.mustChangePassword
        ? "/onboarding/change-password"
        : null
    : null;
  const isLogin = pathname === "/login";
  const isRoot = pathname === "/";
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApiRoute = pathname.startsWith("/api/auth/") || pathname === "/api/seed";
  const isProfileApi = pathname === "/api/me";
  const isEmailOnboarding = pathname === "/onboarding/email" || pathname.startsWith("/api/onboarding/email/");
  const isPasswordOnboarding = pathname === "/onboarding/change-password" || pathname === "/api/onboarding/change-password";
  const protectedRoute =
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/portal/") ||
    ["/admin", "/faculty", "/dashboard", "/assistant", "/notes", "/attendance", "/assignments", "/announcements", "/events", "/placements", "/clubs", "/lost-found", "/marketplace", "/resume", "/settings", "/leave", "/fees", "/alumni", "/discussions", "/change-password"].some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isRoot) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL(onboardingPath ?? roleHome, request.url));
  }

  if (isLogin && token?.role) {
    return NextResponse.redirect(new URL(onboardingPath ?? roleHome, request.url));
  }

  if (isApiRoute) {
    if (isPublicApiRoute) return NextResponse.next();
    if (!token?.role) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    if (onboardingPath === "/onboarding/email" && !isEmailOnboarding && !isProfileApi) {
      return NextResponse.json({ message: "Complete email onboarding first" }, { status: 403 });
    }
    if (onboardingPath === "/onboarding/change-password" && !isPasswordOnboarding && !isProfileApi) {
      return NextResponse.json({ message: "Change password to complete onboarding" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (protectedRoute) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", request.url));

    if (onboardingPath === "/onboarding/email" && !isEmailOnboarding) {
      return NextResponse.redirect(new URL("/onboarding/email", request.url));
    }
    if (onboardingPath === "/onboarding/email" && isEmailOnboarding) {
      return NextResponse.next();
    }

    if (onboardingPath === "/onboarding/change-password" && !isPasswordOnboarding) {
      return NextResponse.redirect(new URL("/onboarding/change-password", request.url));
    }
    if (onboardingPath === "/onboarding/change-password" && isPasswordOnboarding) {
      return NextResponse.next();
    }

    if (!onboardingPath && pathname.startsWith("/onboarding/")) {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }

    if (!canAccessRoute(String(token.role), pathname)) {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/api/:path*", "/onboarding/:path*", "/portal/:path*", "/admin/:path*", "/faculty/:path*", "/dashboard/:path*", "/assistant/:path*", "/notes/:path*", "/attendance/:path*", "/assignments/:path*", "/announcements/:path*", "/events/:path*", "/placements/:path*", "/clubs/:path*", "/lost-found/:path*", "/marketplace/:path*", "/resume/:path*", "/settings/:path*", "/leave/:path*", "/fees/:path*", "/alumni/:path*", "/discussions/:path*", "/change-password"]
};
