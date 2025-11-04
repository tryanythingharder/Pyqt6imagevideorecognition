import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

export function Statistics() {
  // 模拟数据
  const detectionsByDay = [
    { name: '周一', count: 245 },
    { name: '周二', count: 312 },
    { name: '周三', count: 189 },
    { name: '周四', count: 401 },
    { name: '周五', count: 356 },
    { name: '周六', count: 278 },
    { name: '周日', count: 190 },
  ];

  const detectionsByCategory = [
    { name: '人', value: 450, color: '#3b82f6' },
    { name: '汽车', value: 320, color: '#10b981' },
    { name: '自行车', value: 180, color: '#f59e0b' },
    { name: '动物', value: 95, color: '#8b5cf6' },
    { name: '其他', value: 226, color: '#6b7280' },
  ];

  const modelPerformance = [
    { name: 'YOLOv8-n', accuracy: 89, speed: 95 },
    { name: 'YOLOv8-s', accuracy: 92, speed: 78 },
    { name: 'YOLOv8-m', accuracy: 94, speed: 62 },
    { name: 'Faster R-CNN', accuracy: 88, speed: 45 },
  ];

  const hourlyDetections = [
    { hour: '00:00', count: 12 },
    { hour: '03:00', count: 8 },
    { hour: '06:00', count: 25 },
    { hour: '09:00', count: 89 },
    { hour: '12:00', count: 145 },
    { hour: '15:00', count: 167 },
    { hour: '18:00', count: 134 },
    { hour: '21:00', count: 78 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="mb-2">统计分析</h1>
        <p className="text-muted-foreground">查看检测数据的统计分析和趋势</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">总检测次数</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">2,271</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12.5% 较上周</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">平均准确率</span>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">91.2%</div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+2.3% 较上周</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">处理时长</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">15.4h</div>
          <div className="flex items-center text-sm text-red-600">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span>-5.1% 较上周</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">活跃模型</span>
            <Badge variant="default">4</Badge>
          </div>
          <div className="text-2xl mb-1">YOLOv8-n</div>
          <div className="text-sm text-muted-foreground">使用率 68%</div>
        </Card>
      </div>

      {/* 图表区域 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="categories">分类分析</TabsTrigger>
          <TabsTrigger value="performance">性能对比</TabsTrigger>
          <TabsTrigger value="timeline">时间趋势</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">每日检测数量</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={detectionsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">检测类别分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={detectionsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {detectionsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">各类别检测统计</h3>
            <div className="space-y-4">
              {detectionsByCategory.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>{category.name}</span>
                    <span>{category.value} 次</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(category.value / 450) * 100}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {detectionsByCategory.slice(0, 3).map((category) => (
              <Card key={category.name} className="p-6">
                <div className="text-sm text-muted-foreground mb-1">{category.name}</div>
                <div className="text-2xl mb-2">{category.value}</div>
                <div className="text-xs text-muted-foreground">
                  平均置信度: {(85 + Math.random() * 10).toFixed(1)}%
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">模型性能对比</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#3b82f6" name="准确率 (%)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="speed" fill="#10b981" name="速度评分" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelPerformance.map((model) => (
              <Card key={model.name} className="p-6">
                <h4 className="mb-4">{model.name}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>准确率</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>速度评分</span>
                      <span>{model.speed}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${model.speed}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">24小时检测趋势</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={hourlyDetections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="检测次数"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">高峰时段</div>
              <div className="text-2xl mb-2">15:00 - 18:00</div>
              <div className="text-xs text-muted-foreground">平均 156 次/小时</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">低峰时段</div>
              <div className="text-2xl mb-2">00:00 - 06:00</div>
              <div className="text-xs text-muted-foreground">平均 15 次/小时</div>
            </Card>

            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">周平均</div>
              <div className="text-2xl mb-2">324 次/天</div>
              <div className="text-xs text-muted-foreground">稳定增长趋势</div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
