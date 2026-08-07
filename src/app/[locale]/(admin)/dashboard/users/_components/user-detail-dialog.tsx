"use client";

import {
  CalendarDays,
  Mail,
  Shield,
  CircleDashed,
  Fingerprint,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/generated/prisma/client";

import { useTranslations } from "next-intl";

interface UserDetailDialogProps extends React.ComponentPropsWithRef<
  typeof Dialog
> {
  user: User | null;
}

export function UserDetailDialog({ user, ...props }: UserDetailDialogProps) {
  const t = useTranslations("Users");

  if (!user) return <Dialog {...props} />;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            {t("dialogs.details.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dialogs.details.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="border-muted/50 size-20 border-4 shadow-sm">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="from-primary/80 to-primary/40 text-primary-foreground bg-gradient-to-br text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-semibold tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant={user.role === "admin" ? "gradient" : "secondary"}
                >
                  {user.role === "admin" && <Shield className="mr-1 size-3" />}
                  {user.role === "admin"
                    ? t("fields.roleAdmin").toUpperCase()
                    : t("fields.roleUser").toUpperCase()}
                </Badge>
                <Badge
                  variant={user.banned ? "destructive" : "outline"}
                  className={
                    user.banned
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-emerald-200 bg-emerald-50 text-emerald-600"
                  }
                >
                  <CircleDashed className="mr-1 size-3" />
                  {user.banned ? t("fields.banned") : t("fields.active")}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 grid grid-cols-1 gap-4 rounded-xl border p-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                <Mail className="text-primary size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {t("fields.email")}
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                <CalendarDays className="text-primary size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {t("fields.joinedAt")}
                </span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                <Fingerprint className="text-primary size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  User ID
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {user.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
