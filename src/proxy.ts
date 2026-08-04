import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const intlMiddleware = createMiddleware(routing);

const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const PRIVATE_ROUTES = ["/dashboard/*"];

function matchesRoute(pathname: string, patterns: string[]) {
  return patterns.some((pattern) => {
    if (pattern.endsWith("/*")) {
      const basePattern = pattern.slice(0, -2);
      return pathname === basePattern || pathname.startsWith(`${basePattern}/`);
    }
    return pathname === pattern;
  });
}

export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { pathname } = request.nextUrl;

  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";

  const isProtectedRoute = matchesRoute(pathnameWithoutLocale, PRIVATE_ROUTES);
  const isAuthRoute = matchesRoute(pathnameWithoutLocale, AUTH_ROUTES);

  const locale = pathname.match(/^\/(vi|en)/)?.[1] || routing.defaultLocale;

  if (isProtectedRoute) {
    if (!session) {
      const loginUrl = new URL(`/${locale}/auth/sign-in`, request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role check for dashboard (admin routes)
    if (
      pathnameWithoutLocale === "/dashboard" ||
      pathnameWithoutLocale.startsWith("/dashboard/")
    ) {
      if (session.user.role !== "admin") {
        const homeUrl = new URL(`/${locale}/`, request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  if (isAuthRoute && session) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|monitoring|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
