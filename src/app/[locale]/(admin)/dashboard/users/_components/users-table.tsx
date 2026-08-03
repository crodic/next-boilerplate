"use client";

import * as React from "react";
import { type User } from "@/generated/prisma/client";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";

interface UsersTableProps {
  data: User[];
  pageCount: number;
}

export function UsersTable({ data, pageCount }: UsersTableProps) {
  const columns = React.useMemo(() => getColumns(), []);
  const [isPending, startTransition] = React.useTransition();

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    startTransition,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnVisibility: {
        id: false,
      },
    },
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable
      table={table}
      actionBar={<UsersTableToolbarActions table={table} />}
    >
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
