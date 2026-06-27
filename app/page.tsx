"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Quote } from "@/types";
import { quotes } from "@/data/quotes";
import { getCollection } from "@/lib/collection";
import { getDiary } from "@/lib/diary";
import { canDrawToday, getTodayKey } from "@/lib/gacha";
import QuoteCard from "@/components/QuoteCard";

function quoteById(id: number): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [drawnToday, setDrawnToday] = useState(false);
  const [count, setCount] = useState(0);
  const [todayQuote, setTodayQuote] = useState<Quote | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    const today = getTodayKey();
    const drawn = !canDrawToday();
    setDrawnToday(drawn);

    const col = getCollection();
    setCount(col.length);

    // 今日の名言: 当日日記の紐付け → 最新取得名言の順で優先
    const diaryToday = getDiary().find((e) => e.date === today);
    if (diaryToday && diaryToday.quoteId >= 0) {
      setTodayQuote(quoteById(diaryToday.quoteId));
    } else if (col.length > 0) {
      setTodayQuote(quoteById(col[col.length - 1].id));
    }
  }, []);

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  const total = quotes.length;
  const rate = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <main className="animate-fadeIn space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-brown">聖書名言ガチャ</h1>
        <p className="mt-1 text-xs text-brown-light">
          今日の一言を、心の指針に。
        </p>
      </header>

      {/* 当日ステータス */}
      <div className="flex items-center justify-between rounded-xl border border-parchment-dark bg-parchment-light px-4 py-3 text-sm shadow-card">
        <span className="text-brown-light">今日のガチャ</span>
        <span
          className={`font-bold ${drawnToday ? "text-brown" : "text-gold-dark"}`}
        >
          {drawnToday ? "済" : "未"}
        </span>
      </div>

      {/* 未抽選: 強調CTA */}
      {!drawnToday && (
        <Link
          href="/gacha"
          className="block animate-cardReveal rounded-2xl bg-gold px-6 py-5 text-center font-bold text-parchment-light shadow-glow transition-colors hover:bg-gold-dark"
        >
          🎲 今日のガチャを引く
        </Link>
      )}

      {/* 今日の名言 */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-brown">今日の名言</h2>
        {todayQuote ? (
          <QuoteCard quote={todayQuote} />
        ) : (
          <p className="rounded-xl border border-parchment-dark bg-parchment-light p-4 text-center text-sm text-brown-light shadow-card">
            まだ名言がありません。ガチャを引いてみましょう。
          </p>
        )}
      </section>

      {/* 収集率 */}
      <section className="rounded-xl border border-parchment-dark bg-parchment-light px-4 py-3 shadow-card">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-brown-light">収集率</span>
          <span className="font-bold text-brown">
            {count} / {total}（{rate}%）
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-parchment-dark">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${rate}%` }}
          />
        </div>
      </section>

      {/* 導線 */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/collection"
          className="rounded-xl border border-parchment-dark bg-parchment-light py-4 text-center font-bold text-brown shadow-card transition-colors hover:bg-parchment-dark/40"
        >
          📖 図鑑
        </Link>
        <Link
          href="/diary"
          className="rounded-xl border border-parchment-dark bg-parchment-light py-4 text-center font-bold text-brown shadow-card transition-colors hover:bg-parchment-dark/40"
        >
          📝 日記
        </Link>
      </div>
    </main>
  );
}
