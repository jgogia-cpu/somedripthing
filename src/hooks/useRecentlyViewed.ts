import { useCallback, useEffect, useState } from "react";

const KEY = "dripway:recently-viewed";
const MAX = 12;

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX))); } catch { /* ignore */ }
}

/** Subscribe to recently viewed list (re-reads on focus/storage events). */
export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return ids;
}

/** Push a product id to the front of the list. */
export function pushRecentlyViewed(id: string) {
  if (!id) return;
  const current = read();
  const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX);
  write(next);
}