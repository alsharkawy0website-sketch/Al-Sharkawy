import { useRouter } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdminHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-black/5 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -mr-2 text-charcoal hover:bg-black/5 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-ink">{title}</h2>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 text-sm font-medium text-crimson hover:bg-crimson/5 rounded-full transition-colors"
      >
        <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
        <span className="hidden sm:inline">تسجيل الخروج</span>
      </button>
    </header>
  );
}
