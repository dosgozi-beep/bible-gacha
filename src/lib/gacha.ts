import type { Quote, Rarity } from "@/types";
import { quotes } from "@/data/quotes";
import { getLastDraw, setLastDraw, getCollection } from "@/lib/storage";

// 図鑑追加は collection.ts を正本とし再エクスポート
export { addToCollection } from "@/lib/collection";

// rarity抽選重み（%）
const RARITY_WEIGHT: Record<Rarity, number> = {
  SSR: 5,
  SR: 15,
  R: 30,
  N: 50,
};

// "YYYY-MM-DD"（ローカル日付）
export function getTodayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 今日まだ引いていなければ true
export function canDrawToday(): boolean {
  return getLastDraw() !== getTodayKey();
}

// 取得済みidの集合
function ownedIds(): Set<number> {
  return new Set(getCollection().map((e) => e.id));
}

// rarity重みに従い1件を抽選。候補が空なら null。
function pickWeighted(pool: Quote[]): Quote | null {
  if (pool.length === 0) return null;
  const weights = pool.map((q) => RARITY_WEIGHT[q.rarity] ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r < 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/**
 * rarity重み付きでQuoteを1件返す。
 * excludeOwned=true で未取得を優先（未取得が尽きたら全件から抽選）。
 */
export function drawQuote(excludeOwned = false): Quote {
  let pool: Quote[] = quotes;
  if (excludeOwned) {
    const owned = ownedIds();
    const unowned = quotes.filter((q) => !owned.has(q.id));
    if (unowned.length > 0) pool = unowned;
  }
  // pickWeighted は pool 非空なら必ず返るが、保険で全件フォールバック
  return pickWeighted(pool) ?? pickWeighted(quotes)!;
}

// 今日引いた記録を残す
export function markDrawn(date: string = getTodayKey()): void {
  setLastDraw(date);
}
