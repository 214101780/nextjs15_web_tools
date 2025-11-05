"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Play, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function TextJoinTool() {
  const [inputText, setInputText] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [result, setResult] = useState("");
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({show: false, message: '', type: 'success'});
  const [showPresets, setShowPresets] = useState(false);

  const handleJoinText = () => {
    if (!inputText.trim()) {
      setResult("");
      return;
    }

    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const joinedText = lines.map(line => `${prefix}${line.trim()}${suffix}`).join(delimiter);
    setResult(joinedText);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    
    try {
      // 首先尝试使用现代 Clipboard API
      await navigator.clipboard.writeText(result);
      showToast("复制成功！结果已复制到剪贴板", "success");
    } catch (err) {
      // 如果 Clipboard API 失败，尝试使用传统的 document.execCommand 方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = result;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          showToast("复制成功！结果已复制到剪贴板", "success");
        } else {
          throw new Error('execCommand failed');
        }
      } catch (fallbackErr) {
        // 如果所有方法都失败，提供手动复制选项
        showToast("复制失败！文本过大，请手动选择并复制", "error");
        
        // 自动选中结果文本，方便用户手动复制
        const resultElement = document.getElementById('result');
        if (resultElement) {
          (resultElement as HTMLTextAreaElement).select();
        }
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({show: true, message, type});
    setTimeout(() => setToast({show: false, message: '', type: 'success'}), 3000);
  };

  const handleClearAll = () => {
    setInputText("");
    setResult("");
    showToast("内容已清空", "success");
  };

  const handlePreset1 = () => {
    setDelimiter(",");
    setPrefix("");
    setSuffix("");
    showToast("已设置为逗号分隔模式", "success");
  };

  const handlePreset2 = () => {
    setDelimiter('","');
    setPrefix('"');
    setSuffix('"');
    showToast("已设置为双引号逗号分隔模式", "success");
  };

  // 统计有效字符（不包含换行符、空格等空白字符）
  const characterCount = inputText.replace(/\s/g, '').length;
  const lineCount = inputText.split('\n').filter(line => line.trim() !== '').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Toast 通知 - 顶部展示 */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-3 p-4 rounded-xl shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600" />
          )}
          <span className="font-medium text-base">{toast.message}</span>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">文本拼接工具</h1>
          <p className="text-slate-600 text-lg">将多行文本快速拼接成一行</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
          {/* 1. 输入多行文本 */}
          <div className="space-y-3">
            <Label htmlFor="input-text" className="text-lg font-semibold text-slate-800">
              输入多行文本
            </Label>
            <div className="relative">
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入多行文本，每行一个项目..."
                className="min-h-[150px] resize-y text-base border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors rounded-lg"
                rows={6}
              />
              <div className="absolute bottom-3 right-3 text-sm text-slate-500 bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200">
                {characterCount} 字符 / {lineCount} 行
              </div>
            </div>
          </div>

          {/* 2. 预设模式 - 默认折叠 */}
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              onClick={() => setShowPresets(!showPresets)}
            >
              <Label className="text-lg font-semibold text-slate-800 mb-0">
                预设模式
              </Label>
              <span className="text-slate-500 text-sm">
                {showPresets ? '收起' : '展开'}
              </span>
            </div>
            {showPresets && (
              <div className="flex space-x-4 pt-2">
                <Button
                  onClick={handlePreset1}
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-6 border-slate-300"
                >
                  逗号分隔模式
                </Button>
                <Button
                  onClick={handlePreset2}
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-6 border-slate-300"
                >
                  双引号逗号分隔模式
                </Button>
              </div>
            )}
          </div>

          {/* 3. 配置区域 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="delimiter" className="text-base font-medium text-slate-700">
                连接字符串
              </Label>
              <Input
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                placeholder=""
                className="text-base h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix" className="text-base font-medium text-slate-700">
                前缀字符串
              </Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder=""
                className="text-base h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix" className="text-base font-medium text-slate-700">
                后缀字符串
              </Label>
              <Input
                id="suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder=""
                className="text-base h-12 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
              />
            </div>
          </div>

          {/* 4. 拼接按钮 - 靠左对齐，与底部按钮尺寸一致 */}
          <div className="flex justify-start">
            <Button 
              onClick={handleJoinText}
              className="px-6 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white h-12"
              size="lg"
            >
              开始拼接
            </Button>
          </div>

          {/* 5. 拼接结果展示区域 */}
          <div className="space-y-3">
            <Label htmlFor="result" className="text-lg font-semibold text-slate-800">
              拼接结果
            </Label>
            <div className="relative">
              <Textarea
                id="result"
                value={result}
                readOnly
                placeholder="拼接结果将显示在这里..."
                className="min-h-[120px] resize-y text-base bg-slate-50 border-slate-300 rounded-lg"
                rows={5}
              />
              {result && (
                <div className="absolute bottom-3 right-3 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  {result.length} 字符
                </div>
              )}
            </div>
          </div>

          {/* 6. 底部按钮组 - 复制靠左，清空靠右 */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <Button
              onClick={handleCopyResult}
              disabled={!result}
              className="px-6 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white h-12"
              size="lg"
            >
              <Copy className="w-5 h-5 mr-2" />
              复制结果
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="px-6 py-3 text-base font-medium border-slate-300 hover:border-slate-400 text-slate-700 h-12"
              size="lg"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              清空所有
            </Button>
          </div>
        </div>

        {/* 用法介绍 - 使用标题结构 */}
        <div className="mt-12 text-slate-700 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">文本拼接工具使用指南</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">工具简介</h3>
              <p className="text-slate-600 leading-relaxed">
                文本拼接工具是一款专业的在线多行文本拼接服务，支持自定义分隔符、前缀和后缀设置。
                能够快速将列表、数组、多行文本转换为单行格式，适用于编程、数据处理、文本整理等多种场景。
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">主要功能</h3>
              <ul className="text-slate-600 leading-relaxed space-y-2">
                <li>• 支持自定义连接字符串、前缀字符串和后缀字符串</li>
                <li>• 提供逗号分隔、双引号逗号分隔等预设模式</li>
                <li>• 实时字符统计和行数统计</li>
                <li>• 一键复制拼接结果</li>
                <li>• 所有处理均在浏览器本地完成，确保数据安全</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">适用场景</h3>
              <ul className="text-slate-600 leading-relaxed space-y-2">
                <li>• SQL语句拼接：将列表数据转换为IN语句格式</li>
                <li>• 数组格式化：将多行文本转换为数组格式</li>
                <li>• CSV数据处理：生成CSV格式的字符串</li>
                <li>• 文本批量处理：快速整理多行文本</li>
                <li>• 代码生成：生成特定格式的代码片段</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}