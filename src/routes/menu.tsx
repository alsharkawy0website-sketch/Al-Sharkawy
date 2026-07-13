import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Search, Star, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import heroGrill from "@/assets/hero-grill.jpg";
import { useMenuCategories, useMenuItems } from "@/hooks/useData";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import type { Product } from "@/types";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
});

function MenuHero({ query, onQueryChange }: { query: string; onQueryChange: (v: string) => void }) {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16 bg-charcoal">
      <div className="absolute inset-0 -z-10">
        <img src={heroGrill} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-alabaster sm:text-5xl md:text-6xl drop-shadow-xl">
          قائمة <span className="text-amber-glow">الطعام</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xs sm:text-base text-alabaster/80 leading-relaxed">
          اكتشف تشكيلتنا الواسعة من المشويات المصرية الأصيلة المحضرة بأجود أنواع اللحوم الطازجة
          والبهارات المميزة.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-full p-1.5 shadow-elevated bg-white/5 border border-white/10 glass-panel">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="ابحث عن طبقك المفضل..."
              aria-label="بحث"
              className="w-full bg-transparent py-2 pl-3 pr-10 text-sm text-alabaster placeholder:text-alabaster/70 focus:outline-none"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-alabaster/50" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuPage() {
  const { data: menuCategories, isLoading: isCatLoading, isError: isCatErr } = useMenuCategories();
  const { data: menuItems, isLoading: isItemsLoading, isError: isItemsErr } = useMenuItems();
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const [query, setQuery] = useState("");

  const categories = menuCategories ?? [];
  const items = menuItems ?? [];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = `${it.name ?? ""} ${it.description ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

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
    <main className="min-h-screen bg-alabaster">
      <Nav isDarkHero />
      <MenuHero query={query} onQueryChange={setQuery} />

      {(isCatLoading || isItemsLoading) && (
        <div className="py-32 text-center text-ink/60">جاري التحميل...</div>
      )}
      {(isCatErr || isItemsErr) && (
        <div className="py-32 text-center text-ink/60">تعذّر تحميل القائمة.</div>
      )}

      {!isCatLoading && !isItemsLoading && !isCatErr && !isItemsErr && (
        <>
          <div className="sticky top-16 sm:top-[72px] z-40 bg-alabaster/80 backdrop-blur-xl border-b border-black/5 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex overflow-x-auto hide-scrollbar py-3 gap-2">
                {categories.map((cat, i) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.slug}`}
                    className={`shrink-0 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      i === 0
                        ? "bg-crimson text-white shadow-md"
                        : "bg-white text-ink/70 hover:bg-cream hover:text-crimson"
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-alabaster pb-20 pt-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {categories.map((cat) => {
                const catItems = filteredItems.filter((it) => it.category_id === cat.id);
                if (catItems.length === 0) return null;

                return (
                  <section key={cat.id} id={`cat-${cat.slug}`} className="mb-12 scroll-mt-32">
                    <h2 className="mb-5 font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-3">
                      <span className="h-px flex-1 bg-gradient-to-l from-black/5 to-transparent" />
                      {cat.name}
                      <span className="h-px flex-1 bg-gradient-to-r from-black/5 to-transparent" />
                    </h2>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                      {catItems.map((item) => {
                        const size = item.product_sizes?.[0];
                        const displayPrice = size ? size.price : (item.base_price ?? 0);
                        const fav = isFavorite(item.id);
                        return (
                          <article
                            key={item.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                          >
                            <div className="pointer-events-none absolute inset-x-1.5 top-1.5 sm:inset-x-2 sm:top-2 z-10 flex items-start justify-between">
                              <div className="flex gap-1 flex-wrap">
                                {item.tag && (
                                  <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/95 py-0.5 px-2 sm:py-1 sm:px-2.5 shadow-sm">
                                    <Star className="h-3 w-3 fill-amber-glow text-amber-glow" />
                                    <span className="text-[9px] sm:text-[10px] font-semibold text-ink">
                                      {item.tag}
                                    </span>
                                  </div>
                                )}
                                {item.spicy && (
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
                                onClick={() => toggle(item.id)}
                                className="pointer-events-auto grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white/95 text-ink/60 shadow-sm transition-colors hover:text-crimson"
                              >
                                <Heart
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${fav ? "fill-crimson text-crimson animate-heart-pop" : ""}`}
                                />
                              </button>
                            </div>

                            <Link
                              to="/product/$id"
                              params={{ id: item.id }}
                              className="block aspect-square w-full shrink-0 overflow-hidden bg-cream"
                            >
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                            </Link>

                            <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                              <div className="flex-1">
                                <Link
                                  to="/product/$id"
                                  params={{ id: item.id }}
                                  className="hover:text-crimson transition-colors"
                                >
                                  <h3 className="font-display text-[12px] sm:text-base font-semibold text-ink mb-1 leading-snug">
                                    {item.name}
                                  </h3>
                                </Link>
                                <p className="text-[11px] sm:text-xs text-ink/60 line-clamp-2 leading-relaxed">
                                  {item.description}
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
                                  onClick={() => handleAdd(item)}
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
                  </section>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="py-16 text-center text-ink/60">لا توجد أطباق مطابقة لبحثك.</div>
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
