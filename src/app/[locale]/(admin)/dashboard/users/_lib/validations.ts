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

export type GetUsersSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
