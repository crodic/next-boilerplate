import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { roles, UserRole } from "./lib/auth-permissions";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { APP_ROUTES } from "./config/routes";

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

    // Global Authorization Check based on APP_ROUTES
    let isAuthorized = true;
    for (const key of Object.keys(APP_ROUTES)) {
      const route = APP_ROUTES[key];
      // Match exact or startsWith / (so /dashboard/users/1 matches /dashboard/users)
      if (
        pathnameWithoutLocale === route.url ||
        pathnameWithoutLocale.startsWith(`${route.url}/`)
      ) {
        if (!route.roles && !route.permissions) {
          continue;
        }

        const userRoleStr = session.user.role as UserRole | undefined;
        const userRoleObj = userRoleStr ? roles[userRoleStr] : undefined;

        let hasRole = false;
        if (route.roles && userRoleStr && route.roles.includes(userRoleStr)) {
          hasRole = true;
        }

        let hasPermission = false;
        if (route.permissions && userRoleObj?.statements) {
          hasPermission = route.permissions.some((p) => {
            return (userRoleObj.statements as any)?.[p.resource]?.includes(
              p.action
            );
          });
        }

        if (!hasRole && !hasPermission) {
          isAuthorized = false;
          break; // Deny access
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.rewrite(
        new URL(`/${locale}/dashboard/403`, request.url)
      );
    }
  }

  if (isAuthRoute && session) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|monitoring|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
