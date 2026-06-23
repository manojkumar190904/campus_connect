import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-env";
import { canAccessRoute, getRoleHome } from "@/lib/role-access";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request, secret: getAuthSecret() });
  const protectedRoute =
    pathname.startsWith("/portal/") ||
    ["/admin", "/faculty", "/dashboard", "/assistant", "/notes", "/attendance", "/assignments", "/announcements", "/events", "/placements", "/clubs", "/lost-found", "/marketplace", "/resume", "/settings", "/leave", "/fees", "/alumni", "/discussions", "/change-password"].some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (protectedRoute) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", request.url));
    if (token.mustChangePassword && pathname !== "/change-password") {
      return NextResponse.redirect(new URL("/change-password", request.url));
    }
    if (!canAccessRoute(String(token.role), pathname)) {
      return NextResponse.redirect(new URL(getRoleHome(String(token.role)), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/faculty/:path*", "/dashboard/:path*", "/assistant/:path*", "/notes/:path*", "/attendance/:path*", "/assignments/:path*", "/announcements/:path*", "/events/:path*", "/placements/:path*", "/clubs/:path*", "/lost-found/:path*", "/marketplace/:path*", "/resume/:path*", "/settings/:path*", "/leave/:path*", "/fees/:path*", "/alumni/:path*", "/discussions/:path*", "/change-password"]
};
