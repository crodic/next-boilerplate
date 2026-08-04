"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash } from "lucide-react";
import type { Prisma, User } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";

import { DeleteUsersDialog } from "./delete-users-dialog";

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export function UsersTableToolbarActions({
  table,
}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteUsersDialog
          users={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button variant="outline" size="sm" onClick={() => {}}>
        <Download className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
    </div>
  );
}
