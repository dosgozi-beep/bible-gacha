"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DiaryEntry, Quote } from "@/types";
import { quotes } from "@/data/quotes";
import { getCollection } from "@/lib/collection";
import { getDiary, addDiaryEntry } from "@/lib/diary";
import { getTodayKey } from "@/lib/gacha";

function quoteById(id: number): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

export default function DiaryPage() {
  const [mounted, setMounted] = useState(false);
  const [today] = useState(getTodayKey());
  const [todayQuoteId, setTodayQuoteId] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const all = getDiary();
    setEntries(all);

    // 本日分が既にあれば本文を復元
    const existing = all.find((e) => e.date === today);
    if (existing) {
      setBody(existing.body);
      setTodayQuoteId(existing.quoteId);
    } else {
      // 最新取得名言を本日の名言として紐付け
      const col = getCollection();
      if (col.length > 0) setTodayQuoteId(col[col.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSave() {
    const entry: DiaryEntry = {
      date: today,
      quoteId: todayQuoteId ?? -1,
      body: body.trim(),
    };
    const updated = addDiaryEntry(entry);
    setEntries(updated);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  const todayQuote =
    todayQuoteId !== null ? quoteById(todayQuoteId) : undefined;

  // 新しい順
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="animate-fadeIn space-y-5">
      <header className="text-center">
        <h1 className="text-xl font-bold text-brown">日記</h1>
        <p className="mt-1 text-xs text-brown-light">{today}</p>
      </header>

      {/* 入力エリア */}
      <section className="space-y-3 rounded-2xl border border-parchment-dark bg-parchment-light p-4 shadow-card">
        {todayQuote ? (
          <blockquote className="rounded-lg bg-parchment-dark/40 p-3 text-xs text-brown">
            <span className="font-bold">{todayQuote.speaker}</span>
            <span className="ml-2 text-brown-light">
              {todayQuote.reference}
            </span>
            {todayQuote.quote && (
              <p className="mt-1 leading-relaxed">{todayQuote.quote}</p>
            )}
          </blockquote>
        ) : (
          <p className="text-xs text-brown-light">
            今日の名言はまだありません。先にガチャを引くと紐付きます。
          </p>
        )}

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="今日の気持ちを書き留めましょう…"
          rows={5}
          className="w-full resize-none rounded-lg border border-parchment-dark bg-parchment-light p-3 text-sm text-brown outline-none focus:border-gold"
        />

        <button
          onClick={handleSave}
          className="w-full rounded-full bg-gold py-2.5 font-bold text-parchment-light shadow-card transition-colors hover:bg-gold-dark"
        >
          {saved ? "保存しました" : "保存する"}
        </button>
      </section>

      {/* 過去の日記 */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-brown">これまでの記録</h2>
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-brown-light">
            まだ日記がありません。
          </p>
        ) : (
          sorted.map((e) => {
            const q = quoteById(e.quoteId);
            return (
              <article
                key={e.date}
                className="rounded-xl border border-parchment-dark bg-parchment-light p-3 shadow-card"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-brown">
                    {e.date}
                  </span>
                  {q && (
                    <span className="text-[11px] text-brown-light">
                      {q.speaker}・{q.reference}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-brown">
                  {e.body || "（本文なし）"}
                </p>
              </article>
            );
          })
        )}
      </section>

      <p className="text-center text-[11px] text-brown-light">
        <Link href="/" className="underline">
          ホームへ戻る
        </Link>
      </p>
    </main>
  );
}
