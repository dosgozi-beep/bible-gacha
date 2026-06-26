import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "聖書名言ガチャ",
  description:
    "1日1回、聖書の名言を受け取る。人生の指針と励ましのための名言ガチャ。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4ecd8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {/* モバイルファースト・最大幅制限・高級感のある余白。pb-24で下部固定ナビ分を確保 */}
        <div className="mx-auto w-full max-w-md px-5 pb-24 pt-8 sm:pt-10">
          {children}
        </div>
        <NavBar />
      </body>
    </html>
  );
}
