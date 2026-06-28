"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePageBg } from "@/lib/usePageBg";
import type { Quote } from "@/types";
import { canDrawToday, drawQuote, markDrawn } from "@/lib/gacha";
import { addToCollection } from "@/lib/collection";
import ScatterText from "@/components/ScatterText";
import ResultCard from "@/components/ResultCard";

type Phase = "idle" | "spinning" | "scatter" | "result";

export default function GachaPage() {
  usePageBg("gacha");
  const [mounted, setMounted] = useState(false);
  const [canDraw, setCanDraw] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Quote | null>(null);

  useEffect(() => {
    setMounted(true);
    setCanDraw(canDrawToday());
  }, []);

  function handleDraw() {
    if (!canDraw || phase !== "idle") return;
    const q = drawQuote(true);
    setResult(q);
    markDrawn();
    addToCollection(q.id);
    setCanDraw(false);

    // 機械が回る → 文字が舞う
    setPhase("spinning");
    window.setTimeout(() => setPhase("scatter"), 900);
  }

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  // 既に引いた日（結果表示中ではない）
  const drawnLockView = !canDraw && phase === "idle";

  return (
    <main className="animate-fadeIn space-y-5">
      {/* 結果表示前：王宮ガチャ機械の舞台 */}
      {phase !== "result" && (
        <section className="relative overflow-hidden rounded-2xl shadow-card">
          {/* 背景画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gacha/machine.png"
            alt="王宮の名言ガチャ"
            className="h-[460px] w-full object-cover"
          />
          {/* 暗幕オーバーレイ（文字を映えさせる） */}
          <div
            className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${
              phase === "idle" && !drawnLockView
                ? "bg-brown-dark/0"
                : "bg-brown-dark/35"
            }`}
          />

          {/* 回転中の光 */}
          {phase === "spinning" && (
            <div className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-tr from-gold/40 via-transparent to-transparent" />
          )}

          {/* 文字が舞って集まる：機械の口元あたり(下寄り)に配置 */}
          {phase === "scatter" && result && (
            <div className="absolute inset-x-3 bottom-6 top-1/2 flex items-center justify-center">
              <ScatterText
                text={result.quote}
                onDone={() => setPhase("result")}
              />
            </div>
          )}

          {/* 操作ボタン or 状態表示（下部中央） */}
          <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 px-4">
            {phase === "idle" && canDraw && (
              <button
                onClick={handleDraw}
                className="btn-ornate px-10 py-3 text-base"
              >
                ガチャを回す
              </button>
            )}
            {phase === "spinning" && (
              <p className="rounded-full bg-brown-dark/70 px-5 py-2 text-sm font-bold text-parchment-light">
                カプセルが出てきます…
              </p>
            )}
            {drawnLockView && (
              <div className="rounded-xl bg-brown-dark/70 px-5 py-3 text-center">
                <p className="text-sm font-bold text-parchment-light">
                  今日はもう回しました
                </p>
                <p className="text-xs text-parchment">また明日回せます</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 結果：フル情報カード + 戻る */}
      {phase === "result" && result && (
        <div className="animate-fadeIn space-y-4">
          <ResultCard quote={result} />
          <p className="text-center text-xs text-brown-light">
            図鑑に追加されました。また明日回せます。
          </p>
          <Link
            href="/"
            className="btn-ornate-dark block w-full py-3 text-center"
          >
            トップへ戻る
          </Link>
        </div>
      )}
    </main>
  );
}
