"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  text: string;
  /** 1文字ごとの舞い出し間隔(ms) */
  stagger?: number;
  /** 集合アニメ所要(ms) */
  settle?: number;
  /** 集合完了時コールバック */
  onDone?: () => void;
};

// 口元で小さく舞う、控えめな散らばり（決定的擬似ランダム）
function scatterFor(i: number) {
  const r1 = Math.sin(i * 12.9898) * 43758.5453;
  const r2 = Math.sin(i * 78.233) * 12543.987;
  const fx = r1 - Math.floor(r1) - 0.5; // -0.5..0.5
  const fy = r2 - Math.floor(r2) - 0.5;
  return {
    dx: Math.round(fx * 80), // 横 ±40px
    dy: Math.round(-16 - Math.abs(fy) * 64), // 口元から上へ舞う
    rot: Math.round(fx * 46), // ±23deg
  };
}

type Phase = "hidden" | "scatter" | "gather";

export default function ScatterText({
  text,
  stagger = 55,
  settle = 520,
  onDone,
}: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    setPhase("hidden");
    // すぐ舞い出し → 全文字出てから集合
    const t0 = window.setTimeout(() => setPhase("scatter"), 30);
    const outDone = chars.length * stagger + 220;
    const t1 = window.setTimeout(() => setPhase("gather"), outDone);
    const t2 = window.setTimeout(() => onDone?.(), outDone + settle + 140);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <p
      className="flex flex-wrap items-center justify-center gap-x-0.5 text-center text-lg font-bold leading-relaxed text-parchment-light"
      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}
      aria-label={text}
    >
      {chars.map((ch, i) => {
        const s = scatterFor(i);
        let transform = "translate(0,0) rotate(0deg)";
        let opacity = 0;
        if (phase === "scatter") {
          transform = `translate(${s.dx}px, ${s.dy}px) rotate(${s.rot}deg)`;
          opacity = 0.85;
        } else if (phase === "gather") {
          transform = "translate(0,0) rotate(0deg)";
          opacity = 1;
        }
        const style: React.CSSProperties = {
          display: "inline-block",
          whiteSpace: "pre",
          transform,
          opacity,
          transition:
            phase === "scatter"
              ? `transform 360ms ease-out ${i * stagger}ms, opacity 240ms ease ${i * stagger}ms`
              : `transform ${settle}ms cubic-bezier(.22,.61,.36,1) ${i * 16}ms, opacity 260ms ease`,
        };
        return (
          <span key={i} style={style}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </p>
  );
}
