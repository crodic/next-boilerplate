"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { UpdateUserSchema } from "./validations";
import { getUsers, getUserRoleCounts, getUserStatusCounts } from "./queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { GetUsersSchema } from "./validations";

export async function updateUser(input: UpdateUserSchema) {
  try {
    await prisma.user.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.role !== undefined && { role: input.role }),
        ...(input.banned !== undefined && { banned: input.banned }),
      },
    });

    revalidatePath("/dashboard/users");
    return { error: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function deleteUsers(input: { ids: string[] }) {
  try {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    revalidatePath("/dashboard/users");
    return { error: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function fetchUsersAction(input: GetUsersSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const [data, roleCounts, statusCounts] = await Promise.all([
    getUsers(input),
    getUserRoleCounts(),
    getUserStatusCounts(),
  ]);

  return { ...data, roleCounts, statusCounts };
}
