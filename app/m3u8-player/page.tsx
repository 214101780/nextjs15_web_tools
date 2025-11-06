"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Play, Square, Download, RefreshCw, AlertTriangle } from "lucide-react";
import Hls from "hls.js";

export default function M3U8Player() {
  const [m3u8Url, setM3u8Url] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    segmentCount: number;
    hasExtM3U: boolean;
    hasExtInf: boolean;
    hasEndList: boolean;
    targetDuration: number | null;
    fileSize: number;
    lines: number;
    totalDuration: number;
    avgDuration: number;
    bandwidth: string | null;
    resolution: string | null;
    codecs: string | null;
    m3u8Content: string;
    // 新增分析字段
    maxBandwidth: string | null;
    minBandwidth: string | null;
    bandwidthCount: number;
    resolutions: string[];
    codecsList: string[];
    version: number | null;
    isVOD: boolean;
    isLive: boolean;
    audioTracks: string[];
    subtitleTracks: string[];
  } | null>(null);
  const [browserSupport, setBrowserSupport] = useState<{
    h264: boolean;
    h265: boolean;
    vp9: boolean;
    av1: boolean;
  } | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [autoIframeCode, setAutoIframeCode] = useState<string>('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInfo, setPlaybackInfo] = useState({
    duration: 0,
    currentTime: 0,
    buffered: 0
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // 添加缺失的corsStatus状态变量
  const [corsStatus, setCorsStatus] = useState<string>("unknown");

  // 示例M3U8链接 - 更新为可以直接播放的链接
  const exampleUrls = [
    {
      name: "示例1（公开测试）",
      url: "https://test-streams.mux.dev/x36xhzz/url_0/193039199_mp4_h264_aac_hd_7.m3u8"
    },
    {
      name: "示例2（公开测试）", 
      url: "https://test-streams.mux.dev/x36xhzz/url_4/193039199_mp4_h264_aac_7.m3u8"
    },
    {
      name: "示例3（短视频）",
      url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
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
    setIsPlaying(false);

    // 清理之前的HLS实例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    try {
      if (videoRef.current) {
        // 清除之前的错误状态
        videoRef.current.onerror = null;
        
        // 检查浏览器是否原生支持HLS
        if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // 原生支持HLS（Safari等）
          videoRef.current.src = m3u8Url;
          videoRef.current.load();
        } else if (Hls.isSupported()) {
          // 使用HLS.js库
          const hls = new Hls({
            enableWorker: false, // 禁用worker以避免跨域问题
            debug: false,
            xhrSetup: function(xhr) {
              xhr.withCredentials = false; // 禁用凭据
            }
          });
          
          hlsRef.current = hls;
          
          // 绑定HLS到video元素
          hls.attachMedia(videoRef.current);
          
          // 监听HLS事件
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log("HLS媒体已绑定");
            hls.loadSource(m3u8Url);
          });
          
          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            console.log("清单解析完成", data);
            setError(null);
            setIsLoading(false); // 添加这行：清单解析完成时停止加载状态
            videoRef.current?.play().then(() => {
              setIsPlaying(true);
            }).catch(err => {
              console.warn("自动播放失败:", err);
              setIsPlaying(false);
              setError("自动播放被阻止，请手动点击播放按钮");
            });
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            // 过滤掉非致命错误，避免控制台报空对象错误
            if (data.fatal) {
              console.error("HLS致命错误:", data);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError("网络错误，无法加载视频流");
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError("媒体错误，视频格式可能不支持");
                  break;
                default:
                  setError("HLS播放错误，请检查链接有效性");
                  break;
              }
              setIsLoading(false);
            } else {
              // 非致命错误，只记录不显示给用户
              console.warn("HLS非致命错误:", data);
            }
          });
          
          // 加载视频源
          hls.loadSource(m3u8Url);
        } else {
          setError("您的浏览器不支持HLS视频播放");
          setIsLoading(false);
          return;
        }
        
        // 监听视频错误事件
        videoRef.current.onerror = () => {
          console.error("视频播放错误:", videoRef.current?.error);
          const error = videoRef.current?.error;
          let errorMessage = "视频播放失败";
          
          if (error) {
            switch (error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = "视频加载被中止";
                break;
              case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = "网络错误，请检查网络连接";
                break;
              case MediaError.MEDIA_ERR_DECODE:
                errorMessage = "视频解码错误，可能是编码格式不支持";
                break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = "视频格式不支持，请检查编码格式";
                break;
              default:
                errorMessage = `播放错误: ${error.message || '未知错误'}`;
            }
          }
          
          setError(errorMessage);
          setIsPlaying(false);
          setIsLoading(false);
        };
        
        // 监听视频可以播放事件
        videoRef.current.oncanplay = () => {
          console.log("视频可以播放");
          setError(null);
          // 如果是原生HLS支持，在这里停止加载状态
          if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
            setIsLoading(false);
          }
        };
        
        // 监听视频开始播放事件
        videoRef.current.onplay = () => {
          setIsPlaying(true);
          setIsLoading(false); // 确保播放时停止加载状态
        };
        
        // 设置超时检测
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState < 2 && !isPlaying) {
            console.warn("视频加载超时");
            setError("视频加载超时，可能是网络问题或服务器响应慢");
            setIsLoading(false);
          }
        }, 15000); // 15秒超时
      }
      
      // 异步分析M3U8文件（不影响播放）
      setTimeout(async () => {
        try {
          await analyzeM3U8(m3u8Url);
        } catch (err) {
          console.warn("M3U8文件分析失败:", err);
        }
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "播放失败");
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    // 清理HLS实例
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const handleExampleClick = (url: string) => {
    setM3u8Url(url);
  };

  // 检测浏览器视频格式支持
  useEffect(() => {
    // 检测浏览器支持的视频编码格式
    const detectBrowserSupport = () => {
      const video = document.createElement('video');
      const support = {
        h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '',
        h265: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '',
        vp9: video.canPlayType('video/webm; codecs="vp9"') !== '',
        av1: video.canPlayType('video/webm; codecs="av01.0.05M.08"') !== '',
      };
      setBrowserSupport(support);
    };

    detectBrowserSupport();
  }, []);
// 设置域名
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  // 自动生成iframe代码
  useEffect(() => {
    if (m3u8Url.trim()) {
      const encodedUrl = encodeURIComponent(m3u8Url);
      const iframeCode = `<iframe src="${domain || 'https://您的域名'}/s/${encodedUrl}" allowfullscreen></iframe>`;
      setAutoIframeCode(iframeCode);
    } else {
      setAutoIframeCode('');
    }
  }, [m3u8Url, domain]);

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
      
      // 清理HLS实例
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);



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
      
      // 分析码率信息 - 增强分析
      const bandwidthMatches = text.matchAll(/#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+)/g);
      const bandwidths: number[] = [];
      for (const match of bandwidthMatches) {
        bandwidths.push(parseInt(match[1]));
      }
      const maxBandwidth = bandwidths.length > 0 ? Math.max(...bandwidths) : null;
      const minBandwidth = bandwidths.length > 0 ? Math.min(...bandwidths) : null;
      
      // 分析分辨率 - 增强分析
      const resolutionMatches = text.matchAll(/#EXT-X-STREAM-INF:.*RESOLUTION=(\d+x\d+)/g);
      const resolutions: string[] = [];
      for (const match of resolutionMatches) {
        resolutions.push(match[1]);
      }
      
      // 分析编码信息 - 增强分析
      const codecsMatches = text.matchAll(/#EXT-X-STREAM-INF:.*CODECS="([^"]+)"/g);
      const codecsList: string[] = [];
      for (const match of codecsMatches) {
        codecsList.push(match[1]);
      }
      
      // 分析视频类型（VOD或直播）
      const isVOD = text.includes('#EXT-X-ENDLIST');
      const isLive = text.includes('#EXT-X-PLAYLIST-TYPE:EVENT') || (!isVOD && text.includes('#EXT-X-MEDIA-SEQUENCE'));
      
      // 分析音频信息
      const audioMatches = text.matchAll(/#EXT-X-MEDIA:TYPE=AUDIO.*NAME="([^"]+)"/g);
      const audioTracks: string[] = [];
      for (const match of audioMatches) {
        audioTracks.push(match[1]);
      }
      
      // 分析字幕信息
      const subtitleMatches = text.matchAll(/#EXT-X-MEDIA:TYPE=SUBTITLES.*NAME="([^"]+)"/g);
      const subtitleTracks: string[] = [];
      for (const match of subtitleMatches) {
        subtitleTracks.push(match[1]);
      }
      
      // 分析版本信息
      const versionMatch = text.match(/#EXT-X-VERSION:(\d+)/);
      const version = versionMatch ? parseInt(versionMatch[1]) : null;
      
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
        bandwidth: maxBandwidth ? `${Math.round(maxBandwidth / 1000)} kbps` : null,
        resolution: resolutions.length > 0 ? resolutions[0] : null,
        codecs: codecsList.length > 0 ? codecsList[0] : null,
        m3u8Content: text, // 显示全部内容
        // 新增分析字段
        maxBandwidth: maxBandwidth ? `${Math.round(maxBandwidth / 1000000)} Mbps` : null,
        minBandwidth: minBandwidth ? `${Math.round(minBandwidth / 1000)} kbps` : null,
        bandwidthCount: bandwidths.length,
        resolutions: resolutions,
        codecsList: codecsList,
        version: version,
        isVOD: isVOD,
        isLive: isLive,
        audioTracks: audioTracks,
        subtitleTracks: subtitleTracks
      });
    } catch (err) {
      throw new Error("M3U8文件解析失败");
    }
  };



  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 检查视频编解码器支持
  const checkVideoCodecSupport = (codecs: string | null): { supported: boolean; message: string } => {
    if (!codecs) return { supported: true, message: '未知编码格式' };
    
    // 检查H.264支持
    if (codecs.includes('avc1')) {
      return { supported: true, message: 'H.264编码 (广泛支持)' };
    }
    
    // 检查H.265支持
    if (codecs.includes('hev1') || codecs.includes('hvc1')) {
      return { supported: false, message: 'H.265编码 (部分浏览器不支持)' };
    }
    
    // 检查VP9支持
    if (codecs.includes('vp09')) {
      return { supported: true, message: 'VP9编码 (现代浏览器支持)' };
    }
    
    // 检查AV1支持
    if (codecs.includes('av01')) {
      return { supported: true, message: 'AV1编码 (较新浏览器支持)' };
    }
    
    return { supported: false, message: `不支持的编码格式: ${codecs}` };
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
                  >
                    您的浏览器不支持视频播放
                  </video>
                  
                  {/* 加载状态 */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <div className="text-lg">加载中...</div>
                        <div className="text-sm text-slate-300">正在分析文件结构</div>
                      </div>
                    </div>
                  )}
                  

                  
                  {/* 视频播放失败状态 */}
                  {error && !isLoading && (
                    <div className="absolute inset-0 bg-orange-900 bg-opacity-70 flex items-center justify-center">
                      <div className="text-white text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-lg">播放失败</div>
                        <div className="text-sm max-w-xs">{error}</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 text-white border-white hover:bg-white hover:text-orange-900"
                          onClick={handlePlay}
                        >
                          重试播放
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* 视频就绪但未播放状态 */}
                  {!isLoading && !error && !isPlaying && videoRef.current?.readyState && videoRef.current.readyState >= 2 && (
                    <div className="absolute inset-0 bg-blue-900 bg-opacity-80 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Play className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-lg font-semibold">视频已加载</div>
                        <div className="text-sm text-blue-100 mb-3">点击播放按钮开始播放</div>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="mt-3 bg-white text-blue-900 border-white hover:bg-blue-100 hover:text-blue-800 font-medium"
                          onClick={() => videoRef.current?.play()}
                        >
                          开始播放
                        </Button>
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
                    {(analysisResult.targetDuration || analysisResult.bandwidth || analysisResult.resolution || analysisResult.version || analysisResult.bandwidthCount > 0) && (
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
                          
                          {/* 码率信息 */}
                          {analysisResult.maxBandwidth && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">最高码率</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.maxBandwidth}
                              </Badge>
                            </div>
                          )}
                          {analysisResult.minBandwidth && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">最低码率</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.minBandwidth}
                              </Badge>
                            </div>
                          )}
                          {analysisResult.bandwidthCount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">码率档位</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.bandwidthCount} 个
                              </Badge>
                            </div>
                          )}
                          
                          {/* 分辨率信息 */}
                          {analysisResult.resolutions.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">分辨率档位</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.resolutions.length} 个
                              </Badge>
                            </div>
                          )}
                          {analysisResult.resolution && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">默认分辨率</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.resolution}
                              </Badge>
                            </div>
                          )}

                          {/* 编码信息 */}
                          {analysisResult.codecs && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">编码格式</span>
                              <Badge variant="default" className={
                                checkVideoCodecSupport(analysisResult.codecs).supported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }>
                                {checkVideoCodecSupport(analysisResult.codecs).message}
                              </Badge>
                            </div>
                          )}
                          {analysisResult.codecsList.length > 1 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">编码档位</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                {analysisResult.codecsList.length} 个
                              </Badge>
                            </div>
                          )}
                          
                          {/* 版本信息 */}
                          {analysisResult.version && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">HLS版本</span>
                              <Badge variant="default" className="bg-purple-100 text-purple-800">
                                v{analysisResult.version}
                              </Badge>
                            </div>
                          )}
                          
                          {/* 视频类型 */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm">视频类型</span>
                            <Badge variant="default" className={
                              analysisResult.isVOD ? 'bg-green-100 text-green-800' : 
                              analysisResult.isLive ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                              {analysisResult.isVOD ? '点播视频' : analysisResult.isLive ? '直播流' : '未知类型'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 浏览器支持信息 */}
                    {browserSupport && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">浏览器支持</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">H.264 (AVC)</span>
                            <Badge variant="default" className={browserSupport.h264 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {browserSupport.h264 ? '✓ 支持' : '✗ 不支持'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">H.265 (HEVC)</span>
                            <Badge variant="default" className={browserSupport.h265 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {browserSupport.h265 ? '✓ 支持' : '⚠ 部分支持'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">VP9</span>
                            <Badge variant="default" className={browserSupport.vp9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {browserSupport.vp9 ? '✓ 支持' : '⚠ 部分支持'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">AV1</span>
                            <Badge variant="default" className={browserSupport.av1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {browserSupport.av1 ? '✓ 支持' : '⚠ 部分支持'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 音轨和字幕信息 */}
                    {(analysisResult.audioTracks.length > 0 || analysisResult.subtitleTracks.length > 0) && (
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 mb-2">音轨和字幕</h4>
                        <div className="space-y-2">
                          {analysisResult.audioTracks.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">音频轨道</span>
                              <Badge variant="default" className="bg-indigo-100 text-indigo-800">
                                {analysisResult.audioTracks.length} 个
                              </Badge>
                            </div>
                          )}
                          {analysisResult.subtitleTracks.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">字幕轨道</span>
                              <Badge variant="default" className="bg-indigo-100 text-indigo-800">
                                {analysisResult.subtitleTracks.length} 个
                              </Badge>
                            </div>
                          )}
                          {analysisResult.audioTracks.length > 0 && (
                            <div className="text-xs text-indigo-600">
                              音频轨道: {analysisResult.audioTracks.join(', ')}
                            </div>
                          )}
                          {analysisResult.subtitleTracks.length > 0 && (
                            <div className="text-xs text-indigo-600">
                              字幕轨道: {analysisResult.subtitleTracks.join(', ')}
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
                          完整内容 ({analysisResult.m3u8Content.length} 字符)
                        </Badge>
                      </div>
                      <pre className="text-xs bg-slate-100 p-3 rounded-lg max-h-64 overflow-auto border">
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

        {/* 嵌入功能说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>嵌入功能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 自动生成iframe代码 */}
              <div>
                <h3 className="font-semibold mb-2">自动生成嵌入代码</h3>
                <p className="text-sm text-slate-600 mb-3">
                  输入M3U8链接后，系统会自动为您生成对应的iframe嵌入代码：
                </p>
                {autoIframeCode ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg relative">
                    <code className="text-xs block whitespace-pre-wrap text-green-800">
                      {autoIframeCode}
                    </code>
                    <button 
                      onClick={(event) => {
                        navigator.clipboard.writeText(autoIframeCode);
                        // 显示复制成功提示
                        const button = event.currentTarget as HTMLButtonElement;
                        const originalText = button.textContent;
                        button.textContent = '已复制!';
                        setTimeout(() => {
                          button.textContent = originalText;
                        }, 2000);
                      }}
                      className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      复制代码
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-100 p-3 rounded-lg text-center">
                    <p className="text-sm text-slate-500">
                      请在输入框中输入M3U8链接，系统将自动生成嵌入代码
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">iframe嵌入模板</h3>
                <p className="text-sm text-slate-600 mb-3">
                  您也可以手动使用以下模板代码：
                </p>
                <div className="bg-slate-100 p-3 rounded-lg relative">
                  <code className="text-xs block whitespace-pre-wrap">
                    {`<iframe src="${domain || 'https://您的域名'}/s/`}
                    <span className="text-blue-600">[M3U8链接]</span>
                    {`" allowfullscreen></iframe>`}
                  </code>
                  <button 
                    onClick={(event) => {
                      const iframeCode = `<iframe src="${domain || 'https://您的域名'}/s/[M3U8链接]" allowfullscreen></iframe>`;
                      navigator.clipboard.writeText(iframeCode);
                      // 显示复制成功提示
                      const button = event.currentTarget as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = '已复制!';
                      setTimeout(() => {
                        button.textContent = originalText;
                      }, 2000);
                    }}
                    className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    复制模板
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  注意：请将 [M3U8链接] 替换为实际的M3U8文件URL，并确保URL经过URL编码。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">示例</h3>
                <p className="text-sm text-slate-600">
                  例如，要嵌入一个M3U8文件，可以使用：
                </p>
                <div className="bg-slate-100 p-3 rounded-lg mt-2 relative">
                  <code className="text-xs block whitespace-pre-wrap">
                    {`<iframe src="${domain || 'https://您的域名'}/s/https%3A%2F%2Fexample.com%2Fvideo.m3u8" allowfullscreen></iframe>`}
                  </code>
                  <button 
                    onClick={(event) => {
                      const iframeCode = `<iframe src="${domain || 'https://您的域名'}/s/https%3A%2F%2Fexample.com%2Fvideo.m3u8" allowfullscreen></iframe>`;
                      navigator.clipboard.writeText(iframeCode);
                      // 显示复制成功提示
                      const button = event.currentTarget as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = '已复制!';
                      setTimeout(() => {
                        button.textContent = originalText;
                      }, 2000);
                    }}
                    className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    复制示例
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">功能特点</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 自适应播放器尺寸</li>
                  <li>• 支持全屏播放</li>
                  <li>• 自动处理跨域问题</li>
                  <li>• 响应式设计，适配移动设备</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}