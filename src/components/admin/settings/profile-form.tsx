"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { US, VN } from "country-flag-icons/react/3x2";

const profileFormSchema = z.object({
  language: z.enum(["en", "vi"]),
  themeMode: z.enum(["light", "dark", "system"]),
  fontFamily: z.enum(["geist", "inter", "roboto", "nunito", "playfair"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const t = useTranslations("AccountSettings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      language: locale as "en" | "vi",
      themeMode: (theme as "light" | "dark" | "system") || "system",
      fontFamily: "geist",
    },
  });

  useEffect(() => {
    setMounted(true);
    // Read font from cookie
    const value = `; ${document.cookie}`;
    const parts = value.split(`; dashboard-font=`);
    if (parts.length === 2) {
      const font = parts.pop()?.split(";").shift();
      if (
        font &&
        ["geist", "inter", "roboto", "nunito", "playfair"].includes(font)
      ) {
        form.setValue("fontFamily", font as any);
      }
    }
  }, [form]);

  // eslint-disable-next-line
  const formLanguage = form.watch("language");

  const formThemeMode = form.watch("themeMode");

  const formFontFamily = form.watch("fontFamily");

  function onSubmit(data: ProfileFormValues) {
    // Handle language change
    if (data.language !== locale) {
      router.replace(pathname, { locale: data.language });
    }

    // Handle theme mode change
    if (data.themeMode !== theme) {
      setTheme(data.themeMode);
    }

    // Handle font family change
    const fontValue = `; ${document.cookie}`;
    const fontParts = fontValue.split(`; dashboard-font=`);
    const currentFont =
      fontParts.length === 2 ? fontParts.pop()?.split(";").shift() : "geist";

    if (data.fontFamily !== currentFont) {
      document.cookie = `dashboard-font=${data.fontFamily}; path=/; max-age=31536000`;
      router.refresh();
    }

    toast.success(t("success.profileUpdated"));
  }

  if (!mounted) {
    return null;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel>{t("language")}</FieldLabel>
            <FieldContent>
              <Select
                onValueChange={(val) =>
                  form.setValue("language", val as "en" | "vi", {
                    shouldDirty: true,
                  })
                }
                value={formLanguage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectLanguage")}>
                    {formLanguage === "en" ? (
                      <div className="flex items-center gap-2">
                        <US title="English" className="h-4 w-5 rounded-[2px]" />
                        <span>English</span>
                      </div>
                    ) : formLanguage === "vi" ? (
                      <div className="flex items-center gap-2">
                        <VN
                          title="Tiếng Việt"
                          className="h-4 w-5 rounded-[2px]"
                        />
                        <span>Tiếng Việt</span>
                      </div>
                    ) : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <US title="English" className="h-4 w-5 rounded-[2px]" />
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vi">
                    <div className="flex items-center gap-2">
                      <VN
                        title="Tiếng Việt"
                        className="h-4 w-5 rounded-[2px]"
                      />
                      <span>Tiếng Việt</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>{t("languageDescription")}</FieldDescription>
              <FieldError errors={[form.formState.errors.language]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("themeMode")}</FieldLabel>
            <FieldContent>
              <Select
                onValueChange={(val) =>
                  form.setValue("themeMode", val as any, { shouldDirty: true })
                }
                value={formThemeMode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectThemeMode")}>
                    {formThemeMode === "light"
                      ? "Light"
                      : formThemeMode === "dark"
                        ? "Dark"
                        : "System"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>{t("themeModeDescription")}</FieldDescription>
              <FieldError errors={[form.formState.errors.themeMode]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{t("fontFamily")}</FieldLabel>
            <FieldContent>
              <Select
                onValueChange={(val) =>
                  form.setValue("fontFamily", val as any, { shouldDirty: true })
                }
                value={formFontFamily}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectFontFamily")}>
                    {formFontFamily
                      ? t(`fonts.${formFontFamily}` as any)
                      : t("fonts.geist")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geist">{t("fonts.geist")}</SelectItem>
                  <SelectItem value="inter">{t("fonts.inter")}</SelectItem>
                  <SelectItem value="roboto">{t("fonts.roboto")}</SelectItem>
                  <SelectItem value="nunito">{t("fonts.nunito")}</SelectItem>
                  <SelectItem value="playfair">
                    {t("fonts.playfair")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>{t("fontFamilyDescription")}</FieldDescription>
              <FieldError errors={[form.formState.errors.fontFamily]} />
            </FieldContent>
          </Field>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!form.formState.isDirty}>
            {t("updateProfile")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
