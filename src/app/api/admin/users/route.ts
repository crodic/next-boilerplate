import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getUserRoleCounts,
  getUserStatusCounts,
  getUsers,
} from "@/app/[locale]/(admin)/dashboard/users/lib/queries";
import { searchParamsCache } from "@/app/[locale]/(admin)/dashboard/users/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const plainSearchParams = Object.fromEntries(searchParams.entries());
    const search = searchParamsCache.parse(plainSearchParams);

    const [users, roleCounts, statusCounts] = await Promise.all([
      getUsers(search),
      getUserRoleCounts(),
      getUserStatusCounts(),
    ]);

    return NextResponse.json({
      data: users.data,
      pageCount: users.pageCount,
      roleCounts,
      statusCounts,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
