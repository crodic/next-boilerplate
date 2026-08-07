import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Users");

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(t("messages.updateSuccess"));
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || t("messages.updateError"));
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
  const t = useTranslations("Users");

  return useMutation({
    mutationFn: updateUsers,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(t("messages.updateSuccess"));
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || t("messages.updateError"));
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
  const t = useTranslations("Users");

  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(t("messages.deleteSuccess"));
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || t("messages.deleteError"));
    },
    ...options,
  });
}

import { authClient } from "@/lib/auth-client";

type CreateUserVariables = Parameters<typeof authClient.admin.createUser>[0];
type CreateUserResponse = Awaited<
  ReturnType<typeof authClient.admin.createUser>
>;

export function useCreateUserMutation(
  options?: Omit<
    UseMutationOptions<CreateUserResponse, Error, CreateUserVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const t = useTranslations("Users");

  return useMutation({
    mutationFn: (variables) => authClient.admin.createUser(variables),
    onSuccess: (...args) => {
      const [res] = args;
      if (res.error) {
        toast.error(res.error.message || t("messages.createError"));
        return;
      }
      toast.success(t("messages.createSuccess"));
      queryClient.invalidateQueries({
        queryKey: generateQueryKeys("admin-users"),
      });
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || t("messages.createError"));
    },
    ...options,
  });
}
