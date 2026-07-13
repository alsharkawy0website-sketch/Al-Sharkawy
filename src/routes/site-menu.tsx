import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Footer } from "@/components/layout/Footer";
import { Home, Percent, Heart, ChevronLeft, X, Utensils } from "lucide-react";

export const Route = createFileRoute("/site-menu")({
  component: SiteMenuPage,
});

function SiteMenuPage() {
  const router = useRouter();

  const menuLinks = [
    { name: "الرئيسية", to: "/", icon: Home },
    { name: "قائمة الطعام", to: "/menu", icon: Utensils },
    { name: "العروض", to: "/offers", icon: Percent },
    { name: "المفضلة", to: "/favorites", icon: Heart },
  ];

  return (
    <main className="min-h-screen bg-alabaster flex flex-col">
      {/* Custom Header for Menu Page */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-alabaster/90 border-b border-black/5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="font-display text-lg font-bold">
            <span className="text-crimson">القائمة </span>
            <span className="text-amber-glow">الرئيسية</span>
          </div>
          <button
            onClick={() => router.history.back()}
            className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink/70 shadow-sm ring-1 ring-black/5 transition-all hover:text-crimson hover:shadow-md active:scale-95"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 py-12 sm:py-24 pt-28 px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <div className="grid gap-4 sm:gap-6">
          {menuLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="group flex items-center justify-between rounded-3xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-crimson/10"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-cream text-crimson transition-colors group-hover:bg-crimson group-hover:text-white">
                  <link.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <span className="font-display text-lg sm:text-xl font-bold text-ink transition-colors group-hover:text-crimson">
                  {link.name}
                </span>
              </div>
              <ChevronLeft className="h-5 w-5 text-ink/30 transition-transform group-hover:-translate-x-1 group-hover:text-crimson" />
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
