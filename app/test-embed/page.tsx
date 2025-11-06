'use client';

import { useEffect, useState } from 'react';

export default function TestEmbedPage() {
  const [testUrl, setTestUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    // 测试一个示例M3U8链接
    const sampleM3U8 = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
    const encodedUrl = encodeURIComponent(sampleM3U8);
    setTestUrl(sampleM3U8);
    setIframeSrc(`/s/${encodedUrl}`);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">嵌入功能测试</h1>
          <p className="text-slate-600">测试/s/[url]路由的嵌入功能</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">测试信息</h2>
          <div className="space-y-2">
            <p><strong>M3U8链接：</strong>{testUrl}</p>
            <p><strong>嵌入路径：</strong>{iframeSrc}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">嵌入预览</h2>
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              width="800"
              height="450"
              style={{ border: '1px solid #ccc', borderRadius: '8px' }}
              title="M3U8播放器嵌入测试"
            />
          )}
        </div>
      </div>
    </div>
  );
}