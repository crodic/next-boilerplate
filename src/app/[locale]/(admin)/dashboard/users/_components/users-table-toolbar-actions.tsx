"use client";

import { type User } from "@/generated/prisma/client";
import { type Table } from "@tanstack/react-table";
import { Download, Plus, Trash } from "lucide-react";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { CreateUserDialog } from "./create-user-dialog";
import { deleteUsersAction } from "../_lib/actions";
import { toast } from "sonner";

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export function UsersTableToolbarActions({
  table,
}: UsersTableToolbarActionsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  const handleDeleteSelected = () => {
    if (!hasSelectedRows) return;
    const ids = selectedRows.map((row) => row.original.id);

    startTransition(async () => {
      const { error } = await deleteUsersAction(ids);
      if (error) {
        toast.error(error);
      } else {
        toast.success(`Deleted ${ids.length} users successfully.`);
        table.toggleAllPageRowsSelected(false);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {hasSelectedRows ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={isPending}
        >
          <Trash className="mr-2 size-4" aria-hidden="true" />
          Delete ({selectedRows.length})
        </Button>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "users",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>

      <Button size="sm" onClick={() => setIsCreateOpen(true)}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        New User
      </Button>

      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
