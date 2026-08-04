import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage users, view their roles, and perform admin actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "3rem",
              "10rem",
              "15rem",
              "8rem",
              "8rem",
              "10rem",
              "3rem",
            ]}
            shrinkZero
          />
        </CardContent>
      </Card>
    </div>
  );
}
