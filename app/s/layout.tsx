import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "M3U8播放器 - 嵌入模式",
  description: "M3U8视频播放器嵌入模式",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} m-0 p-0 overflow-hidden h-full`}>
        {children}
      </body>
    </html>
  );
}