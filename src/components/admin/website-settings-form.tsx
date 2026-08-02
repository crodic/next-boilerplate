"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateWebsiteSettings } from "@/actions/settings";
import {
  websiteSettingsSchema,
  type WebsiteSettingsFormValues,
} from "@/lib/validations/settings";

export function WebsiteSettingsForm({
  initialSettings,
}: {
  initialSettings: WebsiteSettingsFormValues;
}) {
  const [isPending, setIsPending] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Record<string, File>>(
    {}
  );

  const form = useForm<WebsiteSettingsFormValues>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: initialSettings,
  });

  const formValues = form.watch();

  const onSubmit = async (data: WebsiteSettingsFormValues) => {
    setIsPending(true);
    const toastId = toast.loading("Saving settings...");

    try {
      const updatedData = { ...data };

      // Upload pending files first
      for (const [field, file] of Object.entries(pendingUploads)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "assets");

        const res = await fetch("/api/upload/asset", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Failed to upload ${field}`);

        const responseData = await res.json();
        // Update the form data payload with the real URL
        updatedData[field as keyof WebsiteSettingsFormValues] =
          responseData.url;
      }

      const result = await updateWebsiteSettings(updatedData);

      if (result.success) {
        setPendingUploads({});
        toast.success("Website settings updated successfully", { id: toastId });
      } else {
        throw new Error(result.error || "Failed to update settings");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof WebsiteSettingsFormValues
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);

    // Store the file to be uploaded on submit
    setPendingUploads((prev) => ({ ...prev, [field]: file }));

    // Update the form value with the preview URL so the user sees it immediately
    form.setValue(field, previewUrl, { shouldDirty: true });
  };

  const renderImageUpload = (
    field: keyof WebsiteSettingsFormValues,
    label: string,
    value?: string
  ) => {
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <div className="flex items-center gap-4">
            {value ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={value}
                  alt={label}
                  fill
                  className="h-auto w-auto object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed">
                <span className="text-muted-foreground text-center text-xs">
                  No image
                </span>
              </div>
            )}
            <div className="flex w-full flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                className="w-full max-w-xs"
                onChange={(e) => handleFileUpload(e, field)}
              />
              {value && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    form.setValue(field, "", { shouldDirty: true });
                    setPendingUploads((prev) => {
                      const next = { ...prev };
                      delete next[field];
                      return next;
                    });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
          <FieldError errors={[form.formState.errors[field]]} />
        </FieldContent>
      </Field>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General SEO</TabsTrigger>
          <TabsTrigger value="assets">Logos & Favicon</TabsTrigger>
          <TabsTrigger value="social">Social Media (OG)</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Field>
            <FieldLabel htmlFor="title">Website Title</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="e.g. My Awesome Startup"
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Website Description</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Brief description of your website..."
                rows={4}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="keywords">Keywords</FieldLabel>
            <FieldContent>
              <Input
                id="keywords"
                placeholder="comma, separated, keywords"
                {...form.register("keywords")}
              />
              <FieldError errors={[form.formState.errors.keywords]} />
            </FieldContent>
          </Field>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {renderImageUpload(
              "logoLight",
              "Logo (Light Mode)",
              formValues.logoLight
            )}
            {renderImageUpload(
              "logoDark",
              "Logo (Dark Mode)",
              formValues.logoDark
            )}
            {renderImageUpload(
              "faviconLight",
              "Favicon (Light Mode)",
              formValues.faviconLight
            )}
            {renderImageUpload(
              "faviconDark",
              "Favicon (Dark Mode)",
              formValues.faviconDark
            )}
          </div>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {renderImageUpload(
              "ogImage",
              "Open Graph Image",
              formValues.ogImage
            )}
            {renderImageUpload(
              "twitterImage",
              "Twitter Image",
              formValues.twitterImage
            )}
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Field>
            <FieldLabel htmlFor="author">Author</FieldLabel>
            <FieldContent>
              <Input
                id="author"
                placeholder="e.g. John Doe"
                {...form.register("author")}
              />
              <FieldError errors={[form.formState.errors.author]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="themeColor">Theme Color (Hex)</FieldLabel>
            <FieldContent>
              <Input
                id="themeColor"
                placeholder="#ffffff"
                {...form.register("themeColor")}
              />
              <FieldError errors={[form.formState.errors.themeColor]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="robots">Robots Meta</FieldLabel>
            <FieldContent>
              <Input
                id="robots"
                placeholder="index, follow"
                {...form.register("robots")}
              />
              <FieldError errors={[form.formState.errors.robots]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="sitemap">Sitemap URL</FieldLabel>
            <FieldContent>
              <Input
                id="sitemap"
                placeholder="/sitemap.xml"
                {...form.register("sitemap")}
              />
              <FieldError errors={[form.formState.errors.sitemap]} />
            </FieldContent>
          </Field>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
