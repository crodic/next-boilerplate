import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  user: ["create", "read", "update", "delete", "ban"],
} as const;

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete", "ban"],
});

export const managerRole = ac.newRole({
  user: ["create", "read", "update"], // Manager can view, create and update users, but not delete or ban
});

export const userRole = ac.newRole({
  // Basic users have no admin permissions
});

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export const roles = {
  [UserRole.ADMIN]: adminRole,
  [UserRole.MANAGER]: managerRole,
  [UserRole.USER]: userRole,
};
