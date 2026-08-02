"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  websiteSettingsSchema,
  type WebsiteSettingsFormValues,
  defaultWebsiteSettings,
} from "@/lib/validations/settings";

const WEBSITE_SEO_KEY = "website_seo";

export async function getWebsiteSettings(): Promise<WebsiteSettingsFormValues> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: WEBSITE_SEO_KEY },
    });

    if (!setting) {
      return defaultWebsiteSettings;
    }

    return setting.value as unknown as WebsiteSettingsFormValues;
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return defaultWebsiteSettings;
  }
}

export async function updateWebsiteSettings(data: WebsiteSettingsFormValues) {
  try {
    // Validate data on the server
    const validatedData = websiteSettingsSchema.parse(data);

    await prisma.setting.upsert({
      where: { key: WEBSITE_SEO_KEY },
      update: {
        value: validatedData,
      },
      create: {
        key: WEBSITE_SEO_KEY,
        value: validatedData,
      },
    });

    // Revalidate paths that might use these settings (e.g. root layout or admin path)
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating website settings:", error);
    return {
      success: false,
      error: error.message || "Failed to update settings",
    };
  }
}
