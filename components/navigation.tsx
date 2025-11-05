"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "首页", href: "/", description: "返回主页" },
  { name: "文本拼接", href: "/text-join", description: "多行文本拼接工具" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo和品牌 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Web工具集</span>
            </Link>
          </div>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex md:hidden items-center">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="md:hidden bg-white border-t border-slate-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                  {item.name}
                  <span className="block text-xs text-slate-500 mt-1">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}