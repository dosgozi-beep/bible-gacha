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
  const [playPV, setPlayPV] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = getTodayKey();
    setDrawnToday(!canDrawToday());

    const col = getCollection();
    setCount(col.length);

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
      {/* ヒーロー：RE:BIBLE キービジュアル（画面端まで広げ、背景になじませる） */}
      <section className="-mx-5 -mt-8 sm:-mt-10">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hero.png"
            alt="Re:Bible"
            className="w-full object-cover"
          />
          {/* 四辺を羊皮紙へなじませるグラデーション */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-parchment to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-parchment" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-parchment to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-parchment to-transparent" />
        </div>
        <p className="-mt-2 px-5 text-center text-xs tracking-wide text-brown-light">
          1日1枚、聖書の名言を集める。今日の一言を、心の指針に。
        </p>
      </section>

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
          className="btn-ornate animate-cardReveal block w-full px-6 py-5 text-center text-lg"
        >
          🎲 今日のガチャを回す
        </Link>
      )}

      {/* 今日の名言 */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold text-brown">今日の名言</h2>
        {todayQuote ? (
          <QuoteCard quote={todayQuote} />
        ) : (
          <p className="rounded-xl border border-parchment-dark bg-parchment-light p-4 text-center text-sm text-brown-light shadow-card">
            まだ名言がありません。ガチャを回してみましょう。
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

      {/* PV動画 */}
      <section className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gold-dark/60" />
          <h2 className="text-sm font-bold tracking-widest text-gold-dark">
            ◆ PV動画 ◆
          </h2>
          <span className="h-px w-8 bg-gold-dark/60" />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-gold to-gold-dark p-[3px] shadow-glow">
          <div className="overflow-hidden rounded-[14px] border border-parchment-light/30 bg-brown-dark">
            {!playPV ? (
              <button
                onClick={() => setPlayPV(true)}
                className="relative block w-full"
                aria-label="PV動画を再生"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pv/thumbnail.jpg"
                  alt="Re:Bible PV"
                  className="aspect-video w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-brown-dark/25">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-brown-dark/70 text-2xl text-gold shadow-glow transition-transform hover:scale-110">
                    ▶
                  </span>
                </span>
                <span className="absolute bottom-2 right-3 rounded bg-brown-dark/80 px-2 py-0.5 text-[11px] font-bold tracking-wide text-gold">
                  Re:Bible 公式PV
                </span>
              </button>
            ) : (
              <video
                src="/pv/rebible.mp4"
                poster="/pv/thumbnail.jpg"
                controls
                autoPlay
                playsInline
                className="aspect-video w-full bg-black"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
