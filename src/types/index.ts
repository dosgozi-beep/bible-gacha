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
