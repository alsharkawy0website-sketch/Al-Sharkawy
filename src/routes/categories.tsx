import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { useCategories } from "@/hooks/useData";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const list = categories ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => (c.name ?? "").toLowerCase().includes(q));
  }, [categories, searchQuery]);

  return (
    <main className="min-h-screen bg-alabaster flex flex-col">
      <Nav />

      <div className="flex-1 py-8 sm:py-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-ink sm:text-5xl md:text-6xl mb-4">
              كل <span className="text-crimson">الفئات</span>
            </h1>
            <p className="text-ink/70 max-w-2xl mx-auto text-sm sm:text-base">
              تصفح جميع فئات الطعام لدينا واختر ما يناسب ذوقك
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <div className="relative group">
              <input
                type="text"
                placeholder="ابحث في الفئات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="بحث في الفئات"
                className="w-full bg-white rounded-2xl py-3.5 pr-12 pl-4 text-sm sm:text-base text-ink placeholder-ink/40 shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-crimson/20 transition-all duration-300"
                dir="rtl"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/40 group-focus-within:text-crimson transition-colors" />
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-ink/60">جاري التحميل...</div>
          ) : isError ? (
            <div className="py-16 text-center text-ink/60">تعذّر تحميل الفئات.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((c) => (
                  <Link
                    key={c.id}
                    to="/menu"
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-crimson/10"
                  >
                    <div className="aspect-square w-full overflow-hidden p-2 sm:p-3 bg-white">
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.name}
                          loading="lazy"
                          className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="px-3 pb-4 pt-1 sm:px-4 sm:pb-5 text-center">
                      <h3 className="font-display text-sm font-bold text-ink sm:text-lg transition-colors group-hover:text-crimson">
                        {c.name}
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-ink/60">
                  لم يتم العثور على فئات مطابقة لبحثك.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
