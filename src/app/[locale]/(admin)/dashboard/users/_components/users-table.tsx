"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useDataUsers } from "../_hooks/queries";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { User } from "@/generated/prisma/client";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

import {
  type UsersTableActionVariant,
  getUsersTableColumns,
} from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { UsersTableActionBar } from "./users-table-action-bar";
import { UpdateUserDialog } from "./update-user-dialog";
import { DeleteUsersDialog } from "./delete-users-dialog";
import { UserDetailDialog } from "./user-detail-dialog";

interface UsersTableProps {
  queryKeys?: Partial<QueryKeys>;
}

import { useTranslations } from "next-intl";

export function UsersTable({ queryKeys }: UsersTableProps) {
  const t = useTranslations("Users");
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const {
    data: queryData,
    isPending,
    isFetching,
  } = useDataUsers(searchParamsString);

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    User,
    UsersTableActionVariant
  > | null>(null);

  const columns = React.useMemo(
    () =>
      getUsersTableColumns({
        roleCounts: queryData?.roleCounts ?? {},
        statusCounts: queryData?.statusCounts ?? {},
        setRowAction,
        t,
      }),
    [queryData?.roleCounts, queryData?.statusCounts, t]
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

  return (
    <div className="space-y-4">
      <DataTable
        table={table}
        aria-busy={isPending || queryData === undefined}
        isLoading={isPending || isFetching}
        onRowClick={(row) =>
          setRowAction({ row: row as any, variant: "detail" })
        }
        actionBar={<UsersTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <UpdateUserDialog
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        user={rowAction?.row.original ?? null}
      />
      <UserDetailDialog
        open={rowAction?.variant === "detail"}
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
    </div>
  );
}
