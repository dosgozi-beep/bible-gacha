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

export default function QuoteCard({ quote }: { quote: Quote }) {
  const [imgError, setImgError] = useState(false);
  const initial = quote.speaker.charAt(0);

  return (
    <article
      className={`rounded-2xl border-2 ${RARITY_BORDER[quote.rarity]} bg-parchment-light shadow-card overflow-hidden`}
    >
      {/* 画像エリア（固定アスペクトで高さ暴走を防ぐ） */}
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
            <span className="font-serif text-5xl text-brown-light">
              {initial}
            </span>
          </div>
        )}
        {/* rarityバッジ */}
        <span
          className={`absolute right-2 top-2 rounded-full bg-parchment-light/90 px-2 py-0.5 text-xs font-bold ${RARITY_TEXT[quote.rarity]}`}
        >
          {quote.rarity}
        </span>
      </div>

      {/* テキストエリア */}
      <div className="space-y-2 px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-base font-bold text-brown">{quote.speaker}</h2>
          <span className="shrink-0 text-xs text-brown-light">
            {quote.reference}
          </span>
        </div>

        {quote.quote ? (
          <p className="text-[15px] leading-relaxed text-brown">
            {quote.quote}
          </p>
        ) : (
          <p className="text-sm italic text-brown-light">
            （聖句は準備中です）
          </p>
        )}

        <p className="line-clamp-3 border-t border-parchment-dark pt-2 text-xs leading-relaxed text-brown-light">
          {quote.background}
        </p>
      </div>
    </article>
  );
}
