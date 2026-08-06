import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env";
import { pagination } from "prisma-extension-pagination";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const getExtendedClient = () => {
  return new PrismaClient({
    adapter,
  }).$extends(pagination());
};

type ExtendedPrismaClient = ReturnType<typeof getExtendedClient>;

const globalForPrisma = global as unknown as {
  prisma: ExtendedPrismaClient;
};

const prisma = globalForPrisma.prisma || getExtendedClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
