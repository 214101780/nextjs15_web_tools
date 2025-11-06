'use client';

import { useState } from 'react';

export default function EmbedTestPage() {
  const [m3u8Url, setM3u8Url] = useState('');
  const [iframeCode, setIframeCode] = useState('');

  const generateIframeCode = () => {
    if (!m3u8Url.trim()) return;
    
    // URL编码M3U8链接
    const encodedUrl = encodeURIComponent(m3u8Url.trim());
    const iframeSrc = `http://localhost:3000/s/${encodedUrl}`;
    
    const code = `<iframe src="${iframeSrc}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
    setIframeCode(code);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">iframe嵌入测试</h1>
          <p className="text-slate-600">测试M3U8播放器的iframe嵌入功能</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">生成嵌入代码</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                M3U8链接：
              </label>
              <input
                type="text"
                value={m3u8Url}
                onChange={(e) => setM3u8Url(e.target.value)}
                placeholder="请输入M3U8文件链接"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={generateIframeCode}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              生成嵌入代码
            </button>
          </div>
        </div>

        {iframeCode && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">嵌入代码</h2>
            <div className="bg-slate-100 p-4 rounded-lg">
              <code className="text-sm block whitespace-pre-wrap">
                {iframeCode}
              </code>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">预览效果：</h3>
              <div 
                className="border-2 border-dashed border-slate-300 p-4 rounded-lg"
                dangerouslySetInnerHTML={{ __html: iframeCode }}
              />
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-3 text-slate-600">
            <p>1. 在上方输入M3U8链接并点击"生成嵌入代码"</p>
            <p>2. 复制生成的iframe代码到您的网站中</p>
            <p>3. 调整width和height属性以适应您的布局</p>
            <p>4. 在生产环境中，请将<code>localhost:3000</code>替换为您的实际域名</p>
          </div>
        </div>
      </div>
    </div>
  );
}