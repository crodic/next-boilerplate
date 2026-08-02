"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth, useSession } from "@better-auth-ui/react";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Monitor, Smartphone, X, LogOut } from "lucide-react";
import Bowser from "bowser";
import { useTranslations } from "next-intl";

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function SecurityForm() {
  const { authClient } = useAuth();
  const { data: session } = useSession(authClient);
  const [isPending, setIsPending] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const t = useTranslations("AccountSettings");

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await authClient.listSessions();
      if (res.data) {
        setSessions(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [authClient]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchSessions();
  }, [fetchSessions]);

  const onSubmit = async (data: PasswordFormValues) => {
    setIsPending(true);
    try {
      const res = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        toast.error(res.error.message || t("error.somethingWentWrong"));
      } else {
        toast.success(t("success.passwordUpdated"));
        form.reset();
        fetchSessions(); // Refresh sessions since we revoked others
      }
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    } finally {
      setIsPending(false);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      const res = await authClient.revokeSession({ token: sessionToken });
      if (res.error) {
        toast.error(res.error.message || t("error.somethingWentWrong"));
      } else {
        toast.success(t("success.sessionRevoked"));
        fetchSessions();
      }
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t("changePassword")}</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>{t("currentPassword")}</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder={t("enterCurrentPassword")}
                  {...form.register("currentPassword")}
                />
                <FieldError errors={[form.formState.errors.currentPassword]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>{t("newPassword")}</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder={t("enterNewPassword")}
                  {...form.register("newPassword")}
                />
                <FieldError errors={[form.formState.errors.newPassword]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>{t("confirmPassword")}</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder={t("confirmNewPassword")}
                  {...form.register("confirmPassword")}
                />
                <FieldError errors={[form.formState.errors.confirmPassword]} />
              </FieldContent>
            </Field>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("updatePassword")}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>{t("activeSessions")}</CardTitle>
          <CardDescription>{t("sessionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="text-muted-foreground flex items-center text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loadingSessions")}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => {
                const isCurrentSession = s.token === session?.session.token;
                const ua = Bowser.parse(s.userAgent || "");
                const isMobile =
                  ua.platform.type === "mobile" ||
                  ua.platform.type === "tablet";
                const browserName = ua.browser.name || t("unknownBrowser");
                const osName = ua.os.name ? `, ${ua.os.name}` : "";

                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted rounded-full p-2">
                        {isMobile ? (
                          <Smartphone className="h-5 w-5" />
                        ) : (
                          <Monitor className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {browserName}
                          {osName}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          {isCurrentSession ? (
                            <span className="font-medium text-green-500">
                              {t("currentSession")}
                            </span>
                          ) : (
                            <span>
                              {s.createdAt
                                ? new Date(s.createdAt).toLocaleDateString()
                                : t("unknown")}
                            </span>
                          )}
                          {s.ipAddress && (
                            <>
                              <span>•</span>
                              <span>
                                {[
                                  "0000:0000:0000:0000:0000:0000:0000:0000",
                                  "::1",
                                  "127.0.0.1",
                                  "::",
                                  "0:0:0:0:0:0:0:1",
                                ].includes(s.ipAddress)
                                  ? "Localhost"
                                  : s.ipAddress}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {isCurrentSession ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t("signOut")}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(s.token)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t("revoke")}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
