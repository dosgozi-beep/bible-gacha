import type { CollectionEntry, DiaryEntry } from "@/types";

const KEYS = {
  lastDraw: "bg_lastDraw",
  collection: "bg_collection",
  diary: "bg_diary",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readRaw(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 容量超過などは無視 */
  }
}

function readJSON<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    writeRaw(key, JSON.stringify(value));
  } catch {
    /* シリアライズ失敗は無視 */
  }
}

// --- bg_lastDraw: 最終ガチャ日 "YYYY-MM-DD" ---
export function getLastDraw(): string | null {
  return readRaw(KEYS.lastDraw);
}

export function setLastDraw(date: string): void {
  writeRaw(KEYS.lastDraw, date);
}

// --- bg_collection: CollectionEntry[] ---
export function getCollection(): CollectionEntry[] {
  return readJSON<CollectionEntry[]>(KEYS.collection, []);
}

export function setCollection(entries: CollectionEntry[]): void {
  writeJSON(KEYS.collection, entries);
}

// --- bg_diary: DiaryEntry[] ---
export function getDiary(): DiaryEntry[] {
  return readJSON<DiaryEntry[]>(KEYS.diary, []);
}

export function setDiary(entries: DiaryEntry[]): void {
  writeJSON(KEYS.diary, entries);
}

// --- 開発用リセット ---
export function clearAll(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEYS.lastDraw);
    window.localStorage.removeItem(KEYS.collection);
    window.localStorage.removeItem(KEYS.diary);
  } catch {
    /* 無視 */
  }
}

export { KEYS as STORAGE_KEYS };
