"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CircleDashed,
  Ellipsis,
  Text,
  Shield,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Prisma, User } from "@/generated/prisma/client";
import type { DataTableRowAction } from "@/types/data-table";

import { updateUser } from "../lib/actions";

interface GetUsersTableColumnsProps {
  roleCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<User> | null>
  >;
}

export function getUsersTableColumns({
  roleCounts,
  statusCounts,
  setRowAction,
}: GetUsersTableColumnsProps): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => <div className="min-w-32">{row.getValue("name")}</div>,
      meta: {
        label: "Name",
        placeholder: "Search names...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      meta: {
        label: "Email",
        placeholder: "Search emails...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ cell }) => {
        const role = cell.getValue<string | null>() || "user";
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role.toUpperCase()}
          </Badge>
        );
      },
      meta: {
        label: "Role",
        variant: "multiSelect",
        options: [
          {
            label: "Admin",
            value: "admin",
            count: roleCounts["admin"] || 0,
            icon: Shield,
          },
          {
            label: "User",
            value: "user",
            count: roleCounts["user"] || 0,
            icon: Text,
          },
        ],
        icon: Shield,
      },
      enableColumnFilter: true,
    },
    {
      id: "banned",
      accessorKey: "banned",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const isBanned = cell.getValue<boolean | null>();
        return (
          <Badge variant={isBanned ? "destructive" : "outline"}>
            {isBanned ? "Banned" : "Active"}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          {
            label: "Active",
            value: "active",
            count: statusCounts["active"] || 0,
            icon: CircleDashed,
          },
          {
            label: "Banned",
            value: "banned",
            count: statusCounts["banned"] || 0,
            icon: CircleDashed,
          },
        ],
        icon: CircleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Joined At" />
      ),
      cell: ({ cell }) => (
        <div className="min-w-24">
          {new Date(cell.getValue<Date>()).toLocaleDateString()}
        </div>
      ),
      meta: {
        label: "Joined At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.role || "user"}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateUser({
                            id: row.original.id,
                            role: value,
                          }),
                          {
                            loading: "Updating role...",
                            success: "Role updated",
                            error: (err) => (err as Error).message,
                          }
                        );
                      });
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="admin"
                      disabled={isUpdatePending}
                    >
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="user"
                      disabled={isUpdatePending}
                    >
                      User
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  startUpdateTransition(() => {
                    toast.promise(
                      updateUser({
                        id: row.original.id,
                        banned: !row.original.banned,
                      }),
                      {
                        loading: row.original.banned
                          ? "Unbanning..."
                          : "Banning...",
                        success: row.original.banned
                          ? "User unbanned"
                          : "User banned",
                        error: (err) => (err as Error).message,
                      }
                    );
                  });
                }}
              >
                {row.original.banned ? "Unban" : "Ban"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
