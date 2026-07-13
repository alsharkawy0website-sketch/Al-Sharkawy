import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Tags, Utensils, Percent, ShoppingBag, Settings, X } from "lucide-react";

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  const navItems = [
    { name: "لوحة القيادة", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "الفئات", path: "/admin/categories", icon: <Tags className="h-5 w-5" /> },
    { name: "المنتجات", path: "/admin/products", icon: <Utensils className="h-5 w-5" /> },
    { name: "العروض", path: "/admin/offers", icon: <Percent className="h-5 w-5" /> },
    { name: "الطلبات", path: "/admin/orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "الإعدادات", path: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-charcoal text-alabaster min-h-screen flex flex-col shadow-xl">
      <div className="p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 lg:hidden text-alabaster/70 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-display font-bold text-amber-glow tracking-wide text-center mt-2 lg:mt-0">
          الشرقاوي
        </h1>
        <div className="text-center text-xs mt-1 text-alabaster/60">لوحة التحكم</div>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-crimson text-white shadow-elevated"
                      : "text-alabaster/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
