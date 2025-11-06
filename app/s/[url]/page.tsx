'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface M3U8PlayerProps {
  url: string;
  isEmbedded?: boolean;
}

const M3U8PlayerEmbedded = ({ url, isEmbedded = true }: M3U8PlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (url) {
      try {
        // 解码URL参数
        const decodedUrl = decodeURIComponent(url);
        setVideoUrl(decodedUrl);
        setIsLoading(false);
      } catch (err) {
        setError('URL格式错误');
        setIsLoading(false);
      }
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="bg-red-600 text-white p-4 rounded-lg max-w-md">
            <h3 className="font-semibold mb-2">加载失败</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black">
      <video
        controls
        autoPlay
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="application/x-mpegURL" />
        您的浏览器不支持视频播放。
      </video>
      
      {/* 嵌入模式信息栏 */}
      {isEmbedded && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          嵌入模式
        </div>
      )}
    </div>
  );
};

export default function EmbedPage() {
  const params = useParams();
  const url = params.url as string;

  return (
    <div className="w-full h-full">
      <M3U8PlayerEmbedded url={url} isEmbedded={true} />
    </div>
  );
}