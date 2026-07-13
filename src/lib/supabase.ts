import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [
      !supabaseUrl && "VITE_SUPABASE_URL",
      !supabaseAnonKey && "VITE_SUPABASE_ANON_KEY",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(
      `Supabase is not configured. Missing environment variable(s): ${missing}. ` +
        `Set them in .env (see .env.example).`,
    );
  }
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}

// Proxy so callers keep using `supabase.from(...)` — the client is created on first use.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const value = (getClient() as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as Function).bind(getClient()) : value;
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
