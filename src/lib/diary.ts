import type { DiaryEntry } from "@/types";
import { getDiary as readDiary, setDiary as writeDiary } from "@/lib/storage";

export function getDiary(): DiaryEntry[] {
  return readDiary();
}

export function setDiary(entries: DiaryEntry[]): void {
  writeDiary(entries);
}

/**
 * 日記を追加。同じ date が既にあれば上書き更新（1日1件）。
 * 戻り値は更新後の全エントリ。
 */
export function addDiaryEntry(entry: DiaryEntry): DiaryEntry[] {
  const current = getDiary();
  const idx = current.findIndex((e) => e.date === entry.date);
  let updated: DiaryEntry[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = entry;
  } else {
    updated = [...current, entry];
  }
  setDiary(updated);
  return updated;
}
