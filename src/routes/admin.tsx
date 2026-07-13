import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") {
      return;
    }
    
    // Skip auth check on server side because localStorage is not available in SSR
    if (typeof window === "undefined") {
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = location.pathname === "/admin/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  // Determine title from path
  let title = "لوحة القيادة";
  if (location.pathname.includes("/categories")) title = "الفئات";
  else if (location.pathname.includes("/products")) title = "المنتجات";
  else if (location.pathname.includes("/offers")) title = "العروض";
  else if (location.pathname.includes("/orders")) title = "الطلبات";
  else if (location.pathname.includes("/settings")) title = "الإعدادات";

  return (
    <div className="flex min-h-screen bg-alabaster dir-rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
