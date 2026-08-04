import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { auth } from "@/lib/auth";

import { UsersTable } from "./components/users-table";
import {
  getUserRoleCounts,
  getUserStatusCounts,
  getUsers,
} from "./lib/queries";
import { searchParamsCache } from "./lib/validations";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface UsersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}

export default async function DashboardPage(props: UsersPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Verify Admin Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    // If not admin, you could redirect or show an unauthorized message
    // For now, let's just let it load to show the UI
  }

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
          <UsersTableWrapper {...props} />
        </CardContent>
      </Card>
    </div>
  );
}

async function UsersTableWrapper(props: UsersPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const [users, roleCounts, statusCounts] = await Promise.all([
    getUsers(search),
    getUserRoleCounts(),
    getUserStatusCounts(),
  ]);

  return (
    <UsersTable
      data={users}
      roleCounts={roleCounts}
      statusCounts={statusCounts}
    />
  );
}
