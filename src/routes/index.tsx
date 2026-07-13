import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronLeft, Star, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import heroGrill from "@/assets/hero-grill.jpg";
import { useCategories, useFeaturedProducts } from "@/hooks/useData";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import type { Product } from "@/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative isolate overflow-hidden ember-gradient pt-20 pb-10">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroGrill}
          alt=""
          width={1600}
          height={1280}
          className="h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-l from-charcoal/95 via-charcoal/70 to-charcoal/30" />
        <div className="absolute inset-0 bg-linear-to-b from-charcoal/60 via-transparent to-charcoal" />
      </div>

      <div className="mx-auto flex min-h-[50svh] max-w-7xl flex-col items-center justify-center px-5 pt-20 pb-10 sm:px-8 text-center">
        <div className="max-w-2xl flex flex-col items-center">
          <h1 className="font-display text-3xl font-bold leading-[1.3] sm:text-5xl md:text-6xl">
            <span className="block text-crimson drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
              طعم مش هتقدر
            </span>
            <span className="mt-2 block text-alabaster">
              <span className="text-amber-glow drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                تقاومة!
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-xs leading-relaxed text-alabaster/90 sm:text-sm">
            كبدة بالردة، مخ بانيه، جمبري، وسمك فيليه بتتبيلة الشرقاوي الأصيلة — طعم مش هتقدر تقاومه!
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="glass-panel mt-10 flex w-full max-w-md items-center gap-2 rounded-full p-1.5 shadow-elevated bg-white/5 border border-white/10"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن طبقك المفضل..."
                aria-label="بحث"
                className="w-full bg-transparent py-2 pl-3 pr-10 text-sm text-alabaster placeholder:text-alabaster/70 focus:outline-none"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-alabaster/50" />
            </div>
            <Link
              to="/menu"
              className="shrink-0 rounded-full bg-crimson px-6 py-2 text-xs sm:px-8 sm:py-2.5 sm:text-sm font-semibold text-alabaster transition-all hover:bg-crimson-deep active:scale-95"
            >
              بحث
            </Link>
          </form>

          <div className="mt-8 flex justify-center">
            <Link
              to="/menu"
              className="group inline-flex items-center gap-1 border-b border-alabaster/30 pb-1 text-sm font-medium text-alabaster/80 transition-colors hover:border-amber-glow hover:text-amber-glow"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>تصفح كل الأطباق</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return <div className="py-20 text-center text-ink/60">جاري التحميل...</div>;
  }
  if (isError) {
    return <div className="py-20 text-center text-ink/60">تعذّر تحميل الفئات.</div>;
  }

  const safeCategories = categories ?? [];

  return (
    <section id="menu" className="relative z-20 bg-white pt-10 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="min-w-0 text-right">
            <div className="text-xs sm:text-sm font-semibold text-crimson mb-1">الفئات</div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-3xl">تسوق حسب الفئة</h2>
          </div>
          <Link
            to="/categories"
            className="shrink-0 text-xs sm:text-sm font-semibold text-crimson transition-opacity hover:opacity-70"
          >
            عرض الكل
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-6">
          {safeCategories.map((c) => (
            <Link
              key={c.id}
              to="/menu"
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden p-1.5 sm:p-2.5 bg-white">
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex-1 bg-cream px-2 py-2.5 sm:py-4 flex items-center justify-center text-center">
                <h3 className="font-display text-[11px] sm:text-sm font-semibold leading-tight text-ink">
                  {c.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const { data: featured, isLoading, isError } = useFeaturedProducts();
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();

  if (isLoading) {
    return <div className="py-20 text-center text-ink/60">جاري التحميل...</div>;
  }
  if (isError) {
    return <div className="py-20 text-center text-ink/60">تعذّر تحميل الأطباق.</div>;
  }

  const safeFeatured = featured ?? [];

  const handleAdd = (p: Product) => {
    const size = p.product_sizes?.[0];
    addItem({
      key: size ? `${p.id}:${size.id}` : p.id,
      productId: p.id,
      sizeId: size?.id ?? null,
      sizeName: size?.name ?? null,
      title: p.name,
      description: p.description,
      imageUrl: p.image_url,
      unitPrice: size ? size.price : (p.base_price ?? 0),
      quantity: 1,
    });
    toast.success("تمت الإضافة إلى السلة");
  };

  return (
    <section className="bg-alabaster py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 text-right">
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-amber-deep">
              <Star className="h-3 w-3 fill-amber-glow text-amber-glow" />
              <span>الأكثر طلباً</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
              أطباق مميزة
            </h2>
          </div>
          <Link
            to="/menu"
            className="shrink-0 text-xs sm:text-sm font-semibold text-crimson transition-opacity hover:opacity-70"
          >
            عرض الكل
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-4">
          {safeFeatured.map((p) => {
            const size = p.product_sizes?.[0];
            const displayPrice = size ? size.price : (p.base_price ?? 0);
            const fav = isFavorite(p.id);
            return (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="pointer-events-none absolute inset-x-1.5 top-1.5 sm:inset-x-2 sm:top-2 z-10 flex items-start justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {p.tag && (
                      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/95 py-0.5 px-2 sm:py-1 sm:px-2.5 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-glow text-amber-glow" />
                        <span className="text-[9px] sm:text-[10px] font-semibold text-ink">
                          {p.tag}
                        </span>
                      </div>
                    )}
                    {p.spicy && (
                      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-crimson/95 py-0.5 px-2 sm:py-1 sm:px-2.5 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-semibold text-white">
                          حار 🌶️
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="أضف للمفضلة"
                    aria-pressed={fav}
                    onClick={() => toggle(p.id)}
                    className="pointer-events-auto grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white/95 text-ink/60 shadow-sm transition-colors hover:text-crimson"
                  >
                    <Heart
                      className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors ${fav ? "fill-crimson text-crimson animate-heart-pop" : ""}`}
                    />
                  </button>
                </div>

                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="block aspect-square w-full shrink-0 overflow-hidden bg-cream"
                >
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                  <div className="flex-1">
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="hover:text-crimson transition-colors"
                    >
                      <h3 className="font-display text-[12px] sm:text-base font-semibold text-ink mb-1 leading-snug">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-ink/60 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <div className="text-right font-display font-bold text-crimson">
                      <span className="text-base sm:text-xl">{displayPrice}</span>
                      <span className="mr-1 text-[10px] sm:text-xs font-semibold text-crimson/70">
                        ج.م
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="أضف للسلة"
                      onClick={() => handleAdd(p)}
                      className="flex items-center gap-1.5 rounded-full bg-crimson px-2 py-1 sm:px-4 sm:py-2 text-alabaster shadow-md transition-all hover:bg-crimson-deep hover:shadow-elevated active:scale-95"
                    >
                      <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">
                        أضف
                      </span>
                      <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-alabaster">
      <Nav isDarkHero />
      <Hero />
      <CategoriesSection />
      <FeaturedSection />
      <Footer />
    </main>
  );
}
