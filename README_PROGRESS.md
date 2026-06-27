# 聖書名言ガチャ — 開発進捗

## 概要
1日1回ガチャで聖書の名言を受け取る自己啓発アプリ。
Next.js + TypeScript + TailwindCSS + LocalStorage（サーバーレス / ログイン不要）。
後からFirebase追加可能な設計。

## デザイン
落ち着き / 高級感 / 温かみ。色: 羊皮紙・金・濃茶。軽量重視。
演出は 光エフェクト / カード出現 / フェード のみ。Canvas・Three.js・重ライブラリ禁止。

## フォルダ構成
```
src/
  app/        layout, page(home), gacha, collection, diary
  components/ QuoteCard, GachaEffect, NavBar
  data/       quotes.ts (20種)
  lib/        storage.ts, gacha.ts
  types/      index.ts
public/characters/
```

## データ型
Quote{id,quote,reference,speaker,era,background,characterImage,characterProfile,rarity,timelineOrder}
rarity: "N"|"R"|"SR"|"SSR" / timelineOrder: number (歴史順表示用)
characterProfile{age,personality,appearance,character,hair,eyes,build,iconicItem,colorTheme}
CollectionEntry{id,acquiredAt}
DiaryEntry{date,quoteId,body}
LSキー: bg_lastDraw / bg_collection / bg_diary

※quote 記入済み（聖書口語訳/パブリックドメイン)。reference は記入済み。
※全20レコード。rarity/timelineOrder付与済(同一人物は同timelineOrder)。
　rarity割当: イエス=SSR / モーセ・ダビデ・ソロモン・パウロ=SR / ヨシュア・サムエル・イザヤ・エレミヤ・ダニエル=R / ペテロ・ヨハネ=N
　timelineOrder: 1モーセ 2ヨシュア 3サムエル 4ダビデ 5ソロモン 6イザヤ 7エレミヤ 8ダニエル 9ペテロ 10パウロ 11ヨハネ 12イエス

