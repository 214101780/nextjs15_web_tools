"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navigationItems = [
  { name: "首页", href: "/", description: "返回主页" },
  { name: "文本拼接", href: "/text-join", description: "多行文本拼接工具" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 如果滚动距离小于50px，始终显示导航栏
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // 判断滚动方向
      if (currentScrollY > lastScrollY) {
        // 向下滚动 - 隐藏导航栏
        setIsVisible(false);
      } else {
        // 向上滚动 - 显示导航栏
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20">
          {/* Logo和品牌 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">T</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">Web工具集</span>
            </Link>
          </div>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`px-6 py-3 text-base font-medium transition-colors ${
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
            <Button variant="ghost" size="lg" className="text-slate-600 p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="md:hidden bg-white border-t border-slate-200">
        <div className="px-4 pt-3 pb-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                  {item.name}
                  <span className="block text-sm text-slate-500 mt-2">{item.description}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}