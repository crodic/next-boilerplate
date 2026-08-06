import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { GetUsersSchema } from "./validations";

export async function getUsers(input: GetUsersSchema) {
  try {
    const where: Prisma.UserWhereInput = {
      ...(input.name
        ? { name: { contains: input.name, mode: "insensitive" } }
        : {}),
      ...(input.email
        ? { email: { contains: input.email, mode: "insensitive" } }
        : {}),
      ...(input.role.length > 0 ? { role: { in: input.role } } : {}),
      ...(input.banned.length === 1
        ? {
            banned: input.banned[0] === "banned" ? true : { not: true },
          }
        : {}),
    };

    if (input.createdAt.length > 0) {
      where.createdAt = {};
      if (input.createdAt[0]) {
        where.createdAt.gte = new Date(input.createdAt[0]);
      }
      if (input.createdAt[1]) {
        where.createdAt.lte = new Date(input.createdAt[1]);
      }
    }

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) => ({
            [item.id]: item.desc ? "desc" : "asc",
          }))
        : [{ createdAt: "desc" }];

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
