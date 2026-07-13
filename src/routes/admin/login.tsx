import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.navigate({ to: "/admin" });
    }
  };

  return (
    <div className="min-h-screen bg-alabaster flex flex-col justify-center py-12 sm:px-6 lg:px-8 dir-rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center text-crimson mb-4">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-ink">تسجيل الدخول للإدارة</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-3xl sm:px-10 ring-1 ring-black/5">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream rounded-xl py-3 px-4 text-ink placeholder-ink/40 border border-black/5 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:bg-white transition-all"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream rounded-xl py-3 px-4 text-ink placeholder-ink/40 border border-black/5 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:bg-white transition-all"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-elevated text-sm font-semibold text-white bg-crimson hover:bg-crimson-deep focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري التحميل..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
