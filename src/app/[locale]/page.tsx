import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans dark:bg-black">
      {/* Background Gradients */}
      <div className="bg-primary/20 pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/20 blur-[120px]" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 text-center sm:px-16 lg:px-24">
        {/* Technology Badges */}
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-8 flex flex-wrap justify-center gap-2 duration-1000">
          <Badge
            variant="secondary"
            className="bg-black/5 px-3 py-1 text-sm backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            Next.js 15
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/5 px-3 py-1 text-sm backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            React 19
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/5 px-3 py-1 text-sm backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            Prisma
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/5 px-3 py-1 text-sm backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            Better Auth
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/5 px-3 py-1 text-sm backdrop-blur-md transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            TailwindCSS 4
          </Badge>
        </div>

        {/* Hero Section */}
        <h1 className="animate-in fade-in slide-in-from-bottom-6 mb-6 max-w-4xl bg-gradient-to-br from-zinc-900 to-zinc-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent delay-150 duration-1000 sm:text-6xl lg:text-7xl dark:from-white dark:to-zinc-500">
          {t("title")}
        </h1>

        <p className="animate-in fade-in slide-in-from-bottom-8 mb-10 max-w-2xl text-lg leading-relaxed text-zinc-600 delay-300 duration-1000 sm:text-xl dark:text-zinc-400">
          {t("subtitle")}
        </p>

        {/* Call to Actions */}
        <div className="animate-in fade-in slide-in-from-bottom-10 mb-24 flex flex-col gap-4 delay-500 duration-1000 sm:flex-row">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="shadow-primary/20 h-12 w-full px-8 text-base font-medium shadow-xl transition-transform hover:scale-105 sm:w-auto"
            >
              {t("getStarted")}
            </Button>
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full px-8 text-base font-medium transition-transform hover:scale-105 hover:bg-zinc-100 sm:w-auto dark:hover:bg-zinc-800"
            >
              {t("documentation")}
            </Button>
          </a>
        </div>

        {/* Features Bento Grid */}
        <div className="animate-in fade-in slide-in-from-bottom-12 grid w-full max-w-5xl grid-cols-1 gap-6 delay-700 duration-1000 md:grid-cols-2">
          <Card className="hover:border-primary/50 border border-black/5 bg-white/50 shadow-lg shadow-black/5 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  🛡️
                </span>
                {t("features.auth.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-left text-base">
                {t("features.auth.description")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 border border-black/5 bg-white/50 shadow-lg shadow-black/5 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="rounded-md bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  🌐
                </span>
                {t("features.i18n.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-left text-base">
                {t("features.i18n.description")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 border border-black/5 bg-white/50 shadow-lg shadow-black/5 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="rounded-md bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  🗄️
                </span>
                {t("features.database.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-left text-base">
                {t("features.database.description")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 border border-black/5 bg-white/50 shadow-lg shadow-black/5 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="rounded-md bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  ✅
                </span>
                {t("features.testing.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-left text-base">
                {t("features.testing.description")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
