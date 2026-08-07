"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/generated/prisma/client";

import { useUpdateUserMutation } from "../_hooks/mutations";
import { type UpdateUserSchema, updateUserSchema } from "../_lib/validations";

import { useTranslations } from "next-intl";

interface UpdateUserDialogProps extends React.ComponentPropsWithRef<
  typeof Dialog
> {
  user: User | null;
}

export function UpdateUserDialog({ user, ...props }: UpdateUserDialogProps) {
  const t = useTranslations("Users");
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user?.id ?? "",
      name: user?.name ?? "",
      role: user?.role ?? "user",
      banned: user?.banned ?? false,
    },
  });

  React.useEffect(() => {
    form.reset({
      id: user?.id ?? "",
      name: user?.name ?? "",
      role: user?.role ?? "user",
      banned: user?.banned ?? false,
    });
  }, [user, form]);

  function onSubmit(input: UpdateUserSchema) {
    if (!user) return;

    updateUser({
      ...input,
      id: user.id,
    }).then((res) => {
      if (!res.error) {
        form.reset(input);
        props.onOpenChange?.(false);
      }
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.update.title")}</DialogTitle>
          <DialogDescription>
            {t("dialogs.update.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("fields.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.role")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder={t("fields.selectRole")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="user">
                          {t("fields.roleUser")}
                        </SelectItem>
                        <SelectItem value="admin">
                          {t("fields.roleAdmin")}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.status")}</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "banned")}
                    defaultValue={field.value ? "banned" : "active"}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={t("fields.status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="active">
                          {t("fields.active")}
                        </SelectItem>
                        <SelectItem value="banned">
                          {t("fields.banned")}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("actions.cancel")}
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isPending && (
                  <Loader
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {t("actions.update")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
