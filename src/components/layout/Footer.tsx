import logoAsset from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <img
            src={logoAsset}
            alt="شعار الشرقاوي"
            className="h-9 w-9 rounded-full ring-2 ring-crimson/30"
          />
          <div className="font-display text-base font-black">
            <span className="text-crimson">الشرق</span>
            <span className="text-amber-deep">اوي</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} الشرقاوي · بيت المشويات المصرية الأصيلة
        </p>
      </div>
    </footer>
  );
}
