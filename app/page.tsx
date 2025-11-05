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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Web工具集
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              提供专业的在线文本处理工具，简单易用，功能强大，满足您的各种文本处理需求
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/text-join">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  开始使用
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 px-8 py-3 text-lg">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">精选工具</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            我们提供多种实用的文本处理工具，每个工具都经过精心设计，确保简单易用且功能强大
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow duration-300 border-slate-200 p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <CardTitle className="text-2xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3 mb-8">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-base text-slate-600">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={tool.href}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">快速高效</h3>
              <p className="text-slate-600 text-base leading-relaxed">所有工具都在本地处理，无需等待，即时获得结果</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">数据安全</h3>
              <p className="text-slate-600 text-base leading-relaxed">所有处理都在浏览器本地完成，数据不会上传到服务器</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">专业精准</h3>
              <p className="text-slate-600 text-base leading-relaxed">每个工具都经过精心设计和测试，确保结果的准确性</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}