"use client";

import type { ReactNode } from "react";
import type { Rarity } from "@/types";

type Props = {
  children: ReactNode;
  rarity?: Rarity;
  isRevealed?: boolean;
};

// rarityごとの演出強度（光の色・濃さ・shine反復感）
const GLOW: Record<Rarity, string> = {
  N: "from-rarity-n/20",
  R: "from-rarity-r/30",
  SR: "from-rarity-sr/40",
  SSR: "from-rarity-ssr/60",
};

// SR以上はリングを強調
const RING: Record<Rarity, string> = {
  N: "ring-0",
  R: "ring-1 ring-rarity-r/30",
  SR: "ring-2 ring-rarity-sr/40",
  SSR: "ring-2 ring-rarity-ssr/60 shadow-glow",
};

export default function GachaEffect({
  children,
  rarity = "N",
  isRevealed = false,
}: Props) {
  if (!isRevealed) {
    // 未開封：淡くフェードする待機状態
    return (
      <div className="animate-fadeIn opacity-70">{children}</div>
    );
  }

  return (
    <div className={`relative animate-cardReveal rounded-2xl ${RING[rarity]}`}>
      {/* 光のエフェクト（CSSグラデ＋shineアニメ。SSRほど濃い） */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 animate-shine rounded-2xl bg-gradient-to-tr ${GLOW[rarity]} to-transparent`}
        aria-hidden="true"
      />
      {/* カード本体 */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
