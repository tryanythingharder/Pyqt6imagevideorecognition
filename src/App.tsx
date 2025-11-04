import { useState } from 'react';
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from './components/ui/sidebar';
import { ImageRecognition } from './components/ImageRecognition';
import { VideoRecognition } from './components/VideoRecognition';
import { ModelManagement } from './components/ModelManagement';
import { RealtimeDetection } from './components/RealtimeDetection';
import { Statistics } from './components/Statistics';
import { Image, Video, Brain, Camera, BarChart3, Settings } from 'lucide-react';

type ViewType = 'image' | 'video' | 'model' | 'realtime' | 'statistics';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('image');
  const [currentModel, setCurrentModel] = useState('YOLOv8-nano');

  const renderView = () => {
    switch (currentView) {
      case 'image':
        return <ImageRecognition currentModel={currentModel} />;
      case 'video':
        return <VideoRecognition currentModel={currentModel} />;
      case 'model':
        return <ModelManagement currentModel={currentModel} onModelChange={setCurrentModel} />;
      case 'realtime':
        return <RealtimeDetection currentModel={currentModel} />;
      case 'statistics':
        return <Statistics />;
      default:
        return <ImageRecognition currentModel={currentModel} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2>AI检测系统</h2>
                <p className="text-xs text-muted-foreground">智能识别平台</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentView('image')}
                  isActive={currentView === 'image'}
                >
                  <Image className="h-4 w-4" />
                  <span>图片识别</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentView('video')}
                  isActive={currentView === 'video'}
                >
                  <Video className="h-4 w-4" />
                  <span>视频识别</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentView('realtime')}
                  isActive={currentView === 'realtime'}
                >
                  <Camera className="h-4 w-4" />
                  <span>实时检测</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentView('statistics')}
                  isActive={currentView === 'statistics'}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>统计分析</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentView('model')}
                  isActive={currentView === 'model'}
                >
                  <Settings className="h-4 w-4" />
                  <span>模型管理</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              <div>当前模型: <span className="text-foreground">{currentModel}</span></div>
              <div className="mt-1">状态: <span className="text-green-600">就绪</span></div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto bg-background">
          {renderView()}
        </main>
      </div>
    </SidebarProvider>
  );
}
