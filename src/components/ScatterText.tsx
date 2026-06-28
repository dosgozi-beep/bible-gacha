"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  text: string;
  /** 円運動の継続時間(ms) */
  orbit?: number;
  /** 集合アニメ所要(ms) */
  settle?: number;
  /** 集合完了コールバック */
  onDone?: () => void;
};

type Phase = "orbit" | "gather";

export default function ScatterText({
  text,
  orbit = 1700,
  settle = 600,
  onDone,
}: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [phase, setPhase] = useState<Phase>("orbit");

  useEffect(() => {
    setPhase("orbit");
    const t1 = window.setTimeout(() => setPhase("gather"), orbit);
    const t2 = window.setTimeout(() => onDone?.(), orbit + settle + 120);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const n = chars.length;
  const radius = 96; // 円周の半径(px)

  return (
    <div className="relative h-[260px] w-full">
      {/* 円運動フェーズ：文字を円周上に並べて回す */}
      {phase === "orbit" && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            animation: "spin-orbit 1.7s linear",
            transformOrigin: "center",
          }}
        >
          {chars.map((ch, i) => {
            const angle = (360 / n) * i;
            return (
              <span
                key={i}
                className="font-display absolute text-lg font-extrabold text-gold"
                style={{
                  left: 0,
                  top: 0,
                  transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
                  textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                  opacity: 0,
                  animation: `char-appear 0.4s ease forwards ${i * 40}ms`,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </div>
      )}

      {/* 集合フェーズ：中央で1つの名言に */}
      {phase === "gather" && (
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2">
          <p
            className="font-display animate-cardReveal text-center text-lg font-extrabold leading-relaxed text-parchment-light"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.75)" }}
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );
}
