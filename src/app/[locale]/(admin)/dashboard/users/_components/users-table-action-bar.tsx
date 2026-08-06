"use client";

import type { Table } from "@tanstack/react-table";
import {
  Download,
  Shield,
  ShieldOff,
  Trash2,
  X,
  Ban,
  CheckCircle2,
} from "lucide-react";
import * as React from "react";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/generated/prisma/client";
import { exportTableToCSV } from "@/lib/export";
import {
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} from "../_hooks/mutations";

interface UsersTableActionBarProps {
  table: Table<User>;
}

export function UsersTableActionBar({ table }: UsersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const { mutateAsync: updateUsers } = useUpdateUsersMutation();
  const { mutateAsync: deleteUsers } = useDeleteUsersMutation();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const onUserUpdate = React.useCallback(
    (field: "role" | "banned", value: string | boolean) => {
      updateUsers({
        ids: rows.map((row) => row.original.id),
        [field]: value,
      }).then((res) => {
        if (!res.error) {
          // Toast is handled in mutation onSuccess
        }
      });
    },
    [rows, updateUsers]
  );

  const onUserExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ["select", "actions"],
      onlySelected: true,
      filename: "users-export",
    });
  }, [table]);

  const onUserDelete = React.useCallback(() => {
    deleteUsers({
      ids: rows.map((row) => row.original.id),
    }).then((res) => {
      if (!res.error) {
        table.toggleAllRowsSelected(false);
      }
    });
  }, [rows, table, deleteUsers]);

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <Shield className="size-4" />
              Role
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUserUpdate("role", "admin")}>
              <Shield className="mr-2 size-4" /> Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUserUpdate("role", "user")}>
              <ShieldOff className="mr-2 size-4" /> User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <Ban className="size-4" />
              Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUserUpdate("banned", false)}>
              <CheckCircle2 className="mr-2 size-4 text-emerald-500" /> Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUserUpdate("banned", true)}>
              <Ban className="mr-2 size-4 text-red-500" /> Banned
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ActionBarItem onClick={onUserExport}>
          <Download className="size-4" />
          Export
        </ActionBarItem>

        <ActionBarItem variant="destructive" onClick={onUserDelete}>
          <Trash2 className="size-4" />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
