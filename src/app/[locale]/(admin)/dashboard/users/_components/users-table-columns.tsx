"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CircleDashed,
  Text,
  Shield,
  ShieldAlert,
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/generated/prisma/client";
import type { DataTableRowAction } from "@/types/data-table";

import { UsersTableRowActions } from "./users-table-row-actions";

export type UsersTableActionVariant = "update" | "delete" | "detail" | "ban";

interface GetUsersTableColumnsProps {
  roleCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<
      User,
      UsersTableActionVariant
    > | null>
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
      cell: ({ row }) => (
        <div className="min-w-32 font-medium">{row.getValue("name")}</div>
      ),
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
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
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
          <Badge
            variant={role === "admin" ? "gradient" : "secondary"}
            className="w-fit"
          >
            {role === "admin" && <Shield className="mr-1 size-3" />}
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
            icon: ShieldAlert,
          },
          {
            label: "User",
            value: "user",
            count: roleCounts["user"] || 0,
            icon: Shield,
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
          <Badge
            variant={isBanned ? "destructive" : "outline"}
            className={
              isBanned
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }
          >
            <div
              className={`mr-1 size-1.5 rounded-full ${isBanned ? "bg-red-500" : "bg-emerald-500"}`}
            />
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
        <div className="text-muted-foreground min-w-24 text-sm">
          {new Date(cell.getValue<Date>()).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
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
      cell: ({ row }) => (
        <UsersTableRowActions row={row} setRowAction={setRowAction} />
      ),
      size: 40,
    },
  ];
}
