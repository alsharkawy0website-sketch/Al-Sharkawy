import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useMenuItems } from "@/hooks/useData";
import { useFavorites } from "@/store/favorites";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { data: menuItems, isLoading, isError } = useMenuItems();
  const { ids, toggle } = useFavorites();
  const { addItem } = useCart();

  const favorites = useMemo<Product[]>(() => {
    const set = new Set(ids);
    return (menuItems ?? []).filter((p) => set.has(p.id));
  }, [menuItems, ids]);

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
    <main className="min-h-screen bg-alabaster flex flex-col">
      <Nav />

      <div className="flex-1 py-8 sm:py-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-ink sm:text-5xl md:text-6xl mb-4">
              المنتجات <span className="text-crimson">المفضلة</span>
            </h1>
            <p className="text-ink/70 max-w-2xl mx-auto text-sm sm:text-base">
              كل لحظاتك الشهية التي احتفظت بها في مكان واحد
            </p>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-ink/60">جاري التحميل...</div>
          ) : isError ? (
            <div className="py-20 text-center text-ink/60">تعذّر تحميل المفضلة.</div>
          ) : favorites.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-4">
              {favorites.map((p) => {
                const size = p.product_sizes?.[0];
                const displayPrice = size ? size.price : (p.base_price ?? 0);
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
                        aria-label="إزالة من المفضلة"
                        onClick={() => toggle(p.id)}
                        className="pointer-events-auto grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white/95 text-ink/60 shadow-sm transition-colors hover:text-crimson"
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-crimson text-crimson animate-heart-pop" />
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="h-24 w-24 rounded-full bg-crimson/10 flex items-center justify-center mb-6">
                <Heart className="h-10 w-10 text-crimson" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">
                لا توجد منتجات مفضلة
              </h2>
              <p className="text-ink/60 mb-8 max-w-sm">
                لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. تصفح المنيو واكتشف أطباقك المفضلة!
              </p>
              <Link
                to="/menu"
                className="inline-flex h-12 items-center justify-center rounded-full bg-crimson px-8 font-semibold text-white transition-all hover:bg-crimson/90 hover:shadow-lg hover:shadow-crimson/20"
              >
                تصفح المنيو
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
