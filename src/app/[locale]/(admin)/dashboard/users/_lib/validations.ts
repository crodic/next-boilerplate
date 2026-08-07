import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { Prisma } from "@/generated/prisma/client";
import { UserRole } from "@/lib/auth-permissions";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<
    Prisma.UserGetPayload<Record<string, never>>
  >().withDefault([{ id: "createdAt", desc: true }]),
  name: parseAsString.withDefault(""),
  email: parseAsString.withDefault(""),
  role: parseAsArrayOf(parseAsString).withDefault([]),
  banned: parseAsArrayOf(parseAsString).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  role: z.string().optional(),
  banned: z.boolean().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole),
});

export type GetUsersSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
