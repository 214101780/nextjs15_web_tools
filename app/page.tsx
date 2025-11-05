import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "文本拼接工具",
    description: "将多行文本快速拼接成一行，支持自定义分隔符、前缀和后缀",
    href: "/text-join",
    icon: "📝",
    features: ["多行文本输入", "智能字符统计", "预设模式", "实时预览"]
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 英雄区域 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Web工具集
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              提供专业的在线文本处理工具，简单易用，功能强大，满足您的各种文本处理需求
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/text-join">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  开始使用
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">精选工具</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            我们提供多种实用的文本处理工具，每个工具都经过精心设计，确保简单易用且功能强大
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={tool.href}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    立即使用
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 特性介绍 */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">快速高效</h3>
              <p className="text-slate-600">所有工具都在本地处理，无需等待，即时获得结果</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">数据安全</h3>
              <p className="text-slate-600">所有处理都在浏览器本地完成，数据不会上传到服务器</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">专业精准</h3>
              <p className="text-slate-600">每个工具都经过精心设计和测试，确保结果的准确性</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}