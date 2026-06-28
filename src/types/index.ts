export type Rarity = "N" | "R" | "SR" | "SSR";

export interface CharacterProfile {
  age: string;
  personality: string;
  appearance: string;
  character: string;
  hair: string;
  eyes: string;
  build: string;
  iconicItem: string;
  colorTheme: string;
}

export interface Quote {
  id: number;
  quote: string;
  reference: string;
  speaker: string;
  era: string;
  background: string;
  characterImage: string;
  characterProfile: CharacterProfile;
  rarity: Rarity;
  timelineOrder: number;
  /** 聖書に基づく人物の簡単な紹介 */
  bio: string;
  /** その人物が生きた時代の説明 */
  eraDescription: string;
}

export interface CollectionEntry {
  id: number;
  acquiredAt: string; // ISO日時。取得順ソート用
}

export interface DiaryEntry {
  date: string; // "YYYY-MM-DD"
  quoteId: number;
  body: string;
}

// ボーナスステージ：聖書の言葉に力を受けた偉人
export interface Legend {
  id: number;
  name: string; // 氏名
  era: string; // 生没年・活動年代
  title: string; // 肩書き・一言で何者か
  symbol: string; // 象徴を表す絵文字アイコン
  verse: string; // 影響を受けた聖句（本文）
  verseRef: string; // 聖句の出典
  episode: string; // 聖書の言葉に影響を受けたエピソード
  achievement: string; // 成し遂げたこと
  life: string; // 生涯の背景
  colorTheme: string; // テーマ色（hex）
}
