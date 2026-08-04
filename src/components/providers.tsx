"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthProvider as BetterAuthProvider } from "@/components/auth/auth-provider";
import { authClient } from "@/lib/auth-client";
import { Toaster } from "@/components/ui/sonner";
import { Link, useRouter } from "@/i18n/routing";
import { useTheme } from "next-themes";
import { themePlugin } from "@/lib/auth/theme-plugin";
import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin";
import { SearchProvider } from "@/context/search-provider";
import {
  ThemeColorProvider,
  type ColorKey,
} from "@/context/theme-color-provider";
import {
  LayoutProvider,
  type Collapsible,
  type Variant,
} from "@/context/layout-provider";
import { DirectionProvider, type DirType } from "@/context/direction-provider";

import { useLocale } from "next-intl";
import { viLocalization } from "@/lib/auth-localization/vi";

import { NuqsAdapter } from "nuqs/adapters/next/app";

export type ServerCookieProps = {
  initialDir?: DirType;
  initialColorKey?: ColorKey;
  initialCollapsible?: Collapsible;
  initialVariant?: Variant;
};

export function Providers({
  children,
  initialDir,
  initialColorKey,
  initialCollapsible,
  initialVariant,
}: { children: React.ReactNode } & ServerCookieProps) {
  const router = useRouter();
  const locale = useLocale();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BetterAuthProvider
            authClient={authClient}
            localization={locale === "vi" ? viLocalization : undefined}
            basePaths={{ settings: "/dashboard/settings" }}
            Link={Link}
            navigate={({ to, replace }) =>
              replace ? router.replace(to) : router.push(to)
            }
            plugins={[
              themePlugin({
                useTheme,
              }),
              multiSessionPlugin(),
            ]}
            avatar={{
              upload: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                const res = await fetch("/api/upload/avatar", {
                  method: "POST",
                  body: formData,
                });
                if (!res.ok) throw new Error("Failed to upload avatar");
                const data = await res.json();
                return data.url;
              },
              delete: async (url) => {
                await fetch("/api/upload/avatar", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url }),
                });
              },
            }}
          >
            <DirectionProvider initialDir={initialDir}>
              <ThemeColorProvider initialColorKey={initialColorKey}>
                <LayoutProvider
                  initialCollapsible={initialCollapsible}
                  initialVariant={initialVariant}
                >
                  <SearchProvider>
                    {children}
                    <Toaster />
                  </SearchProvider>
                </LayoutProvider>
              </ThemeColorProvider>
            </DirectionProvider>
          </BetterAuthProvider>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
