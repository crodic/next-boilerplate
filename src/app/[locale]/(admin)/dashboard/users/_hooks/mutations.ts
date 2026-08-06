import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser, updateUsers, deleteUsers } from "../_lib/actions";
import { generateQueryKeys } from "@/lib/utils";

type UpdateUserVariables = Parameters<typeof updateUser>[0];
type UpdateUserResponse = Awaited<ReturnType<typeof updateUser>>;

export function useUpdateUserMutation(
  options?: Omit<
    UseMutationOptions<UpdateUserResponse, Error, UpdateUserVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("User updated successfully");
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to update user");
    },
    ...options,
  });
}

type UpdateUsersVariables = Parameters<typeof updateUsers>[0];
type UpdateUsersResponse = Awaited<ReturnType<typeof updateUsers>>;

export function useUpdateUsersMutation(
  options?: Omit<
    UseMutationOptions<UpdateUsersResponse, Error, UpdateUsersVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUsers,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Users updated successfully");
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to update users");
    },
    ...options,
  });
}

type DeleteUsersVariables = Parameters<typeof deleteUsers>[0];
type DeleteUsersResponse = Awaited<ReturnType<typeof deleteUsers>>;

export function useDeleteUsersMutation(
  options?: Omit<
    UseMutationOptions<DeleteUsersResponse, Error, DeleteUsersVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Users deleted successfully");
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to delete users");
    },
    ...options,
  });
}
