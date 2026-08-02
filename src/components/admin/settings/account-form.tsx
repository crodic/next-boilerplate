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
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth, useSession } from "@better-auth-ui/react";
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const accountFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const { authClient } = useAuth();
  const { data: session } = useSession(authClient);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const t = useTranslations("AccountSettings");

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, form]);

  const onSubmit = async (data: AccountFormValues) => {
    setIsPending(true);
    try {
      const res = await authClient.updateUser({
        name: data.name,
        // better-auth might handle email updates via a specific change email flow
        // For simplicity we update name here. If email changes, call changeEmail.
      });
      if (res.error) {
        toast.error(res.error.message || t("error.somethingWentWrong"));
      } else {
        toast.success(t("success.accountUpdated"));
      }
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    } finally {
      setIsPending(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload the avatar
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await res.json();

      // Update the user's avatar via better-auth
      const updateRes = await authClient.updateUser({
        image: data.url,
      });

      if (updateRes.error) {
        throw new Error(updateRes.error.message);
      }

      toast.success(t("success.avatarUpdated"));
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await authClient.deleteUser();
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success(t("success.accountDeleted"));
        window.location.href = "/";
      }
    } catch (error: any) {
      toast.error(error.message || t("error.somethingWentWrong"));
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

  if (!session) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t("account")}</CardTitle>
            <CardDescription>
              Update your account details and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field>
              <FieldLabel>{t("avatar")}</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-4">
                  <div
                    className="bg-muted relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border transition-opacity hover:opacity-80"
                    onClick={() =>
                      !isUploading && fileInputRef.current?.click()
                    }
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "Avatar"}
                      />
                      <AvatarFallback className="rounded-none text-xl font-bold">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? t("uploading") : t("changeAvatar")}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <FieldDescription>
                      {t("avatarDescription")}
                    </FieldDescription>
                  </div>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>{t("name")}</FieldLabel>
              <FieldContent>
                <Input placeholder={t("yourName")} {...form.register("name")} />
                <FieldDescription>{t("nameDescription")}</FieldDescription>
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>{t("email")}</FieldLabel>
              <FieldContent>
                <Input
                  placeholder={t("yourEmail")}
                  disabled
                  {...form.register("email")}
                />
                <FieldDescription>{t("emailDescription")}</FieldDescription>
                <FieldError errors={[form.formState.errors.email]} />
              </FieldContent>
            </Field>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("updateAccount")}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">{t("dangerZone")}</CardTitle>
          <CardDescription>{t("dangerDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4">
            <Button
              variant="destructive"
              onClick={() => setIsAlertOpen(true)}
              disabled={isDeleting}
            >
              {t("deleteAccount")}
            </Button>
          </div>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("deleteConfirmTitle") || "Are you absolutely sure?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteConfirm")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  {t("cancel") || "Cancel"}
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("deleteAccount")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
