import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "M3U8视频播放器 - 在线播放和分析M3U8格式视频",
  description: "专业的M3U8视频播放器工具，支持在线播放、分片数分析和跨域检测功能。完美支持HLS视频流播放。",
  keywords: "m3u8播放器,hls播放器,视频播放,在线播放器,m3u8分析,跨域检测",
};

export default function M3U8PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}