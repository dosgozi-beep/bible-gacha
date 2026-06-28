"use client";

import { useState } from "react";
import type { Quote, Rarity } from "@/types";

const RARITY_BORDER: Record<Rarity, string> = {
  N: "border-rarity-n",
  R: "border-rarity-r",
  SR: "border-rarity-sr",
  SSR: "border-rarity-ssr",
};
const RARITY_TEXT: Record<Rarity, string> = {
  N: "text-rarity-n",
  R: "text-rarity-r",
  SR: "text-rarity-sr",
  SSR: "text-rarity-ssr",
};

export default function ResultCard({ quote }: { quote: Quote }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`overflow-hidden rounded-2xl border-2 ${RARITY_BORDER[quote.rarity]} bg-parchment-light shadow-card`}
    >
      {/* 人物画像 */}
      <div className="relative aspect-[4/3] w-full">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={quote.characterImage}
            alt={quote.speaker}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="char-img-fallback flex h-full w-full items-center justify-center">
            <span className="font-serif text-6xl text-brown-light">
              {quote.speaker.charAt(0)}
            </span>
          </div>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full bg-parchment-light/90 px-2 py-0.5 text-xs font-bold ${RARITY_TEXT[quote.rarity]}`}
        >
          {quote.rarity}
        </span>
      </div>

      <div className="space-y-4 px-4 py-4">
        {/* 名言・章節 */}
        <div>
          <p className="text-[15px] font-bold leading-relaxed text-brown">
            「{quote.quote}」
          </p>
          <p className="mt-1 text-right text-xs text-brown-light">
            {quote.speaker}・{quote.reference}
          </p>
        </div>

        {/* 場面説明 */}
        <div className="rounded-lg bg-parchment-dark/40 p-3">
          <p className="mb-1 text-xs font-bold text-gold-dark">この言葉の場面</p>
          <p className="text-xs leading-relaxed text-brown">
            {quote.background}
          </p>
        </div>

        {/* 人物紹介（聖書ベース） */}
        <div className="rounded-lg bg-parchment-dark/40 p-3">
          <p className="mb-1 text-xs font-bold text-gold-dark">
            {quote.speaker}とは
          </p>
          <p className="text-xs leading-relaxed text-brown">{quote.bio}</p>
        </div>

        {/* 時代背景 */}
        <div className="rounded-lg bg-parchment-dark/40 p-3">
          <p className="mb-1 text-xs font-bold text-gold-dark">時代背景</p>
          <p className="text-xs leading-relaxed text-brown">
            {quote.eraDescription}
          </p>
        </div>
      </div>
    </article>
  );
}
