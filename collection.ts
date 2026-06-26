@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  /* 羊皮紙の地に淡い金のにじみ */
  background-color: theme("colors.parchment.DEFAULT");
  background-image:
    radial-gradient(
      circle at 20% 12%,
      rgba(201, 162, 75, 0.1),
      transparent 42%
    ),
    radial-gradient(
      circle at 82% 78%,
      rgba(74, 53, 39, 0.08),
      transparent 46%
    );
  background-attachment: fixed;
  color: theme("colors.brown.DEFAULT");
  font-family: theme("fontFamily.serif");
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* 共通の見出し字間 */
h1,
h2,
h3 {
  letter-spacing: 0.02em;
}

/* 画像未配置でも崩れにくいフォールバック背景 */
.char-img-fallback {
  background-color: theme("colors.parchment.dark");
}
