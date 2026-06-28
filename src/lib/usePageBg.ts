"use client";

import { useEffect } from "react";

/** ページごとに body[data-bg] を設定して背景画像を切り替える。離脱時に解除。 */
export function usePageBg(name: "collection" | "diary" | "gacha") {
  useEffect(() => {
    document.body.setAttribute("data-bg", name);
    return () => {
      document.body.removeAttribute("data-bg");
    };
  }, [name]);
}
