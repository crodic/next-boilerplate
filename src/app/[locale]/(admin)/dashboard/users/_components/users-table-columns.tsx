"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "@/generated/prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Shield,
  ShieldOff,
  Ban,
} from "lucide-react";
import { deleteUsersAction, updateUserAction } from "../_lib/actions";
import { toast } from "sonner";
import { useTransition } from "react";

export function getColumns(): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px] truncate">{row.getValue("email")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role === "admin" ? "Admin" : "User"}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Joined At" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div>
            {formatDate(date, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isPending, startTransition] = useTransition();

        const handleDelete = () => {
          startTransition(async () => {
            const { error } = await deleteUsersAction([row.original.id]);
            if (error) {
              toast.error(error);
            } else {
              toast.success("User deleted successfully.");
            }
          });
        };

        const toggleRole = () => {
          startTransition(async () => {
            const newRole = row.original.role === "admin" ? "user" : "admin";
            const { error } = await updateUserAction(row.original.id, {
              role: newRole,
            });
            if (error) {
              toast.error(error);
            } else {
              toast.success(`Role updated to ${newRole}.`);
            }
          });
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="data-[state=open]:bg-muted hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md p-0 disabled:opacity-50">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onSelect={toggleRole}>
                {row.original.role === "admin" ? (
                  <>
                    <ShieldOff className="text-muted-foreground mr-2 size-4" />
                    Demote to User
                  </>
                ) : (
                  <>
                    <Shield className="text-muted-foreground mr-2 size-4" />
                    Promote to Admin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleDelete}
                className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950 dark:focus:text-red-400"
              >
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
