import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import heroGrill from "@/assets/hero-grill.jpg";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
function toArabicDigits(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\d/g, (d) => arabicDigits[Number(d)]);
}

function CartHero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 pb-12 bg-charcoal">
      <div className="absolute inset-0 -z-10">
        <img src={heroGrill} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 backdrop-blur-md mb-6 ring-1 ring-white/20">
          <ShoppingBag className="h-8 w-8 text-amber-glow" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-alabaster sm:text-4xl drop-shadow-xl">
          سلة <span className="text-amber-glow">المشتريات</span>
        </h1>
      </div>
    </section>
  );
}

const DELIVERY_FEE = 35;

function CartContent() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 flex flex-col items-center text-center">
        <div className="h-32 w-32 rounded-full bg-cream grid place-items-center mb-6">
          <ShoppingBag className="h-12 w-12 text-ink/30" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">سلتك فارغة تماماً!</h2>
        <p className="text-sm text-ink/60 max-w-sm mb-8">
          يبدو أنك لم تقم بإضافة أي أطباق شهية إلى سلتك بعد. تصفح المنيو لاكتشاف ما لدينا.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-full bg-crimson px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-crimson-deep shadow-md hover:shadow-elevated active:scale-95"
        >
          تصفح المنيو
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-2">
            <h2 className="font-display text-xl font-semibold text-ink">مراجعة الطلبات</h2>
            <span className="text-sm font-semibold text-ink/60">
              {toArabicDigits(items.length)} أطباق
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <article
                key={item.key}
                className="group flex flex-row gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {item.title}
                        {item.sizeName && (
                          <span className="mr-2 text-xs font-normal text-ink/50">
                            ({item.sizeName})
                          </span>
                        )}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-ink/60 line-clamp-1 mt-1">{item.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label="حذف العنصر"
                      className="p-2 text-ink/40 transition-colors hover:text-crimson hover:bg-crimson/5 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-between mt-auto pt-2">
                    <div className="text-right font-display font-semibold text-crimson">
                      <span className="text-lg">{toArabicDigits(item.unitPrice)}</span>
                      <span className="mr-1 text-[10px] font-semibold text-crimson/70">ج.م</span>
                    </div>

                    <div className="flex items-center gap-3 bg-alabaster rounded-full px-1 py-1 ring-1 ring-black/5">
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="إنقاص"
                        className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink shadow-sm transition-colors hover:bg-cream active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-semibold text-ink">
                        {toArabicDigits(item.quantity)}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        aria-label="زيادة"
                        className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink shadow-sm transition-colors hover:bg-cream active:scale-95"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5">
            <h2 className="font-display text-lg font-semibold text-ink mb-6">ملخص الطلب</h2>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between items-center text-ink/80">
                <span>المجموع الفرعي</span>
                <div className="font-display font-semibold text-ink">
                  {toArabicDigits(subtotal)} <span className="text-[10px] text-ink/70">ج.م</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-ink/80">
                <span>رسوم التوصيل</span>
                <div className="font-display font-semibold text-ink">
                  {toArabicDigits(DELIVERY_FEE)}{" "}
                  <span className="text-[10px] text-ink/70">ج.م</span>
                </div>
              </div>
            </div>

            <hr className="my-6 border-black/5" />

            <div className="flex justify-between items-end mb-8">
              <span className="text-base font-semibold text-ink">الإجمالي</span>
              <div className="text-right font-display font-semibold text-crimson">
                <span className="text-3xl">{toArabicDigits(total)}</span>
                <span className="mr-1 text-sm font-semibold text-crimson/70">ج.م</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-crimson py-3.5 text-sm font-semibold text-white transition-all hover:bg-crimson-deep shadow-md hover:shadow-elevated active:scale-95 flex items-center justify-center gap-2"
            >
              إتمام الطلب
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-center text-[11px] text-ink/50">
              الأسعار شاملة ضريبة القيمة المضافة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartPage() {
  return (
    <main className="min-h-screen bg-alabaster">
      <Nav isDarkHero />
      <CartHero />
      <CartContent />
      <Footer />
    </main>
  );
}
