import {
  useQuery,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { generateQueryKeys } from "@/lib/utils";
import {
  fetchUsers,
  type GetUsersInput,
  type GetUsersResponse,
  getUsersInputSchema,
} from "../_lib/api";

export function useDataUsers(
  searchParamsString: GetUsersInput,
  options?: Omit<
    UseQueryOptions<GetUsersResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  const validQuery = getUsersInputSchema.parse(searchParamsString);

  return useQuery<GetUsersResponse, Error>({
    queryKey: generateQueryKeys("admin-users", validQuery),
    queryFn: () => fetchUsers(validQuery),
    placeholderData: keepPreviousData,
    ...options,
  });
}
