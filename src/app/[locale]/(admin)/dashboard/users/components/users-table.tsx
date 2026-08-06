"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import type { User } from "@/generated/prisma/client";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

import { getUsersTableColumns } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { UpdateUserSheet } from "./update-user-sheet";
import { DeleteUsersDialog } from "./delete-users-dialog";

interface UsersTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function UsersTable({ queryKeys }: UsersTableProps) {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const { data: queryData, isPending } = useQuery({
    queryKey: ["admin-users", searchParamsString],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?${searchParamsString}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json() as Promise<{
        data: User[];
        pageCount: number;
        roleCounts: Record<string, number>;
        statusCounts: Record<string, number>;
      }>;
    },
    placeholderData: keepPreviousData,
  });

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<User> | null>(null);

  const columns = React.useMemo(
    () =>
      getUsersTableColumns({
        roleCounts: queryData?.roleCounts ?? {},
        statusCounts: queryData?.statusCounts ?? {},
        setRowAction,
      }),
    [queryData?.roleCounts, queryData?.statusCounts]
  );

  const { table } = useDataTable({
    data: queryData?.data ?? [],
    columns,
    pageCount: queryData?.pageCount ?? -1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (isPending && !queryData) {
    return (
      <DataTableSkeleton
        columnCount={5}
        filterCount={3}
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
        shrinkZero
      />
    );
  }

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
