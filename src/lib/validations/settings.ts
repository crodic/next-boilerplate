import { z } from "zod";

export const websiteSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  keywords: z.string().optional(),

  // Images
  logoLight: z.string().optional(),
  logoDark: z.string().optional(),
  faviconLight: z.string().optional(),
  faviconDark: z.string().optional(),
  ogImage: z.string().optional(),
  twitterImage: z.string().optional(),

  // Advanced SEO
  author: z.string().optional(),
  themeColor: z.string().optional(),
  robots: z.string().optional(),
  sitemap: z.string().optional(),
});

export type WebsiteSettingsFormValues = z.infer<typeof websiteSettingsSchema>;

// Default values for the form
export const defaultWebsiteSettings: WebsiteSettingsFormValues = {
  title: "",
  description: "",
  keywords: "",
  logoLight: "",
  logoDark: "",
  faviconLight: "",
  faviconDark: "",
  ogImage: "",
  twitterImage: "",
  author: "",
  themeColor: "",
  robots: "index, follow",
  sitemap: "/sitemap.xml",
};
