import { useCallback, useSyncExternalStore } from "react";
import type { CartLine } from "@/types";

const STORAGE_KEY = "el-sharkawy:cart:v1";
const listeners = new Set<() => void>();
let cache: CartLine[] = readFromStorage();

function readFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(next: CartLine[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — ignore */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot(): CartLine[] {
  return cache;
}

function getServerSnapshot(): CartLine[] {
  return [];
}

// Cross-tab sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = readFromStorage();
    listeners.forEach((l) => l());
  });
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
    const qty = Math.max(1, line.quantity ?? 1);
    const next = [...cache];
    const idx = next.findIndex((it) => it.key === line.key);
    if (idx >= 0) {
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
    } else {
      next.push({ ...line, quantity: qty });
    }
    writeToStorage(next);
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    const next = cache
      .map((it) => (it.key === key ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
      .filter((it) => it.quantity > 0);
    writeToStorage(next);
  }, []);

  const removeItem = useCallback((key: string) => {
    writeToStorage(cache.filter((it) => it.key !== key));
  }, []);

  const clear = useCallback(() => writeToStorage([]), []);

  const count = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);

  return { items, count, subtotal, addItem, updateQuantity, removeItem, clear };
}
