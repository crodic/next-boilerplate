import { setRequestLocale } from "next-intl/server";
import { UserButton } from "@/components/auth/user/user-button";
import { Link } from "@/i18n/routing";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 dark:border-zinc-800 dark:bg-black">
        <Link href="/" className="text-lg font-bold">
          Admin Dashboard
        </Link>
        <UserButton />
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
