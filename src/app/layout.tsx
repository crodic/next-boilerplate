import { ThemeProvider } from "@/components/layout/theme-provider";
import { getLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    // Fallback if getLocale fails
  }

  const cookieStore = await cookies();
  const themeColor = cookieStore.get("theme-color")?.value;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme={
        themeColor && themeColor !== "neutral" ? themeColor : undefined
      }
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
