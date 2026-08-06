import * as React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function PageShell({
  title,
  description,
  icon,
  headerActions,
  children,
  className,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn("flex h-full flex-1 flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="from-primary to-primary/60 inline-flex items-center gap-3 bg-gradient-to-r bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {icon}
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
}
