import { useState, useCallback } from "react";

const STORAGE_KEY = "hiddenPostIds";

function loadHiddenIds(): Set<number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as number[]);
    }
  } catch {
    // ignore parse errors
  }
  return new Set();
}

function saveHiddenIds(ids: Set<number>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useHiddenPosts() {
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(loadHiddenIds);

  const hidePost = useCallback((postId: number) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      saveHiddenIds(next);
      return next;
    });
  }, []);

  const unhidePost = useCallback((postId: number) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      saveHiddenIds(next);
      return next;
    });
  }, []);

  return { hiddenIds, hidePost, unhidePost };
}
