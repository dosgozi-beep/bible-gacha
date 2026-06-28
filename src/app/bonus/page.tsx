"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Legend } from "@/types";
import { legends } from "@/data/legends";
import { quotes } from "@/data/quotes";
import { getCollection } from "@/lib/collection";

export default function BonusPage() {
  const [mounted, setMounted] = useState(false);
  const [owned, setOwned] = useState(0);
  const [selected, setSelected] = useState<Legend | null>(null);

  useEffect(() => {
    setMounted(true);
    setOwned(new Set(getCollection().map((e) => e.id)).size);
  }, []);

  const total = quotes.length;
  const unlocked = useMemo(() => owned >= total, [owned, total]);

  if (!mounted) {
    return <div className="h-40 animate-fadeIn" aria-hidden="true" />;
  }

  // 未解放：ロック画面
  if (!unlocked) {
    const remain = total - owned;
    return (
      <main className="animate-fadeIn space-y-6 py-8 text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="font-display text-2xl font-extrabold text-brown">
          ボーナスステージ
        </h1>
        <p className="text-sm leading-relaxed text-brown-light">
          図鑑をすべて集めると、聖書の言葉に人生を変えられた
          <br />
          偉人たちの物語が解放されます。
        </p>
        <div className="mx-auto max-w-xs rounded-2xl border border-gold/40 bg-parchment-light/90 p-5 shadow-card">
          <p className="text-sm text-brown-light">解放まで</p>
          <p className="font-display my-1 text-4xl font-extrabold text-gold-dark">
            あと {remain} 枚
          </p>
          <p className="text-xs text-brown-light">
            {owned} / {total} 枚 収集済み
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-parchment-dark">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${(owned / total) * 100}%` }}
            />
          </div>
        </div>
        <Link href="/gacha" className="btn-ornate inline-block px-8 py-3">
          ガチャを回す
        </Link>
      </main>
    );
  }

  // 解放後：偉人一覧
  return (
    <main className="animate-fadeIn space-y-5">
      <header className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-gold-dark/60" />
          <span className="font-display text-xs font-bold tracking-[0.3em] text-gold-dark">
            BONUS STAGE
          </span>
          <span className="h-px w-6 bg-gold-dark/60" />
        </div>
        <h1 className="font-display mt-1 text-2xl font-extrabold text-brown">
          御言葉に生きた偉人たち
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-brown-light">
          聖書の言葉に力を受け、世界を変えた人々。
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {legends.map((lg) => (
          <button
            key={lg.id}
            onClick={() => setSelected(lg)}
            className="flex flex-col overflow-hidden rounded-xl border border-gold/50 bg-parchment-light text-left shadow-card transition-transform hover:scale-[1.02]"
          >
            {/* シルエット風アイコン */}
            <div
              className="relative flex aspect-square w-full items-center justify-center"
              style={{
                background: `linear-gradient(160deg, ${lg.colorTheme}22, ${lg.colorTheme}55)`,
              }}
            >
              <span className="text-5xl opacity-90">{lg.symbol}</span>
              <span
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 40%, transparent 40%, ${lg.colorTheme}33 100%)`,
                }}
              />
            </div>
            <div className="px-2.5 py-2">
              <p className="font-display text-sm font-bold text-brown">
                {lg.name}
              </p>
              <p className="text-[11px] text-brown-light">{lg.title}</p>
            </div>
          </button>
        ))}
      </div>

      <Link
        href="/collection"
        className="btn-ornate-dark block w-full py-3 text-center"
      >
        図鑑に戻る
      </Link>

      {selected && (
        <LegendModal legend={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}

function Section({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-lg bg-parchment-dark/40 p-3">
      <p className="mb-1 text-xs font-bold text-gold-dark">{label}</p>
      <p className="text-xs leading-relaxed text-brown">{children}</p>
    </div>
  );
}

function LegendModal({
  legend,
  onClose,
}: {
  legend: Legend;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-gold bg-parchment-light shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー：シルエットアイコン */}
        <div
          className="relative flex h-32 items-center justify-center"
          style={{
            background: `linear-gradient(160deg, ${legend.colorTheme}33, ${legend.colorTheme}77)`,
          }}
        >
          <span className="text-6xl">{legend.symbol}</span>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="text-center">
            <h2 className="font-display text-xl font-extrabold text-brown">
              {legend.name}
            </h2>
            <p className="text-xs text-brown-light">
              {legend.title}・{legend.era}
            </p>
          </div>

          {/* 影響を受けた聖句 */}
          <div className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-center">
            <p className="font-display text-sm font-bold leading-relaxed text-brown">
              「{legend.verse}」
            </p>
            <p className="mt-1 text-[11px] text-brown-light">
              {legend.verseRef}
            </p>
          </div>

          <Section label="聖書との出会い">{legend.episode}</Section>
          <Section label="成し遂げたこと">{legend.achievement}</Section>
          <Section label="生涯">{legend.life}</Section>

          <button
            onClick={onClose}
            className="btn-ornate-dark w-full py-2.5"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
