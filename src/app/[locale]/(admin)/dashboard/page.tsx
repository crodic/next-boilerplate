import prisma from "@/lib/prisma";
import { UserGrowthChart } from "./_components/user-growth-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, CheckCircle, Activity, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function getDashboardData() {
  const [totalUsers, verifiedUsers, activeSessions, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.session.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // Health check
  let dbLatency = 0;
  let dbStatus: "Healthy" | "Degraded" | "Down" = "Down";
  try {
    const start = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Math.round(performance.now() - start);
    dbStatus = dbLatency < 100 ? "Healthy" : "Degraded";
  } catch (_error) {
    dbStatus = "Down";
  }

  // User growth data for the last 14 days
  const now = Date.now();
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
  const recentUsersGrowth = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: fourteenDaysAgo,
      },
    },
    select: { createdAt: true },
  });

  const growthDataMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    growthDataMap.set(dateStr, 0);
  }

  recentUsersGrowth.forEach((u) => {
    const dateStr = u.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (growthDataMap.has(dateStr)) {
      growthDataMap.set(dateStr, growthDataMap.get(dateStr)! + 1);
    }
  });

  const growthData = Array.from(growthDataMap.entries()).map(
    ([date, users]) => ({
      date,
      users,
    })
  );

  const today = new Date(now).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    totalUsers,
    verifiedUsers,
    activeSessions,
    recentUsers,
    dbLatency,
    dbStatus,
    growthData,
    today,
  };
}

export default async function DashboardPage() {
  const {
    totalUsers,
    verifiedUsers,
    activeSessions,
    recentUsers,
    dbLatency,
    dbStatus,
    growthData,
    today,
  } = await getDashboardData();

  return (
    <div className="animate-in fade-in flex-1 space-y-8 duration-500">
      <div className="slide-in-from-bottom-4 animate-in flex flex-col space-y-2 duration-700">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, Admin 👋
        </h2>
        <div className="text-muted-foreground flex items-center space-x-2">
          <p className="text-sm">{today}</p>
          <span className="text-xs">•</span>
          <Badge
            variant={dbStatus === "Healthy" ? "secondary" : "destructive"}
            className="gap-1 rounded-full font-normal"
          >
            <Database className="h-3 w-3" />
            DB: {dbStatus} ({dbLatency}ms)
          </Badge>
        </div>
      </div>

      <div className="slide-in-from-bottom-6 animate-in grid gap-4 duration-700 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="bg-primary/10 rounded-full p-2">
              <Users className="text-primary h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Registered on the platform
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <div className="rounded-full bg-green-500/10 p-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {totalUsers > 0
                ? Math.round((verifiedUsers / totalUsers) * 100)
                : 0}
              % of total users
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <div className="rounded-full bg-indigo-500/10 p-2">
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Currently active logins
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users Today
            </CardTitle>
            <div className="rounded-full bg-amber-500/10 p-2">
              <Users className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {growthData.length > 0
                ? growthData[growthData.length - 1].users
                : 0}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Joined in the last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="slide-in-from-bottom-8 animate-in grid gap-4 duration-700 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Number of new users registered over the last 14 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <UserGrowthChart data={growthData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              The most recent users to join the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  No users found
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="hover:bg-muted/50 hover:border-border/50 flex items-center rounded-lg border border-transparent p-3 transition-colors"
                  >
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={user.image ?? undefined} alt="Avatar" />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-muted-foreground bg-secondary ml-auto rounded-md px-2 py-1 text-xs font-medium">
                      {user.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
