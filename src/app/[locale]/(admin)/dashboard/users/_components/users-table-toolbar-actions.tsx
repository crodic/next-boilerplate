"use client";

import type { Table } from "@tanstack/react-table";
import type { User } from "@/generated/prisma/client";

interface UsersTableToolbarActionsProps {
  table: Table<User>;
}

export function UsersTableToolbarActions({}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* 
        We removed the bulk Delete and Export buttons from here 
        since they are now elegantly handled by the ActionBar 
        when rows are selected.
      */}
    </div>
  );
}
