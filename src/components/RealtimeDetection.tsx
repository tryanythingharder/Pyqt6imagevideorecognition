import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Camera, CameraOff, Settings2, Circle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface RealtimeDetectionProps {
  currentModel: string;
}

interface Detection {
  id: string;
  label: string;
  confidence: number;
  timestamp: string;
}

export function RealtimeDetection({ currentModel }: RealtimeDetectionProps) {
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState([50]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // 清理摄像头流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsActive(true);
      
      // 模拟实时检测
      const detectionInterval = setInterval(() => {
        const mockDetection: Detection = {
          id: Date.now().toString(),
          label: ['人', '汽车', '猫', '狗', '自行车'][Math.floor(Math.random() * 5)],
          confidence: 0.6 + Math.random() * 0.4,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        setDetections(prev => [mockDetection, ...prev.slice(0, 19)]);
        setFps(Math.floor(25 + Math.random() * 10));
      }, 1000);

      return () => clearInterval(detectionInterval);
    } catch (error) {
      console.error('无法访问摄像头:', error);
      alert('无法访问摄像头，请检查权限设置');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setFps(0);
  };

  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="mb-2">实时检测</h1>
        <p className="text-muted-foreground">使用摄像头进行实时目标检测</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：摄像头画面 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3>摄像头画面</h3>
                {isActive && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Circle className="mr-1 h-2 w-2 fill-current" />
                    实时检测中
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={toggleCamera}
                  variant={isActive ? 'destructive' : 'default'}
                >
                  {isActive ? (
                    <>
                      <CameraOff className="mr-2 h-4 w-4" />
                      停止检测
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      开始检测
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {isActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">点击"开始检测"启动摄像头</p>
                </div>
              )}
              
              {isActive && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  FPS: {fps}
                </div>
              )}
            </div>

            {isActive && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground mb-1">当前模型</div>
                  <div>{currentModel}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground mb-1">检测延迟</div>
                  <div>23ms</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-muted-foreground mb-1">总检测数</div>
                  <div>{detections.length}</div>
                </div>
              </div>
            )}
          </Card>

          {/* 设置面板 */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="h-5 w-5" />
              <h3>检测设置</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="bounding-box">显示边界框</Label>
                <Switch
                  id="bounding-box"
                  checked={showBoundingBox}
                  onCheckedChange={setShowBoundingBox}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>置信度阈值</Label>
                  <span className="text-sm text-muted-foreground">
                    {confidenceThreshold[0]}%
                  </span>
                </div>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={100}
                  step={5}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="save-frames">保存检测帧</Label>
                <Switch id="save-frames" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="audio-alert">声音警报</Label>
                <Switch id="audio-alert" />
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧：检测记录 */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="mb-4">检测记录</h3>
            
            {detections.length > 0 ? (
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {detections.map((detection) => (
                    <div
                      key={detection.id}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div>{detection.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {detection.timestamp}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {(detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>暂无检测记录</p>
                <p className="text-xs mt-2">开始检测后将显示实时记录</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
