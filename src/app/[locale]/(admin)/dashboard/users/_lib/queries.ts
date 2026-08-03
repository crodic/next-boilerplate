import "server-only";

import prisma from "@/lib/prisma";
import { parseAsInteger, parseAsString } from "nuqs/server";
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
  const nameFilter = parseAsString.parseServerSide(searchParams.name);
  const emailFilter = parseAsString.parseServerSide(searchParams.email);
  const roleFilter = parseAsString.parseServerSide(searchParams.role);

  const joinOperator =
    typeof searchParams.joinOperator === "string"
      ? searchParams.joinOperator
      : "and";

  // Build Prisma query
  const orderBy =
    sort.length > 0
      ? sort.map((s) => ({ [s.id]: s.desc ? "desc" : "asc" }))
      : { createdAt: "desc" };

  const where: any = {};
  const conditions: any[] = [];

  if (nameFilter) {
    conditions.push({
      name: { contains: nameFilter, mode: "insensitive" },
    });
  }

  if (emailFilter) {
    conditions.push({
      email: { contains: emailFilter, mode: "insensitive" },
    });
  }

  if (roleFilter) {
    // roleFilter comes in as a comma-separated string like "admin,user"
    const roles = roleFilter.split(",");
    conditions.push({
      role: { in: roles },
    });
  }

  if (conditions.length > 0) {
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
