// 名言を一部黒塗りにする（未取得エントリの興味喚起用）
// 句読点で区切り、決定的に約半分の節を黒塗りブロックへ置換する。

function pseudo(seed: number, i: number): number {
  const r = Math.sin((seed + 1) * 99.13 + i * 17.77) * 43758.5453;
  return r - Math.floor(r);
}

export type RedactToken = { text: string; hidden: boolean };

export function redactQuote(quote: string, seed: number): RedactToken[] {
  // 「、」「。」を保持しつつ節に分割
  const parts = quote.split(/(、|。)/).filter((s) => s.length > 0);
  const tokens: RedactToken[] = [];
  let phraseIndex = 0;
  for (const part of parts) {
    if (part === "、" || part === "。") {
      tokens.push({ text: part, hidden: false });
      continue;
    }
    // 句読点でない実テキスト節。約55%を黒塗り。先頭節は必ず見せる。
    const hide = phraseIndex !== 0 && pseudo(seed, phraseIndex) < 0.55;
    tokens.push({ text: part, hidden: hide });
    phraseIndex += 1;
  }
  return tokens;
}
