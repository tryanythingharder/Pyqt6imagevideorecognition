import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';

interface VideoRecognitionProps {
  currentModel: string;
}

export function VideoRecognition({ currentModel }: VideoRecognitionProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [detectionStats, setDetectionStats] = useState({
    totalFrames: 0,
    processedFrames: 0,
    detectedObjects: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
      setIsPlaying(false);
      setDetectionStats({ totalFrames: 0, processedFrames: 0, detectedObjects: 0 });
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartDetection = () => {
    setIsProcessing(true);
    
    // 模拟视频处理
    setTimeout(() => {
      setDetectionStats({
        totalFrames: 450,
        processedFrames: 450,
        detectedObjects: 127,
      });
      setIsProcessing(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="mb-2">视频识别</h1>
        <p className="text-muted-foreground">上传视频文件进行逐帧目标检测分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：视频播放器 */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3>视频预览</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  上传视频
                </Button>
                {selectedVideo && !isProcessing && (
                  <Button size="sm" onClick={handleStartDetection}>
                    <Play className="mr-2 h-4 w-4" />
                    开始检测
                  </Button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {selectedVideo ? (
                <video
                  ref={videoRef}
                  src={selectedVideo}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">点击上传按钮选择视频</p>
                  <p className="text-xs text-muted-foreground mt-2">支持 MP4, AVI, MOV 格式</p>
                </div>
              )}
            </div>

            {selectedVideo && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground min-w-12">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    max={100}
                    step={0.1}
                    onValueChange={(value) => {
                      if (videoRef.current && duration) {
                        videoRef.current.currentTime = (value[0] / 100) * duration;
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground min-w-12">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span>正在使用 {currentModel} 处理视频...</span>
                  <span>42%</span>
                </div>
                <Progress value={42} />
                <p className="text-xs text-muted-foreground mt-2">
                  已处理 189/450 帧
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* 右侧：处理统计 */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="mb-4">处理统计</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">总帧数</div>
                <div className="text-2xl">{detectionStats.totalFrames}</div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">已处理帧</div>
                <div className="text-2xl">{detectionStats.processedFrames}</div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">检测到对象</div>
                <div className="text-2xl">{detectionStats.detectedObjects}</div>
              </div>

              {detectionStats.processedFrames > 0 && (
                <>
                  <div className="pt-4 border-t">
                    <h4 className="mb-3">检测类别分布</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>人</span>
                        <Badge variant="secondary">45</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>汽车</span>
                        <Badge variant="secondary">32</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>自行车</span>
                        <Badge variant="secondary">18</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>其他</span>
                        <Badge variant="secondary">32</Badge>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    导出检测报告
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
