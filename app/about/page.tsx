"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">关于我们</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            我们致力于提供简单易用的在线文本处理工具，帮助用户提高工作效率
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 项目介绍 */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>项目介绍</CardTitle>
              <CardDescription>Web工具集的开发理念</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-700">
                  Web工具集是一个专注于文本处理的在线工具平台，我们相信简单实用的工具能够为用户带来真正的价值。
                </p>
                <p className="text-slate-700">
                  我们的目标是打造一个无需安装、即开即用的工具集合，让用户能够快速完成各种文本处理任务。
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li>界面简洁直观，操作简单</li>
                  <li>功能实用，满足日常需求</li>
                  <li>响应式设计，支持多设备</li>
                  <li>数据安全，处理在本地完成</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>技术特点</CardTitle>
              <CardDescription>现代Web技术栈</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">前端技术</h3>
                  <p className="text-sm text-slate-600">基于Next.js、React、TypeScript和Tailwind CSS构建</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">响应式设计</h3>
                  <p className="text-sm text-slate-600">完美适配桌面端和移动端设备</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">性能优化</h3>
                  <p className="text-sm text-slate-600">快速加载，流畅的用户体验</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">数据安全</h3>
                  <p className="text-sm text-slate-600">所有处理都在本地完成，保护用户隐私</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工具列表 */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>可用工具</CardTitle>
            <CardDescription>当前提供的文本处理工具</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">文本拼接</h3>
                <p className="text-sm text-slate-600">多行文本拼接工具，支持自定义分隔符</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">文本转换</h3>
                <p className="text-sm text-slate-600">大小写转换，文本格式化处理</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">编码解码</h3>
                <p className="text-sm text-slate-600">Base64、URL编码解码工具</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <div className="mt-12 text-center">
          <Card className="border-slate-200 max-w-md mx-auto">
            <CardHeader>
              <CardTitle>联系我们</CardTitle>
              <CardDescription>如有问题或建议，欢迎反馈</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                我们持续改进工具功能，为用户提供更好的使用体验
              </p>
              <p className="text-sm text-slate-600">
                邮箱：contact@webtools.example.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}