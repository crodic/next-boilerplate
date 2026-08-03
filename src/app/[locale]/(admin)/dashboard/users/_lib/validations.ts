import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["user", "admin"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  email: z.string().email("Please enter a valid email address.").optional(),
  role: z.enum(["user", "admin"]).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().optional().nullable(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
