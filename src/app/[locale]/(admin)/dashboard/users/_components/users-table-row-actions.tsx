"use client";

import { Edit2, Trash2, Ban } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/generated/prisma/client";
import type { DataTableRowAction } from "@/types/data-table";

import { updateUser } from "../_lib/actions";
import type { UsersTableActionVariant } from "./users-table-columns";

import { useTranslations } from "next-intl";

interface UsersTableRowActionsProps {
  row: { original: User };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<
      User,
      UsersTableActionVariant
    > | null>
  >;
}

export function UsersTableRowActions({
  row,
  setRowAction,
}: UsersTableRowActionsProps) {
  const t = useTranslations("Users");
  const [isUpdatePending, startUpdateTransition] = React.useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setRowAction({ row: row as any, variant: "update" });
              }}
            >
              <Edit2 className="size-4 text-blue-500" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.editDetails")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isUpdatePending}
              className="size-8 transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                startUpdateTransition(() => {
                  toast.promise(
                    updateUser({
                      id: row.original.id,
                      banned: !row.original.banned,
                    }),
                    {
                      loading: row.original.banned
                        ? t("messages.unbanning")
                        : t("messages.banning"),
                      success: row.original.banned
                        ? t("messages.unbanSuccess")
                        : t("messages.banSuccess"),
                      error: (err) => (err as Error).message,
                    }
                  );
                });
              }}
            >
              <Ban
                className={`size-4 ${
                  row.original.banned ? "text-green-500" : "text-orange-500"
                }`}
                aria-hidden="true"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {row.original.banned
              ? t("actions.unbanUser")
              : t("actions.banUser")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setRowAction({ row: row as any, variant: "delete" });
              }}
            >
              <Trash2 className="text-destructive size-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.deleteUser")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
