import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUsers } from "./_lib/queries";
import { UsersTable } from "./_components/users-table";
import { UsersHeaderActions } from "./_components/users-header-actions";

export default async function DashboardUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Verify Admin Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    // If not admin, you could redirect or show an unauthorized message
    return <div className="p-8">Unauthorized</div>;
  }

  // Await searchParams
  const resolvedSearchParams = await searchParams;

  // Fetch users using Prisma extension pagination
  const { data, pageCount } = await getUsers(resolvedSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        </div>
        <div>
          <UsersHeaderActions />
        </div>
      </div>

      <UsersTable data={data} pageCount={pageCount} />
    </div>
  );
}
