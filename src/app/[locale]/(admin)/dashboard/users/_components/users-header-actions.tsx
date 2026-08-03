"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateUserDialog } from "./create-user-dialog";

export function UsersHeaderActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setIsCreateOpen(true)}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        New User
      </Button>

      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
