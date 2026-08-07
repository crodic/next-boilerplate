"use server";

import prisma from "@/lib/prisma";

import { UserRole } from "@/lib/auth-permissions";
import { revalidatePath } from "next/cache";
import type { UpdateUserSchema } from "./validations";
import { getUsers, getUserRoleCounts, getUserStatusCounts } from "./queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { GetUsersSchema } from "./validations";

export async function updateUser(input: UpdateUserSchema) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MANAGER)
    ) {
      throw new Error("Unauthorized");
    }
    if (input.id === session.user.id) {
      throw new Error("You cannot modify your own account from the dashboard.");
    }
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized");
    }
    if (input.ids.includes(session.user.id)) {
      throw new Error("You cannot delete your own account.");
    }
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
export async function updateUsers(input: {
  ids: string[];
  role?: string;
  banned?: boolean;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MANAGER)
    ) {
      throw new Error("Unauthorized");
    }
    if (input.ids.includes(session.user.id)) {
      throw new Error("You cannot modify your own account from the dashboard.");
    }
    const data: any = {};
    if (input.role !== undefined) data.role = input.role;
    if (input.banned !== undefined) data.banned = input.banned;

    if (Object.keys(data).length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: input.ids,
          },
        },
        data,
      });
    }

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

  if (
    !session ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.MANAGER)
  ) {
    throw new Error("Unauthorized");
  }

  const [data, roleCounts, statusCounts] = await Promise.all([
    getUsers(input),
    getUserRoleCounts(),
    getUserStatusCounts(),
  ]);

  return { ...data, roleCounts, statusCounts };
}
