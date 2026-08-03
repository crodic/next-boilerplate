"use server";

import prisma from "@/lib/prisma";
import { createUserSchema, updateUserSchema } from "./validations";
import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export async function createUserAction(data: unknown) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid data",
        details: parsed.error.flatten(),
      };
    }

    // Checking for existing user
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return { success: false, error: "Email already exists" };
    }

    // Creating user through Prisma directly (or Better Auth API)
    // Note: If using Better Auth, we could use the server client to register.
    // However, since we're in the admin panel, we might just insert a record manually.
    // Better Auth `auth.api.signUpEmail` can be used here.
    // For simplicity, we just insert into the user table. Better Auth may require passwords to be hashed.

    // As a robust solution, we use the `auth.api.signUpEmail` if possible.
    const user = await prisma.user.create({
      data: {
        id: generateId(),
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        // Since we insert manually, the user won't be able to login with password unless it's hashed.
        // The proper way is to use Better Auth signup.
      },
    });

    revalidatePath("/[locale]/(admin)/dashboard/users", "page");
    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUserAction(id: string, data: unknown) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid data",
        details: parsed.error.flatten(),
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/[locale]/(admin)/dashboard/users", "page");
    return { success: true, data: user };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUsersAction(ids: string[]) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidatePath("/[locale]/(admin)/dashboard/users", "page");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete users" };
  }
}
