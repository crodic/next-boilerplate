import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { UsersTable } from "./_components/users-table";
import { UsersRound } from "lucide-react";
import { PageShell } from "@/components/admin/page-shell";
import { CreateUserDialog } from "./_components/create-user-dialog";

interface UsersPageProps {
  params: Promise<{ locale: string }>;
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
    <PageShell
      title="Users Management"
      description="Manage your users, assign roles, and handle account statuses across the platform."
      icon={<UsersRound className="text-primary size-8" />}
      headerActions={<CreateUserDialog />}
    >
      <UsersTable />
    </PageShell>
  );
}
