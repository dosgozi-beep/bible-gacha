"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Quote } from "@/types";
import { quotes } from "@/data/quotes";
import {
  getCollection,
  sortByObtainedOrder,
  sortByTimelineOrder,
} from "@/lib/collection";
import QuoteCard from "@/components/QuoteCard";

type SortMode = "obtained" | "timeline";

export default function CollectionPage() {
  const [mounted, setMounted] = useState(false);
  const [sort, setSort] = useState<SortMode>("obtained");
  const [count, setCount] = useState(0);
  const [list, setList] = useState<Quote[]>([]);

  useEffect(() => {
    setMounted(true);
    const entries = getCollection();
    setCount(entries.length);
    setList(sortByObtainedOrder(entries));
  }, []);

  function switchSort(mode: SortMode) {
    setSort(mode);
    const entries = getCollection();
    setList(
      mode === "obtained"
        ? sortByObtainedOrder(entries)
        : sortByTimelineOrder(entries)
    );
  }

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  const total = quotes.length;
  const rate = total > 0 ? Math.round((count / total) * 100) : 0;

  // 空状態
  if (count === 0) {
    return (
      <main className="animate-fadeIn flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-xl font-bold text-brown">図鑑</h1>
        <p className="text-sm text-brown-light">
          まだ名言を獲得していません。
        </p>
        <Link
          href="/gacha"
          className="rounded-full bg-gold px-6 py-2.5 font-bold text-parchment-light shadow-card transition-colors hover:bg-gold-dark"
        >
          ガチャへ行く
        </Link>
      </main>
    );
  }

  return (
    <main className="animate-fadeIn space-y-5">
      <header className="text-center">
        <h1 className="text-xl font-bold text-brown">図鑑</h1>
        <p className="mt-1 text-sm text-brown-light">
          収集率 {count} / {total}（{rate}%）
        </p>
        {/* 進捗バー */}
        <div className="mx-auto mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-parchment-dark">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${rate}%` }}
          />
        </div>
      </header>

      {/* 並び替えトグル */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => switchSort("obtained")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            sort === "obtained"
              ? "bg-brown text-parchment-light"
              : "bg-parchment-dark text-brown-light"
          }`}
        >
          取得順
        </button>
        <button
          onClick={() => switchSort("timeline")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            sort === "timeline"
              ? "bg-brown text-parchment-light"
              : "bg-parchment-dark text-brown-light"
          }`}
        >
          歴史順
        </button>
      </div>

      {/* 一覧 */}
      <div className="space-y-4">
        {list.map((q) => (
          <QuoteCard key={q.id} quote={q} />
        ))}
      </div>
    </main>
  );
}
