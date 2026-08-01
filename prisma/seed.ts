import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../src/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function seedAdmin() {
  const email = "admin@email.com";
  const password = "admin@2026";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user ${email} already exists.`);
    return;
  }

  console.log("Creating default admin using better-auth API...");

  try {
    const result = await auth.api.createUser({
      body: {
        email,
        password,
        name: "Admin",
        role: "admin",
      },
      asResponse: false, // Ensure it returns data instead of a Response object
    });

    if (result?.user) {
      // Mark as verified
      await prisma.user.update({
        where: { id: result.user.id },
        data: { emailVerified: true },
      });

      console.log(`🎉 Admin user created successfully via better-auth!`);
      console.log(`Email: ${result.user.email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${result.user.role}`);
    }
  } catch (error: unknown) {
    const err = error as any;
    console.error(
      "Failed to create admin:",
      err?.body?.message || err?.message || err
    );
  }
}

export async function main() {
  console.log("🌱 Seeding database...");

  // Execute seeders
  await seedAdmin();

  // Add more seeders below in the future
  // await seedCategories();
  // await seedProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
