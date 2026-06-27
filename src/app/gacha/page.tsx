"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/types";
import { canDrawToday, drawQuote, markDrawn } from "@/lib/gacha";
import { addToCollection } from "@/lib/collection";
import QuoteCard from "@/components/QuoteCard";
import GachaEffect from "@/components/GachaEffect";

export default function GachaPage() {
  const [mounted, setMounted] = useState(false);
  const [canDraw, setCanDraw] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<Quote | null>(null);

  // マウント後に当日状態を確定（自動抽選はしない）
  useEffect(() => {
    setMounted(true);
    setCanDraw(canDrawToday());
  }, []);

  // ユーザー操作でのみ抽選
  function handleDraw() {
    if (!canDraw || isDrawing) return;
    setIsDrawing(true);
    setRevealed(false);

    const q = drawQuote(true); // 未取得優先
    setResult(q);
    markDrawn();
    addToCollection(q.id);
    setCanDraw(false);

    // 演出: 少し溜めてから開封
    window.setTimeout(() => setRevealed(true), 650);
  }

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  return (
    <main className="animate-fadeIn space-y-6">
      <header className="text-center">
        <h1 className="text-xl font-bold text-brown">名言ガチャ</h1>
        <p className="mt-1 text-xs text-brown-light">
          1日1回、今日の言葉を受け取りましょう。
        </p>
      </header>

      {/* 抽選前 & 引ける */}
      {!result && canDraw && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="char-img-fallback flex h-28 w-28 items-center justify-center rounded-full text-4xl shadow-card">
            🎲
          </div>
          <button
            onClick={handleDraw}
            className="rounded-full bg-gold px-8 py-3 font-bold text-parchment-light shadow-card transition-colors hover:bg-gold-dark"
          >
            今日のガチャを引く
          </button>
        </div>
      )}

      {/* 抽選結果 */}
      {result && (
        <div className="space-y-4">
          <GachaEffect rarity={result.rarity} isRevealed={revealed}>
            <QuoteCard quote={result} />
          </GachaEffect>
          {revealed && (
            <p className="animate-fadeIn text-center text-xs text-brown-light">
              図鑑に追加されました。また明日引けます。
            </p>
          )}
        </div>
      )}

      {/* 既に引いた日（結果は表示中でない） */}
      {!result && !canDraw && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="font-bold text-brown">今日は既に引いています</p>
          <p className="text-sm text-brown-light">明日また引けます。</p>
        </div>
      )}
    </main>
  );
}
