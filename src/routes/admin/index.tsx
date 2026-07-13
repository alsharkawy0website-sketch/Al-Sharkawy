import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Tags, Utensils, Percent } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: categories = [] } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: api.getCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: api.getAdminProducts,
  });

  const { data: offers = [] } = useQuery({
    queryKey: ["adminOffers"],
    queryFn: api.getAdminOffers,
  });

  const stats = [
    { name: "إجمالي الفئات", value: categories.length, icon: <Tags className="h-8 w-8 text-blue-500" />, path: "/admin/categories" },
    { name: "إجمالي المنتجات", value: products.length, icon: <Utensils className="h-8 w-8 text-green-500" />, path: "/admin/products" },
    { name: "إجمالي العروض", value: offers.length, icon: <Percent className="h-8 w-8 text-orange-500" />, path: "/admin/offers" },
  ];

  return (
    <div className="space-y-6 min-h-[400px]">
      <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-sm ring-1 ring-black/5">
        <h2 className="text-xl lg:text-2xl font-semibold text-ink mb-6">مرحباً بك في لوحة التحكم</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Link key={i} to={stat.path} className="bg-gray-50/50 p-6 rounded-2xl shadow-sm ring-1 ring-black/5 flex items-center justify-between transition-all hover:shadow-md hover:bg-gray-50">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-ink">{stat.value}</p>
              </div>
              <div className="p-4 bg-white shadow-sm ring-1 ring-black/5 rounded-xl">
                {stat.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
