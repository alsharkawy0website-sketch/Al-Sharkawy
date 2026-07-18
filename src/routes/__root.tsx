import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

/** Google Fonts stylesheet — `display=swap` avoids invisible text (FOIT) while fonts load. */
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=Cairo:wght@400;500;600;700;800&display=swap";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة اللي بتدور عليها مش موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حدث خطأ أثناء التحميل
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول تحديث الصفحة أو الرجوع للرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            حاول مرة أخرى
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "الشرقاوي | كبدة ومخ ومأكولات بحرية" },
      {
        name: "description",
        content:
          "مطعم الشرقاوي - أشهى أطباق الكبدة بالردة، المخ بانيه، والمأكولات البحرية بالتتبيلة الأصيلة.",
      },
      { name: "author", content: "El-Sharkawy" },
      { property: "og:title", content: "الشرقاوي | كبدة ومخ ومأكولات بحرية" },
      {
        property: "og:description",
        content: "مطعم الشرقاوي - أشهى أطباق الكبدة بالردة، المخ بانيه، والمأكولات البحرية بالتتبيلة الأصيلة.",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "الشرقاوي | كبدة ومخ ومأكولات بحرية" },
      {
        name: "twitter:description",
        content: "مطعم الشرقاوي - أشهى أطباق الكبدة بالردة، المخ بانيه، والمأكولات البحرية بالتتبيلة الأصيلة.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preload font CSS early; apply non-blocking with display=swap in RootShell.
      { rel: "preload", as: "style", href: GOOGLE_FONTS_HREF },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
        {/* media=print = non-blocking; script flips to all when ready. URL includes display=swap. */}
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} media="print" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=${JSON.stringify(GOOGLE_FONTS_HREF)};document.querySelectorAll('link[rel="stylesheet"][href="'+h+'"]').forEach(function(l){function a(){l.media="all"}l.addEventListener("load",a);if(l.sheet)a()});})();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
