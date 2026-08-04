"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { User } from "@/generated/prisma/client";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

import { getUsersTableColumns } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { UpdateUserSheet } from "./update-user-sheet";
import { DeleteUsersDialog } from "./delete-users-dialog";

interface UsersTableProps {
  data: { data: User[]; pageCount: number };
  roleCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  queryKeys?: Partial<QueryKeys>;
}

export function UsersTable({
  data,
  roleCounts,
  statusCounts,
  queryKeys,
}: UsersTableProps) {
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<User> | null>(null);

  const columns = React.useMemo(
    () =>
      getUsersTableColumns({
        roleCounts,
        statusCounts,
        setRowAction,
      }),
    [roleCounts, statusCounts]
  );

  const [isPending, startTransition] = React.useTransition();

  const { table } = useDataTable({
    data: data.data,
    columns,
    pageCount: data.pageCount,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <UpdateUserSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        user={rowAction?.row.original ?? null}
      />
      <DeleteUsersDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