## タスク一覧
- [x] Step1 設計 + 進捗ファイル
- [x] Step2 プロジェクト雛形 (package.json, tsconfig[@/*alias], next.config.js, postcss.config.js, tailwind.config.ts[羊皮紙/金/濃茶/rarity色+演出keyframes])
- [x] Step3 types/index.ts (Rarity/CharacterProfile/Quote/CollectionEntry/DiaryEntry。Quoteにrarity・timelineOrder追加)
- [x] Step4 data/quotes.ts (全20レコード。reference記入済/quote空。characterProfile強化。rarity・timelineOrder付与済)
- [x] Step5 lib/storage.ts (SSR安全/JSON parseフォールバック/デフォルト値。get/setLastDraw・Collection・Diary、clearAll、STORAGE_KEYS)
- [x] Step6 lib/gacha.ts (getTodayKey/canDrawToday/drawQuote(excludeOwned?)/markDrawn。rarity重み SSR5%/SR15%/R30%/N50%。未取得優先抽選対応。addToCollectionはcollection.tsへ委譲・再export)
- [x] Step7 lib/collection.ts (getCollection/hasCollected/addToCollection/sortByObtainedOrder/sortByTimelineOrder)
- [x] Step10 components/NavBar.tsx ('use client'。navItems配列(ホーム/ガチャ/図鑑/日記+絵文字)。下部固定・usePathnameでアクティブ表示・next/link Link・safe-area-inset-bottom対応。羊皮紙/金/濃茶)
- [x] Step9 components/QuoteCard.tsx ('use client'。画像/人物名/聖句/章節/背景/rarity表示。rarity別border+badge色。img onError→人物名先頭1文字フォールバック。aspect-[4/3]+line-clamp-3で高さ抑制。quote空時は準備中表示)
- [x] Step12 components/GachaEffect.tsx ('use client'。Props:children/rarity?/isRevealed?。tailwind animation(fadeIn/cardReveal/shine)のみ。Canvas/Three.js/外部lib不使用。rarity別に光色glow・ring強度可変。SSRはshadow-glow)
- [x] Step8 app/layout.tsx + globals.css (metadata/viewport、html(lang=ja)/body、羊皮紙背景グラデ、serif基調、max-w-md中央寄せ・余白、char-img-fallback)
- [x] Step11 layout.tsx 更新 (NavBar組込・全ページ共通表示・container pb-24・min-h-screen維持)
- [x] Step16 app/page.tsx ホーム ('use client'。mount後取得。今日のガチャ済/未表示、未抽選はCTA強調(shadow-glow)。今日の名言=当日日記紐付け→最新collection優先。収集率+バー。図鑑/日記導線)
- [x] Step13 app/gacha/page.tsx ('use client'。mount後にcanDrawToday確定。ボタン押下のみ抽選(useEffect自動抽選なし)→drawQuote(true)/markDrawn/addToCollection→GachaEffect+QuoteCardで演出表示。既引日は「今日は既に引いています/明日また引けます」)
- [x] Step14 app/collection/page.tsx ('use client'。mount後getCollection。取得順/歴史順トグル(sortByObtainedOrder/Timeline)。収集率 count/total+%+進捗バー。QuoteCard縦並び。空状態「まだ名言を獲得していません」+ガチャ導線)
- [x] Step15 lib/diary.ts (getDiary/setDiary/addDiaryEntry。同date上書きupsert) + app/diary/page.tsx ('use client'。mount後getDiary。当日名言=最新collection紐付け。本文textarea→保存(同日1件上書)→一覧更新。過去分は日付降順。空状態あり)
- [x] Step17 品質確認: tsc型チェック0件 / next build 成功(全7ルート静的生成) / next lint 警告0。package.jsonにeslint依存追加、.eslintrc.json/.gitignore整備
- [x] Step18 quotes.ts 全20件のquoteを口語訳本文で記入(データのみ。UI/ロジック/型は無変更)。tsc再チェック0件
- [x] Step19 キャラ画像配置 (12/12完了。各1254x1254 PNG。参照と完全一致)
- [x] Step22 コンテンツ拡充: Quote型にbio(人物紹介)/eraDescription(時代背景)追加・全20件記入。ResultCardに人物紹介と時代背景を表示。トップをRE:BIBLEヒーロー画像(public/brand/hero.png)+PV動画(public/pv/rebible.mp4 720p圧縮29MB+thumbnail.jpg)に刷新。図鑑を全20枠グリッド化(取得=画像+名言/未取得=？マーク+黒塗り名言redact.ts、タップで詳細モーダル)
- [x] Step21 ガチャ演出刷新: 王宮ガチャ画像(public/gacha/machine.png)を背景に、回すボタン→光→ScatterText(文字が口元で舞って集合)→ResultCard(画像/名言/章節/全プロフィール/場面説明)→トップへ戻る。GachaEffectは図鑑用QuoteCardのみ残置。Vercel deploy済み構成
- [x] Step20 最終ビルド: 画像反映後 next build 成功(全5ルート静的生成、/ 102kB等)。全機能完成

## Tailwindトークン
色: parchment(羊皮紙) / gold(金) / brown(濃茶) 各 light/DEFAULT/dark。rarity.n/r/sr/ssr。
animation: fadeIn / cardReveal / shine（軽量演出用）。shadow: card / glow。
依存: next14.2.5 / react18 / tailwind3.4。@/* → ./src/* エイリアス。

## gacha.ts API
getTodayKey(d?):"YYYY-MM-DD" / canDrawToday():boolean
drawQuote(excludeOwned=false):Quote … rarity重み(SSR5/SR15/R30/N50)。excludeOwnedで未取得優先(尽きたら全件)
markDrawn(date?) … bg_lastDrawに今日を記録
（addToCollection は collection.ts 参照）

addToCollection は collection.ts が正本（gacha.ts は再export）。

## NavBar
ルート: / (ホーム) /gacha /collection /diary。下部固定。
※layout組込済み(Step11)。container pb-24 でナビ分の余白確保済み。

## 注意 (Tailwind safelist)
GachaEffect/QuoteCard の rarity別動的クラス(from-rarity-*/ring-rarity-*/border-rarity-*/text-rarity-*)を
tailwind.config.ts の safelist に登録済み(Step12で追加)。新たなrarity依存クラス追加時は同様に登録。

## キャラクター画像 (public/characters/)
必要12種。配置済み(12/12) ✅ 全揃: moses jesus peter david paul jeremiah isaiah john solomon samuel daniel joshua
quotes.tsのcharacterImage参照と実ファイルを照合済み(欠落0/余剰0)。
※未配置分はQuoteCardのonErrorで人物名先頭1文字フォールバック表示。
※ファイル名はquotes.tsのcharacterImageと一致必須(/characters/xxx.png)。

## ビルド状態
BUILD SUCCESS (Next.js 14.2.5)。tsc/lint/build すべて通過。
重点確認OK: import path / 型不一致なし / Quote|undefined安全 / localStorageはSSR安全(storage.tsでtypeof window判定) / 全クライアントページに'use client' / useEffect依存配列([]で意図的にmount時のみ、page.tsxにeslint-disable注記)。
※注意: next@14.2.5 は既知の脆弱性警告あり(後日patch版へ更新推奨)。機能には影響なし。

## レイアウト方針
全ページ max-w-md 中央寄せ・モバイルファースト。羊皮紙背景はbodyで固定。
キャラ画像は未配置でも崩れない方針(.char-img-fallback / alt / onErrorで対応予定)。

## diary.ts API
getDiary()/setDiary(arr)
addDiaryEntry(entry):DiaryEntry[] … 同date既存なら上書き(1日1件)

## collection.ts API
getCollection():CollectionEntry[]
hasCollected(id):boolean
addToCollection(id):CollectionEntry[] … 重複無視・取得順保持
sortByObtainedOrder(entries?):Quote[] … 取得順(acquiredAt昇順)
sortByTimelineOrder(entries?):Quote[] … 歴史順(timelineOrder昇順,同値はid昇順)

## storage.ts API
getLastDraw():string|null / setLastDraw(date)
getCollection():CollectionEntry[] / setCollection(arr)
getDiary():DiaryEntry[] / setDiary(arr)
clearAll() … 開発用リセット。STORAGE_KEYS をexport。

## 再開方法
このファイルのタスク一覧で `[ ]` の最初の項目から続行する。

NEXT TASK: 変更分をGitHub Desktopでcommit&push→Vercel再デプロイ。新規素材: public/brand/hero.png, public/pv/rebible.mp4, public/pv/thumbnail.jpg。新規コード: src/lib/redact.ts。変更: types/index.ts, data/quotes.ts, components/ResultCard.tsx, app/page.tsx, app/collection/page.tsx。任意候補: 図鑑コンプ報酬、SSR専用演出、シェア機能。