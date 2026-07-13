import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Heart } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/store/cart";

export function Nav({ isDarkHero = false }: { isDarkHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showLightNav = !isDarkHero || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        showLightNav
          ? "backdrop-blur-xl bg-alabaster/90 border-b border-black/5 shadow-sm"
          : "backdrop-blur-md bg-charcoal/40"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white p-0.5 shadow-lg sm:h-11 sm:w-11">
            <img
              src={logoAsset}
              alt="شعار الشرقاوي"
              width={44}
              height={44}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="text-right leading-none">
            <div className="font-display text-base font-bold sm:text-xl">
              <span className="text-crimson">الشرق</span>
              <span className="text-amber-glow">اوي</span>
            </div>
            <div
              className={`mt-1 font-latin text-[9px] uppercase tracking-[0.28em] transition-colors ${showLightNav ? "text-ink/50" : "text-alabaster/60"}`}
            >
              El-Sharkawy
            </div>
          </div>
        </Link>

        <nav className="flex shrink-0 items-center gap-1">
          <IconLink label="المفضلة" to="/favorites" showLightNav={showLightNav}>
            <Heart className="h-5 w-5" />
          </IconLink>
          <IconLink label="طلباتي" to="/cart" showLightNav={showLightNav} badge={count}>
            <ShoppingBag className="h-5 w-5" />
          </IconLink>
          <IconLink label="القائمة" to="/site-menu" showLightNav={showLightNav}>
            <Menu className="h-5 w-5" />
          </IconLink>
        </nav>
      </div>
    </header>
  );
}

function IconLink({
  children,
  label,
  to,
  showLightNav,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  to: string;
  showLightNav?: boolean;
  badge?: number;
}) {
  const className = `relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg transition-colors active:scale-95 ${
    showLightNav ? "text-ink/70 hover:text-crimson" : "text-alabaster/85 hover:text-amber-glow"
  }`;
  return (
    <Link to={to} aria-label={label} className={className}>
      {children}
      {badge != null && badge > 0 && (
        <span
          aria-label={`${badge} في السلة`}
          className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-crimson text-white text-[10px] font-bold grid place-items-center leading-none shadow"
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
