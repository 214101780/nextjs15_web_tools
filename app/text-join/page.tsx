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
  const [prefix, setPrefix] = useState('"');
  const [suffix, setSuffix] = useState('"');
  const [result, setResult] = useState("");
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({show: false, message: '', type: 'success'});

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
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Toast 通知 - 顶部展示 */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600" />
          )}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">文本拼接工具</h1>
          <p className="text-slate-600 text-sm">将多行文本快速拼接成一行</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
          {/* 输入区域 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="input-text" className="text-sm font-semibold">
                输入多行文本
              </Label>
              <div className="relative">
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="请输入多行文本，每行一个项目..."
                  className="min-h-[100px] resize-y text-sm border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                  rows={4}
                />
                <div className="absolute bottom-1 right-1 text-xs text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                  {characterCount} 字符 / {lineCount} 行
                </div>
              </div>
            </div>

            {/* 配置区域 - 紧凑布局 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="delimiter" className="text-xs font-medium text-slate-600">
                  连接符
                </Label>
                <Input
                  id="delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  placeholder=","
                  className="text-sm h-8 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prefix" className="text-xs font-medium text-slate-600">
                  前缀
                </Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder='"'
                  className="text-sm h-8 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="suffix" className="text-xs font-medium text-slate-600">
                  后缀
                </Label>
                <Input
                  id="suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder='"'
                  className="text-sm h-8 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* 预设按钮和操作按钮 */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  onClick={handlePreset1}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  ,
                </Button>
                <Button
                  onClick={handlePreset2}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  ","
                </Button>
              </div>
              <Button 
                onClick={handleJoinText}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                拼接
              </Button>
            </div>
          </div>

          {/* 结果区域 */}
          <div className="space-y-1">
            <Label htmlFor="result" className="text-sm font-semibold text-slate-700">
              拼接结果
            </Label>
            <div className="relative">
              <Textarea
                id="result"
                value={result}
                readOnly
                placeholder="拼接结果将显示在这里..."
                className="min-h-[80px] resize-y text-sm bg-slate-50 border-slate-300"
                rows={3}
              />
              {result && (
                <div className="absolute bottom-1 right-1 text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {result.length} 字符
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮组 */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleCopyResult}
              disabled={!result}
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Copy className="w-3 h-3 mr-1" />
              复制
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="px-3 py-1.5 text-sm font-medium border-slate-300 hover:border-slate-400 text-slate-700"
              size="sm"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              清空
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}