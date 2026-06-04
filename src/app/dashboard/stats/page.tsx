"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';

export default function StatsHubPage() {
  const { tasks } = useTasks();

  const completionData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'Active', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length },
  ];

  const effortData = tasks.map(t => ({
    name: t.name.length > 15 ? t.name.substring(0, 12) + '...' : t.name,
    effort: t.estimatedEffortHours,
  }));

  const COLORS = ['#845EF7', '#3BC9DB', '#FF8787', '#FAB005'];

  const totalEffort = tasks.reduce((acc, t) => acc + t.estimatedEffortHours, 0);
  const avgProgress = tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white">Performance Hub</h1>
            <p className="text-muted-foreground mt-2">Data-driven insights into your productivity</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-white/5">
              <CardHeader className="pb-2">
                <CardDescription>Total Tasks</CardDescription>
                <CardTitle className="text-3xl text-primary">{tasks.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass border-white/5">
              <CardHeader className="pb-2">
                <CardDescription>Total Effort (Hrs)</CardDescription>
                <CardTitle className="text-3xl text-accent">{totalEffort}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass border-white/5">
              <CardHeader className="pb-2">
                <CardDescription>Average Completion</CardDescription>
                <CardTitle className="text-3xl text-white">{Math.round(avgProgress)}%</CardTitle>
                <Progress value={avgProgress} className="h-1 mt-2 bg-white/5" />
              </CardHeader>
            </Card>
            <Card className="glass border-white/5">
              <CardHeader className="pb-2">
                <CardDescription>Urgent Items</CardDescription>
                <CardTitle className="text-3xl text-rose-400">{tasks.filter(t => t.priority === 'Critical').length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass border-white/5">
              <CardHeader>
                <CardTitle className="text-white font-headline">Task Status Distribution</CardTitle>
                <CardDescription>Visual breakdown of current lifecycle phases</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1625', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-white/5">
              <CardHeader>
                <CardTitle className="text-white font-headline">Effort Allocation</CardTitle>
                <CardDescription>Estimated hours per deliverable</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={effortData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(132, 94, 247, 0.1)' }}
                      contentStyle={{ backgroundColor: '#1A1625', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#845EF7' }}
                    />
                    <Bar 
                      dataKey="effort" 
                      fill="#845EF7" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
