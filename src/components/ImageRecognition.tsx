import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, Play, Download, Trash2, ZoomIn } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

interface ImageRecognitionProps {
  currentModel: string;
}

interface DetectionResult {
  label: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
}

export function ImageRecognition({ currentModel }: ImageRecognitionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResults([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = () => {
    setIsProcessing(true);
    
    // 模拟检测过程
    setTimeout(() => {
      const mockResults: DetectionResult[] = [
        { label: '人', confidence: 0.95, bbox: { x: 100, y: 50, w: 150, h: 300 } },
        { label: '汽车', confidence: 0.88, bbox: { x: 300, y: 200, w: 200, h: 150 } },
        { label: '自行车', confidence: 0.76, bbox: { x: 150, y: 280, w: 80, h: 120 } },
      ];
      setDetectionResults(mockResults);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="mb-2">图片识别</h1>
        <p className="text-muted-foreground">上传图片进行目标检测与识别分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：图片展示区 */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3>图片预览</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  上传图片
                </Button>
                {selectedImage && (
                  <>
                    <Button
                      size="sm"
                      onClick={handleDetection}
                      disabled={isProcessing}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {isProcessing ? '检测中...' : '开始检测'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        setDetectionResults([]);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">点击上传按钮选择图片</p>
                  <p className="text-xs text-muted-foreground mt-2">支持 JPG, PNG, WebP 格式</p>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span>正在使用 {currentModel} 处理...</span>
                  <span>65%</span>
                </div>
                <Progress value={65} />
              </div>
            )}
          </Card>
        </div>

        {/* 右侧：检测结果 */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="mb-4">检测结果</h3>
            
            {detectionResults.length > 0 ? (
              <>
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span>检测对象数</span>
                    <span>{detectionResults.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>平均置信度</span>
                    <span>
                      {(detectionResults.reduce((acc, r) => acc + r.confidence, 0) / detectionResults.length * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {detectionResults.map((result, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span>{result.label}</span>
                          <Badge variant="secondary">
                            {(result.confidence * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={result.confidence * 100} className="h-2" />
                        <div className="mt-2 text-xs text-muted-foreground">
                          位置: ({result.bbox.x}, {result.bbox.y})
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    导出结果
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>暂无检测结果</p>
                <p className="text-xs mt-2">上传图片并点击"开始检测"</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
