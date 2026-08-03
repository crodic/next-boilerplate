import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";
import { pagination } from "prisma-extension-pagination";

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof createPrismaClient>;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
  }).$extends(
    pagination({
      pages: {
        limit: 10,
        includePageCount: true,
      },
    })
  );
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
