import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "el-sharkawy:favorites:v1";
const listeners = new Set<() => void>();
let cache: string[] = readFromStorage();

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeToStorage(next: string[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const getSnapshot = () => cache;
const getServerSnapshot = () => [] as string[];

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = readFromStorage();
    listeners.forEach((l) => l());
  });
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback((id: string) => cache.includes(id), []);

  const toggle = useCallback((id: string) => {
    const set = new Set(cache);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    writeToStorage(Array.from(set));
  }, []);

  const remove = useCallback((id: string) => {
    writeToStorage(cache.filter((x) => x !== id));
  }, []);

  return { ids, isFavorite, toggle, remove };
}
