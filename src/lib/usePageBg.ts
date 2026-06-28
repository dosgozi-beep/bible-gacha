"use client";

import { useEffect } from "react";

/** ページごとに .app-bg 要素へ data-bg を設定して背景画像を切替。離脱時に解除。 */
export function usePageBg(name: "collection" | "diary" | "gacha") {
  useEffect(() => {
    const el = document.querySelector(".app-bg");
    if (el) el.setAttribute("data-bg", name);
    return () => {
      if (el) el.removeAttribute("data-bg");
    };
  }, [name]);
}
