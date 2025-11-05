"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">关于我们</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            我们致力于提供简单易用的在线文本处理工具，帮助用户提高工作效率
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* 项目介绍 */}
          <Card className="border-slate-200 p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">项目介绍</CardTitle>
              <CardDescription className="text-base">Web工具集的开发理念</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <p className="text-slate-700 text-base leading-relaxed">
                  Web工具集是一个专注于文本处理的在线工具平台，我们相信简单实用的工具能够为用户带来真正的价值。
                </p>
                <p className="text-slate-700 text-base leading-relaxed">
                  我们的目标是打造一个无需安装、即开即用的工具集合，让用户能够快速完成各种文本处理任务。
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-3 text-base">
                  <li>界面简洁直观，操作简单</li>
                  <li>功能实用，满足日常需求</li>
                  <li>响应式设计，支持多设备</li>
                  <li>数据安全，处理在本地完成</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card className="border-slate-200 p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">技术特点</CardTitle>
              <CardDescription className="text-base">现代Web技术栈</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 text-lg">前端技术</h3>
                  <p className="text-slate-600 text-base leading-relaxed">基于Next.js、React、TypeScript和Tailwind CSS构建</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 text-lg">响应式设计</h3>
                  <p className="text-slate-600 text-base leading-relaxed">完美适配桌面端和移动端设备</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 text-lg">性能优化</h3>
                  <p className="text-slate-600 text-base leading-relaxed">快速加载，流畅的用户体验</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3 text-lg">数据安全</h3>
                  <p className="text-slate-600 text-base leading-relaxed">所有处理都在本地完成，保护用户隐私</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工具列表 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">可用工具</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 text-center p-6">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <CardTitle className="text-xl">文本拼接</CardTitle>
                <CardDescription className="text-base">多行文本拼接工具，支持自定义分隔符</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-slate-200 text-center p-6">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <CardTitle className="text-xl">文本转换</CardTitle>
                <CardDescription className="text-base">大小写转换，文本格式化处理</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-slate-200 text-center p-6">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-xl">编码解码</CardTitle>
                <CardDescription className="text-base">Base64、URL编码解码工具</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">联系我们</h2>
          <div className="max-w-lg mx-auto">
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              如果您有任何问题或建议，欢迎通过以下方式联系我们
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" size="lg" className="px-6">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                邮箱
              </Button>
              <Button variant="outline" size="lg" className="px-6">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                反馈
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}