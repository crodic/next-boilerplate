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

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
            Link={Link}
            navigate={({ to, replace }) =>
              replace ? router.replace(to) : router.push(to)
            }
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
