"use client";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { User } from "@/generated/prisma/client";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useDeleteUsersMutation } from "../_hooks/mutations";

import { useTranslations } from "next-intl";

interface DeleteUsersDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  users: Row<User>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteUsersDialog({
  users,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteUsersDialogProps) {
  const t = useTranslations("Users");
  const { mutateAsync: deleteUsers, isPending: isDeletePending } =
    useDeleteUsersMutation();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    deleteUsers({
      ids: users.map((user) => user.id),
    }).then((res) => {
      if (!res.error) {
        props.onOpenChange?.(false);
        onSuccess?.();
      }
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              {t("actions.deleteSelected", { count: users.length })}
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialogs.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("dialogs.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">{t("actions.cancel")}</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {t("actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            {t("actions.deleteSelected", { count: users.length })}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("dialogs.delete.title")}</DrawerTitle>
          <DrawerDescription>
            {t("dialogs.delete.description")}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">{t("actions.cancel")}</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            {t("actions.delete")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
