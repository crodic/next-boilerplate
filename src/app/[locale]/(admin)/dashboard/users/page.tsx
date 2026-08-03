import { setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUsers } from "./_lib/queries";
import { UsersTable } from "./_components/users-table";
import { type PaginateQueryParams } from "@/types/data-table";

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage users, view their roles, and perform admin actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable data={data} pageCount={pageCount} />
        </CardContent>
      </Card>
    </div>
  );
}
