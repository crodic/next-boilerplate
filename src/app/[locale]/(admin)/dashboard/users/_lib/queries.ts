import "server-only";

import prisma from "@/lib/prisma";
import { parseAsInteger } from "nuqs/server";
import { getSortingStateParser, getFiltersStateParser } from "@/lib/parsers";
import { type User } from "@/generated/prisma/client";
import {
  type ExtendedColumnSort,
  type ExtendedColumnFilter,
} from "@/types/data-table";

export async function getUsers(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  // Parse params
  const page = parseAsInteger.parseServerSide(searchParams.page) ?? 1;
  const perPage = parseAsInteger.parseServerSide(searchParams.perPage) ?? 10;

  const sort =
    getSortingStateParser<User>().parseServerSide(searchParams.sort) || [];
  const filters =
    getFiltersStateParser<User>().parseServerSide(searchParams.filters) || [];
  const joinOperator =
    typeof searchParams.joinOperator === "string"
      ? searchParams.joinOperator
      : "and";

  // Build Prisma query
  const orderBy =
    sort.length > 0
      ? sort.map((s) => ({ [s.id]: s.desc ? "desc" : "asc" }))
      : { createdAt: "desc" };

  // Note: Advanced filtering logic to map ExtendedColumnFilter to Prisma `where` clause goes here.
  // For now, we will handle basic filters manually or just return an empty where clause if not implemented.
  const where: any = {};

  if (filters.length > 0) {
    const conditions = filters.map((filter) => {
      // Basic implementation of filters
      if (filter.id === "name") {
        return {
          name: { contains: filter.value as string, mode: "insensitive" },
        };
      }
      if (filter.id === "email") {
        return {
          email: { contains: filter.value as string, mode: "insensitive" },
        };
      }
      if (filter.id === "role") {
        const roles = Array.isArray(filter.value)
          ? filter.value
          : [filter.value];
        return { role: { in: roles } };
      }
      return {};
    });

    if (joinOperator === "or") {
      where.OR = conditions;
    } else {
      where.AND = conditions;
    }
  }

  // Use the prisma-extension-pagination syntax
  const [users, meta] = await (prisma.user as any)
    .paginate({
      where,
      orderBy,
    })
    .withPages({
      limit: perPage,
      page: page,
      includePageCount: true,
    });

  return {
    data: users as User[],
    pageCount: meta.pageCount,
    total: meta.totalCount,
  };
}
