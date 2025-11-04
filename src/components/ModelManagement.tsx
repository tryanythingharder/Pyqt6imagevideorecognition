import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Check, 
  Download, 
  Trash2, 
  HardDrive,
  Cpu,
  Clock,
  Zap
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Model {
  id: string;
  name: string;
  version: string;
  size: string;
  accuracy: number;
  speed: string;
  status: 'active' | 'inactive' | 'loading';
  lastUsed: string;
  framework: string;
}

interface ModelManagementProps {
  currentModel: string;
  onModelChange: (modelName: string) => void;
}

export function ModelManagement({ currentModel, onModelChange }: ModelManagementProps) {
  const [models, setModels] = useState<Model[]>([
    {
      id: '1',
      name: 'YOLOv8-nano',
      version: 'v8.0.1',
      size: '6.2 MB',
      accuracy: 37.3,
      speed: '80 FPS',
      status: 'active',
      lastUsed: '2分钟前',
      framework: 'PyTorch',
    },
    {
      id: '2',
      name: 'YOLOv8-small',
      version: 'v8.0.1',
      size: '22.5 MB',
      accuracy: 44.9,
      speed: '50 FPS',
      status: 'inactive',
      lastUsed: '1小时前',
      framework: 'PyTorch',
    },
    {
      id: '3',
      name: 'YOLOv8-medium',
      version: 'v8.0.1',
      size: '49.7 MB',
      accuracy: 50.2,
      speed: '30 FPS',
      status: 'inactive',
      lastUsed: '3小时前',
      framework: 'PyTorch',
    },
    {
      id: '4',
      name: 'Faster R-CNN',
      version: 'v1.0',
      size: '102 MB',
      accuracy: 42.1,
      speed: '15 FPS',
      status: 'inactive',
      lastUsed: '1天前',
      framework: 'TensorFlow',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);

  const handleModelSwitch = (modelId: string, modelName: string) => {
    setModels(models.map(m => ({
      ...m,
      status: m.id === modelId ? 'active' : 'inactive'
    })));
    onModelChange(modelName);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // 添加新模型
          const newModel: Model = {
            id: Date.now().toString(),
            name: 'Custom-Model',
            version: 'v1.0.0',
            size: '15.8 MB',
            accuracy: 45.6,
            speed: '45 FPS',
            status: 'inactive',
            lastUsed: '刚刚',
            framework: 'PyTorch',
          };
          setModels([...models, newModel]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (modelId: string) => {
    setModels(models.filter(m => m.id !== modelId));
    setModelToDelete(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="mb-2">模型管理</h1>
        <p className="text-muted-foreground">管理和切换不同的AI检测模型</p>
      </div>

      {/* 上传区域 */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">上传新模型</h3>
            <p className="text-sm text-muted-foreground">
              支持 .pt, .onnx, .tflite 格式的模型文件
            </p>
          </div>
          <Button onClick={handleUpload} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? '上传中...' : '选择文件'}
          </Button>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>正在上传模型...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
      </Card>

      {/* 模型列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3>{model.name}</h3>
                  {model.status === 'active' && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="mr-1 h-3 w-3" />
                      使用中
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {model.version} · {model.framework}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>{model.size}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span>mAP {model.accuracy}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>{model.speed}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{model.lastUsed}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {model.status === 'active' ? (
                <Button variant="outline" className="flex-1" disabled>
                  当前使用
                </Button>
              ) : (
                <Button 
                  className="flex-1"
                  onClick={() => handleModelSwitch(model.id, model.name)}
                >
                  切换使用
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setModelToDelete(model.id)}
                disabled={model.status === 'active'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!modelToDelete} onOpenChange={() => setModelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除模型</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该模型文件，删除后无法恢复。确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => modelToDelete && handleDelete(modelToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
