"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthProvider as BetterAuthProvider } from "@/components/auth/auth-provider";
import { authClient } from "@/lib/auth-client";
import { Toaster } from "@/components/ui/sonner";
import { Link, useRouter } from "@/i18n/routing";
import { useTheme } from "next-themes";
import { themePlugin } from "@/lib/auth/theme-plugin";

import { useLocale } from "next-intl";
import { viLocalization } from "@/lib/auth-localization/vi";

export function Providers({ children }: { children: React.ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <BetterAuthProvider
            authClient={authClient}
            localization={locale === "vi" ? viLocalization : undefined}
            Link={Link}
            navigate={({ to, replace }) =>
              replace ? router.replace(to) : router.push(to)
            }
            plugins={[
              themePlugin({
                useTheme,
              }),
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
            {children}
            <Toaster />
          </BetterAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
