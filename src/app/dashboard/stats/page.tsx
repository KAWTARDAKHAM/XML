"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Activity, Target, Zap, Clock } from 'lucide-react';

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
  const avgProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white">Performance Analytics</h1>
            <p className="text-muted-foreground mt-2">Deeper insights into project velocity and resource allocation</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <Target className="text-primary w-5 h-5" />
                <span className="text-[10px] text-emerald-400">+12% vs last month</span>
              </div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-3xl font-bold">{avgProgress}%</h3>
              <Progress value={avgProgress} className="h-1 mt-2 bg-white/5" />
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <Clock className="text-accent w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground">Total Invested Effort</p>
              <h3 className="text-3xl font-bold">{totalEffort}h</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Estimated workload</p>
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <Zap className="text-yellow-400 w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <h3 className="text-3xl font-bold">{tasks.filter(t => t.status === 'in-progress').length}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">In pipeline</p>
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <Activity className="text-rose-400 w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground">Critical Path</p>
              <h3 className="text-3xl font-bold">{tasks.filter(t => t.priority === 'Critical').length}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Blocking issues</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-white font-headline">Status Lifecycle</CardTitle>
                <CardDescription>Breakdown of current task phases</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={130}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1A1625', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-white font-headline">Effort Distribution</CardTitle>
                <CardDescription>Hour estimates by deliverable</CardDescription>
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
                      contentStyle={{ backgroundColor: '#1A1625', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      itemStyle={{ color: '#845EF7' }}
                    />
                    <Bar 
                      dataKey="effort" 
                      fill="#845EF7" 
                      radius={[8, 8, 0, 0]} 
                      barSize={45}
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