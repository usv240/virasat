"use client";

/**
 * localStorage as an external store, so React reads it without effects and
 * hydration stays clean (the server snapshot is the fallback).
 */
import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}

export function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeLocal(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode: ignore */
  }
  emit();
}

/** A string value in localStorage with a fallback for the server render. */
export function useLocalString(key: string, fallback: string): [string, (v: string) => void] {
  const value = useSyncExternalStore(subscribe, () => readLocal(key) ?? fallback, () => fallback);
  const set = useCallback((v: string) => writeLocal(key, v), [key]);
  return [value, set];
}

/** True once the client has hydrated (false during the server render). */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/** A JSON object in localStorage with a stable snapshot reference. */
export function createJsonStore<T extends object>(key: string, empty: T) {
  let cacheRaw: string | null | undefined;
  let cacheVal: T = empty;
  const getSnapshot = (): T => {
    const raw = readLocal(key);
    if (raw !== cacheRaw) {
      cacheRaw = raw;
      try {
        cacheVal = raw ? { ...empty, ...(JSON.parse(raw) as T) } : empty;
      } catch {
        cacheVal = empty;
      }
    }
    return cacheVal;
  };
  return {
    use: () => useSyncExternalStore(subscribe, getSnapshot, () => empty),
    update: (fn: (s: T) => T) => writeLocal(key, JSON.stringify(fn(getSnapshot()))),
    reset: () => writeLocal(key, null),
  };
}
