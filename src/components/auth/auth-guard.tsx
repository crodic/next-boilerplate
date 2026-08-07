"use client";

import * as React from "react";
import { useSession } from "@better-auth-ui/react";
import { authClient } from "@/lib/auth-client";
import { roles, UserRole } from "@/lib/auth-permissions";
import type { RoutePermission } from "@/config/routes";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedPermissions?: RoutePermission[];
}

/**
 * AuthGuard is a generic wrapper component used to protect sections of the UI.
 * It conditionally renders `children` if the current user has at least one of the
 * `allowedRoles` OR at least one of the `allowedPermissions`.
 * Otherwise, it renders the `fallback` component (if provided).
 */
export function AuthGuard({
  children,
  fallback = null,
  allowedRoles,
  allowedPermissions,
}: AuthGuardProps) {
  const { data: session, isPending } = useSession(authClient);

  if (isPending) {
    return null; // Return null to prevent layout shifts while checking auth
  }

  if (!session) {
    return <>{fallback}</>;
  }

  const userRoleStr = (session.user as any).role as UserRole | undefined;
  const userRoleObj = userRoleStr ? roles[userRoleStr] : undefined;

  // If no restrictions are provided, just checking for authentication is enough
  if (!allowedRoles && !allowedPermissions) {
    return <>{children}</>;
  }

  let hasRole = false;
  if (allowedRoles && userRoleStr && allowedRoles.includes(userRoleStr)) {
    hasRole = true;
  }

  let hasPermission = false;
  if (allowedPermissions && userRoleObj?.statements) {
    hasPermission = allowedPermissions.some((p) => {
      return (userRoleObj.statements as any)?.[p.resource]?.includes(p.action);
    });
  }

  if (hasRole || hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
