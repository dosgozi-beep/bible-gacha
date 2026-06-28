import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  safelist: [
    // GachaEffect / QuoteCard の rarity別動的クラス
    "from-rarity-n/20", "from-rarity-r/30", "from-rarity-sr/40", "from-rarity-ssr/60",
    "ring-rarity-r/30", "ring-rarity-sr/40", "ring-rarity-ssr/60",
    "border-rarity-n", "border-rarity-r", "border-rarity-sr", "border-rarity-ssr",
    "text-rarity-n", "text-rarity-r", "text-rarity-sr", "text-rarity-ssr",
  ],
  theme: {
    extend: {
      colors: {
        // 基調: 羊皮紙・金・濃茶
        parchment: {
          DEFAULT: "#f4ecd8",
          light: "#faf6ea",
          dark: "#e7dbbf",
        },
        gold: {
          DEFAULT: "#c9a24b",
          light: "#e3c878",
          dark: "#a07e2e",
        },
        brown: {
          DEFAULT: "#4a3527",
          light: "#6b4f3a",
          dark: "#2e2118",
        },
        // レア度カラー（演出用）
        rarity: {
          n: "#9b8c74",
          r: "#5b86c4",
          sr: "#9a6dd0",
          ssr: "#d9a528",
        },
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
      },
      boxShadow: {
        card: "0 6px 24px rgba(46, 33, 24, 0.18)",
        glow: "0 0 24px rgba(201, 162, 75, 0.55)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        cardReveal: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shine: {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.9" },
          "100%": { opacity: "0" },
        },
        "spin-orbit": {
          "0%": { transform: "rotate(0deg) scale(0.7)" },
          "70%": { transform: "rotate(560deg) scale(1)" },
          "100%": { transform: "rotate(720deg) scale(0.9)" },
        },
        "char-appear": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out",
        cardReveal: "cardReveal 0.7s ease-out",
        shine: "shine 1.1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
