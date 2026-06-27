import type { CollectionEntry, Quote } from "@/types";
import { quotes } from "@/data/quotes";
import {
  getCollection as readCollection,
  setCollection,
} from "@/lib/storage";

// 図鑑エントリ取得（保存順 = 取得順）
export function getCollection(): CollectionEntry[] {
  return readCollection();
}

// 取得済みか判定
export function hasCollected(id: number): boolean {
  return getCollection().some((e) => e.id === id);
}

// 図鑑へ追加（重複idは無視、取得順を保持）
export function addToCollection(id: number): CollectionEntry[] {
  const current = getCollection();
  if (current.some((e) => e.id === id)) return current;
  const updated: CollectionEntry[] = [
    ...current,
    { id, acquiredAt: new Date().toISOString() },
  ];
  setCollection(updated);
  return updated;
}

// entry.id から Quote を引く（見つからなければ undefined）
function toQuote(id: number): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

// 取得済みエントリを Quote 配列へ変換（存在しないidは除外）
function entriesToQuotes(entries: CollectionEntry[]): Quote[] {
  return entries
    .map((e) => toQuote(e.id))
    .filter((q): q is Quote => q !== undefined);
}

// ① 取得順（acquiredAt 昇順）
export function sortByObtainedOrder(
  entries: CollectionEntry[] = getCollection()
): Quote[] {
  const sorted = [...entries].sort(
    (a, b) => a.acquiredAt.localeCompare(b.acquiredAt)
  );
  return entriesToQuotes(sorted);
}

// ② 歴史順（timelineOrder 昇順、同値は id 昇順）
export function sortByTimelineOrder(
  entries: CollectionEntry[] = getCollection()
): Quote[] {
  const list = entriesToQuotes(entries);
  return list.sort(
    (a, b) => a.timelineOrder - b.timelineOrder || a.id - b.id
  );
}
