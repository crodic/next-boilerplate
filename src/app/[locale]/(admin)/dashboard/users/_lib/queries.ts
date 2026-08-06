import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { GetUsersSchema } from "./validations";
import { PrismaQueryBuilder } from "@/lib/prisma-query-builder";

export async function getUsers(input: GetUsersSchema) {
  try {
    const { where, orderBy } = new PrismaQueryBuilder<Prisma.UserWhereInput>()
      .contains("name", input.name)
      .contains("email", input.email)
      .in("role", input.role)
      .boolean("banned", input.banned, "banned")
      .dateRange("createdAt", input.createdAt)
      .sort(input.sort, [{ createdAt: "desc" }])
      .build();

    const [data, meta] = await prisma.user
      .paginate({
        where,
        orderBy,
      })
      .withPages({
        limit: input.perPage,
        page: input.page,
        includePageCount: true,
      });

    return { data, pageCount: meta.pageCount };
  } catch (err: any) {
    console.error("Prisma error in getUsers:", err);
    throw new Error(err?.message || "Failed to get users");
  }
}

export async function getUserRoleCounts() {
  try {
    const roles = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    return roles.reduce(
      (acc, curr) => {
        if (curr.role) {
          acc[curr.role] = curr._count.role;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  } catch {
    return {};
  }
}

export async function getUserStatusCounts() {
  try {
    const statuses = await prisma.user.groupBy({
      by: ["banned"],
      _count: { _all: true },
    });

    return statuses.reduce(
      (acc, curr) => {
        const key = curr.banned ? "banned" : "active";
        acc[key] = (acc[key] || 0) + curr._count._all;
        return acc;
      },
      {} as Record<string, number>
    );
  } catch {
    return {};
  }
}
