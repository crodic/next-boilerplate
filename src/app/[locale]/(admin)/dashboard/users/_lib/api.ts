import * as z from "zod";
import type { User } from "@/generated/prisma/client";
import { http } from "@/lib/http";

export const getUsersInputSchema = z
  .string()
  .describe("Query string containing search params");
export type GetUsersInput = z.infer<typeof getUsersInputSchema>;

export interface GetUsersResponse {
  data: User[];
  pageCount: number;
  roleCounts: Record<string, number>;
  statusCounts: Record<string, number>;
}

export async function fetchUsers(
  validQuery: GetUsersInput
): Promise<GetUsersResponse> {
  const res = await http.get<GetUsersResponse>(
    `/api/admin/users?${validQuery}`
  );
  return res.data;
}
