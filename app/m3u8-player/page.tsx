"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Play, Square, Download, RefreshCw, AlertTriangle } from "lucide-react";

export default function M3U8Player() {
  const [m3u8Url, setM3u8Url] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [corsStatus, setCorsStatus] = useState<"unknown" | "checking" | "allowed" | "blocked">("unknown");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInfo, setPlaybackInfo] = useState({
    duration: 0,
    currentTime: 0,
    buffered: 0
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // 示例M3U8链接
  const exampleUrls = [
    {
      name: "示例1（公开测试）",
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    },
    {
      name: "示例2（公开测试）", 
      url: "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
    }
  ];

  const handlePlay = async () => {
    if (!m3u8Url.trim()) {
      setError("请输入M3U8视频链接");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysisResult(null);
    setCorsStatus("checking");
    setIsPlaying(false);

    try {
      // 检查CORS
      await checkCors(m3u8Url);
      
      // 分析M3U8文件
      await analyzeM3U8(m3u8Url);
      
      // 设置视频源
      if (videoRef.current) {
        videoRef.current.src = m3u8Url;
        videoRef.current.load();
        
        // 等待视频加载后自动播放
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play().then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.warn("自动播放失败:", err);
          });
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "播放失败");
      setCorsStatus("unknown");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleExampleClick = (url: string) => {
    setM3u8Url(url);
  };

  // 视频事件监听
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlaybackInfo = () => {
      setPlaybackInfo({
        duration: video.duration || 0,
        currentTime: video.currentTime || 0,
        buffered: video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0
      });
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);
    const handleTimeUpdate = () => updatePlaybackInfo();
    const handleLoadedMetadata = () => updatePlaybackInfo();

    video.addEventListener('play', handlePlayEvent);
    video.addEventListener('pause', handlePauseEvent);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlayEvent);
      video.removeEventListener('pause', handlePauseEvent);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const checkCors = async (url: string) => {
    try {
      setCorsStatus("checking");
      
      // 尝试多种请求方法来检测跨域
      const corsHeaders = {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      };
      
      // 方法1: 尝试OPTIONS预检请求
      try {
        const optionsResponse = await fetch(url, {
          method: 'OPTIONS',
          mode: 'cors',
          headers: corsHeaders
        });
        
        if (optionsResponse.ok) {
          const acao = optionsResponse.headers.get('Access-Control-Allow-Origin');
          const acam = optionsResponse.headers.get('Access-Control-Allow-Methods');
          
          if (acao === '*' || acao === window.location.origin) {
            setCorsStatus("allowed");
            return;
          }
        }
      } catch (optionsErr) {
        // OPTIONS请求失败，继续尝试其他方法
      }
      
      // 方法2: 尝试GET请求
      try {
        const getResponse = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (getResponse.ok) {
          const acao = getResponse.headers.get('Access-Control-Allow-Origin');
          if (acao === '*' || acao === window.location.origin) {
            setCorsStatus("allowed");
            return;
          }
        }
      } catch (getErr) {
        // GET请求失败
      }
      
      // 方法3: 尝试HEAD请求
      try {
        const headResponse = await fetch(url, {
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (headResponse.ok) {
          const acao = headResponse.headers.get('Access-Control-Allow-Origin');
          if (acao === '*' || acao === window.location.origin) {
            setCorsStatus("allowed");
            return;
          }
        }
      } catch (headErr) {
        // HEAD请求失败
      }
      
      // 如果所有方法都失败，则判断为跨域被阻止
      setCorsStatus("blocked");
      
    } catch (err) {
      setCorsStatus("blocked");
      throw new Error("跨域请求被阻止，视频可能无法正常播放");
    }
  };

  const analyzeM3U8 = async (url: string) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      const lines = text.split('\n').filter(line => line.trim());
      const segmentLines = lines.filter(line => line.trim() && !line.startsWith('#'));
      const segmentCount = segmentLines.length;
      
      // 详细分析M3U8文件结构
      const hasExtM3U = text.includes('#EXTM3U');
      const hasExtInf = text.includes('#EXTINF');
      const hasEndList = text.includes('#EXT-X-ENDLIST');
      const targetDurationMatch = text.match(/#EXT-X-TARGETDURATION:(\d+)/);
      const targetDuration = targetDurationMatch ? parseInt(targetDurationMatch[1]) : null;
      
      // 分析分片时长
      const extInfMatches = text.match(/#EXTINF:([\d.]+)/g);
      const durations: number[] = [];
      if (extInfMatches) {
        for (const match of extInfMatches) {
          const durationMatch = match.match(/#EXTINF:([\d.]+)/);
          if (durationMatch && durationMatch[1]) {
            durations.push(parseFloat(durationMatch[1]));
          }
        }
      }
      const totalDuration = durations.reduce((sum, dur) => sum + dur, 0);
      const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0;
      
      // 分析码率信息
      const bandwidthMatch = text.match(/#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+)/);
      const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1]) : null;
      
      // 分析分辨率
      const resolutionMatch = text.match(/#EXT-X-STREAM-INF:.*RESOLUTION=(\d+x\d+)/);
      const resolution = resolutionMatch ? resolutionMatch[1] : null;
      
      // 分析编码信息
      const codecsMatch = text.match(/#EXT-X-STREAM-INF:.*CODECS="([^"]+)"/);
      const codecs = codecsMatch ? codecsMatch[1] : null;
      
      setAnalysisResult({
        segmentCount,
        hasExtM3U,
        hasExtInf,
        hasEndList,
        targetDuration,
        fileSize: text.length,
        lines: lines.length,
        totalDuration: Math.round(totalDuration),
        avgDuration: Math.round(avgDuration * 10) / 10,
        bandwidth: bandwidth ? `${Math.round(bandwidth / 1000)} kbps` : null,
        resolution,
        codecs,
        m3u8Content: text.substring(0, 1000) + (text.length > 1000 ? '...' : '')
      });
    } catch (err) {
      throw new Error("M3U8文件解析失败");
    }
  };

  const getCorsStatusText = () => {
    switch (corsStatus) {
      case "allowed": return "允许跨域";
      case "blocked": return "跨域被阻止";
      case "checking": return "检查中...";
      default: return "未检查";
    }
  };

  const getCorsStatusColor = () => {
    switch (corsStatus) {
      case "allowed": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      case "checking": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 重新分析M3U8文件
  const handleReanalyze = async () => {
    if (!m3u8Url) return;
    try {
      setIsLoading(true);
      setError(null);
      await analyzeM3U8(m3u8Url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "重新分析失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">M3U8视频播放器</h1>
          <p className="text-lg text-slate-600">在线播放和分析M3U8格式视频流</p>
        </div>

        {/* 示例链接 */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex flex-wrap gap-2">
              <span>快速测试：</span>
              {exampleUrls.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example.url)}
                  className="text-xs"
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>视频链接</CardTitle>
            <CardDescription>输入M3U8视频文件的URL地址</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                type="url"
                placeholder="请输入M3U8视频链接..."
                value={m3u8Url}
                onChange={(e) => setM3u8Url(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handlePlay()}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handlePlay} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {isLoading ? "加载中..." : "播放"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleStop}
                  disabled={!isPlaying}
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  停止
                </Button>
                {analysisResult && (
                  <Button 
                    variant="outline" 
                    onClick={handleReanalyze}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新分析
                  </Button>
                )}
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 视频播放器 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>视频播放</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getCorsStatusColor()}>
                      {getCorsStatusText()}
                    </Badge>
                    {playbackInfo.duration > 0 && (
                      <Badge variant="outline">
                        {Math.floor(playbackInfo.currentTime)} / {Math.floor(playbackInfo.duration)}秒
                      </Badge>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  {analysisResult?.resolution && `分辨率: ${analysisResult.resolution}`}
                  {analysisResult?.bandwidth && ` • 码率: ${analysisResult.bandwidth}`}
                  {analysisResult?.codecs && ` • 编码: ${analysisResult.codecs}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full h-full"
                    onError={() => setError("视频播放失败，请检查链接是否正确")}
                  >
                    您的浏览器不支持视频播放
                  </video>
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <div className="text-lg">加载中...</div>
                        <div className="text-sm text-slate-300">正在检测跨域和分析文件结构</div>
                      </div>
                    </div>
                  )}
                  {corsStatus === "blocked" && (
                    <div className="absolute inset-0 bg-red-900 bg-opacity-70 flex items-center justify-center">
                      <div className="text-white text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-lg">跨域被阻止</div>
                        <div className="text-sm">视频服务器未设置CORS头</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 自定义进度条 */}
                {playbackInfo.duration > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{formatTime(playbackInfo.currentTime)}</span>
                      <span>{formatTime(playbackInfo.duration)}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(playbackInfo.currentTime / playbackInfo.duration) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>播放进度</span>
                      <span>缓冲: {Math.round((playbackInfo.buffered / playbackInfo.duration) * 100)}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 分析结果 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>文件分析</span>
                  {analysisResult && (
                    <Badge variant="outline" className="text-xs">
                      分析完成
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>M3U8文件结构分析结果</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-4">
                    {/* 基本信息卡片 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">基本信息</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-600">分片数量</p>
                          <p className="text-lg font-bold text-blue-900">{analysisResult.segmentCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600">文件大小</p>
                          <p className="text-lg font-bold text-blue-900">{analysisResult.fileSize} 字符</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600">总时长</p>
                          <p className="text-lg font-bold text-blue-900">{analysisResult.totalDuration}秒</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600">平均分片时长</p>
                          <p className="text-lg font-bold text-blue-900">{analysisResult.avgDuration}秒</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 文件结构验证 */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">文件结构验证</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">M3U8标识</span>
                          <Badge variant={analysisResult.hasExtM3U ? "default" : "secondary"}>
                            {analysisResult.hasExtM3U ? "✓ 有效" : "✗ 缺失"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">分片信息</span>
                          <Badge variant={analysisResult.hasExtInf ? "default" : "secondary"}>
                            {analysisResult.hasExtInf ? "✓ 存在" : "✗ 缺失"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">结束标识</span>
                          <Badge variant={analysisResult.hasEndList ? "default" : "secondary"}>
                            {analysisResult.hasEndList ? "✓ 完整" : "✗ 直播流"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* 媒体信息 */}
                    {(analysisResult.targetDuration || analysisResult.bandwidth || analysisResult.resolution) && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">媒体信息</h4>
                        <div className="space-y-2">
                          {analysisResult.targetDuration && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">目标时长</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.targetDuration}秒
                              </Badge>
                            </div>
                          )}
                          {analysisResult.bandwidth && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">码率</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.bandwidth}
                              </Badge>
                            </div>
                          )}
                          {analysisResult.resolution && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">分辨率</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.resolution}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* M3U8内容预览 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-600 font-medium">M3U8内容预览</p>
                        <Badge variant="outline" className="text-xs">
                          前{Math.min(analysisResult.m3u8Content.length, 1000)}字符
                        </Badge>
                      </div>
                      <pre className="text-xs bg-slate-100 p-3 rounded-lg max-h-32 overflow-auto border">
                        {analysisResult.m3u8Content}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">请输入M3U8链接并点击播放进行分析</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">M3U8格式说明</h3>
                <p className="text-sm text-slate-600">
                  M3U8是HLS（HTTP Live Streaming）协议使用的播放列表格式，它将视频分割成多个小文件（分片），便于网络传输和播放。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">跨域问题</h3>
                <p className="text-sm text-slate-600">
                  如果视频服务器未设置CORS（跨域资源共享）头，浏览器会阻止视频播放。
                  本工具会自动检测跨域状态，并提供相应的提示。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">分片分析</h3>
                <p className="text-sm text-slate-600">
                  工具会解析M3U8文件结构，显示分片数量、文件大小、目标时长等信息，
                  帮助您了解视频流的质量和结构。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}