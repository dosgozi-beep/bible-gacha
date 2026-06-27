"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Quote } from "@/types";
import { quotes } from "@/data/quotes";
import { getCollection } from "@/lib/collection";
import { redactQuote } from "@/lib/redact";
import ResultCard from "@/components/ResultCard";

type SortMode = "number" | "timeline";

export default function CollectionPage() {
  const [mounted, setMounted] = useState(false);
  const [sort, setSort] = useState<SortMode>("number");
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Quote | null>(null);

  useEffect(() => {
    setMounted(true);
    setOwnedIds(new Set(getCollection().map((e) => e.id)));
  }, []);

  // 図鑑の並び（No順 or 歴史順）。常に全20枠を表示。
  const ordered = useMemo(() => {
    const arr = [...quotes];
    if (sort === "timeline") {
      arr.sort((a, b) => a.timelineOrder - b.timelineOrder || a.id - b.id);
    } else {
      arr.sort((a, b) => a.id - b.id);
    }
    return arr;
  }, [sort]);

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  const total = quotes.length;
  const count = ownedIds.size;
  const rate = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <main className="animate-fadeIn space-y-5">
      <header className="text-center">
        <h1 className="text-xl font-bold text-brown">名言図鑑</h1>
        <p className="mt-1 text-sm text-brown-light">
          収集率 {count} / {total}（{rate}%）
        </p>
        <div className="mx-auto mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-parchment-dark">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${rate}%` }}
          />
        </div>
      </header>

      {/* 並び替え */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setSort("number")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            sort === "number"
              ? "bg-brown text-parchment-light"
              : "bg-parchment-dark text-brown-light"
          }`}
        >
          No.順
        </button>
        <button
          onClick={() => setSort("timeline")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            sort === "timeline"
              ? "bg-brown text-parchment-light"
              : "bg-parchment-dark text-brown-light"
          }`}
        >
          歴史順
        </button>
      </div>

      {/* 全20枠グリッド */}
      <div className="grid grid-cols-2 gap-3">
        {ordered.map((q, idx) => {
          const owned = ownedIds.has(q.id);
          const no = sort === "number" ? q.id : idx + 1;
          return (
            <button
              key={q.id}
              onClick={() => setSelected(q)}
              className={`flex flex-col overflow-hidden rounded-xl border text-left shadow-card transition-transform hover:scale-[1.02] ${
                owned
                  ? "border-gold bg-parchment-light"
                  : "border-parchment-dark bg-parchment-dark/40"
              }`}
            >
              {/* 画像 or ？ */}
              <div className="relative aspect-square w-full">
                {owned ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={q.characterImage}
                    alt={q.speaker}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="char-img-fallback flex h-full w-full items-center justify-center">
                    <span className="font-serif text-5xl text-brown-light/70">
                      ？
                    </span>
                  </div>
                )}
                <span className="absolute left-1.5 top-1.5 rounded bg-brown-dark/70 px-1.5 py-0.5 text-[10px] font-bold text-parchment-light">
                  No.{String(no).padStart(2, "0")}
                </span>
              </div>

              {/* 名言（取得=表示 / 未取得=一部黒塗り） */}
              <div className="space-y-1 px-2.5 py-2">
                <p className="text-xs font-bold text-brown">
                  {owned ? q.speaker : "？？？"}
                </p>
                <p className="line-clamp-2 text-[11px] leading-snug text-brown-light">
                  {owned ? (
                    `「${q.quote}」`
                  ) : (
                    <RedactedLine quote={q.quote} seed={q.id} />
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 詳細モーダル */}
      {selected && (
        <DetailModal
          quote={selected}
          owned={ownedIds.has(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function RedactedLine({ quote, seed }: { quote: string; seed: number }) {
  const tokens = redactQuote(quote, seed);
  return (
    <span>
      「
      {tokens.map((t, i) =>
        t.hidden ? (
          <span
            key={i}
            className="mx-px rounded-sm bg-brown/80 align-middle text-transparent"
            aria-hidden="true"
          >
            {t.text}
          </span>
        ) : (
          <span key={i}>{t.text}</span>
        )
      )}
      」
    </span>
  );
}

function DetailModal({
  quote,
  owned,
  onClose,
}: {
  quote: Quote;
  owned: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {owned ? (
          <ResultCard quote={quote} />
        ) : (
          <div className="rounded-2xl border border-parchment-dark bg-parchment-light p-6 text-center shadow-card">
            <div className="char-img-fallback mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <span className="font-serif text-4xl text-brown-light/70">？</span>
            </div>
            <p className="mb-2 font-bold text-brown">未獲得の名言</p>
            <p className="mb-1 text-sm text-brown-light">
              No.{String(quote.id).padStart(2, "0")}・ヒント
            </p>
            <p className="text-sm leading-relaxed text-brown-light">
              <RedactedLine quote={quote.quote} seed={quote.id} />
            </p>
            <Link
              href="/gacha"
              className="mt-5 inline-block rounded-full bg-gold px-6 py-2.5 font-bold text-brown-dark shadow-card transition-colors hover:bg-gold-dark"
            >
              ガチャで手に入れる
            </Link>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-full bg-brown py-2.5 font-bold text-parchment-light shadow-card transition-colors hover:bg-brown-dark"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
