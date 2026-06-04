
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Activity, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function StatsHubPage() {
  const { tasks } = useTasks();

  // 1. Effort Distribution Data (Matching the provided image)
  const effortData = tasks.map(t => ({
    name: t.name.length > 12 ? t.name.substring(0, 10) + '...' : t.name,
    effort: t.estimatedEffortHours,
  })).sort((a, b) => b.effort - a.effort);

  // 2. Weekly Progress Tracking (Simulation for the last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const progressHistory = last7Days.map((day, index) => {
    // Simulated historical data based on current tasks
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    // We mock a progression: earlier days had fewer tasks completed
    const dayCompleted = Math.max(0, completedCount - (6 - index));
    const percentage = total > 0 ? Math.round((dayCompleted / total) * 100) : 0;
    
    return {
      date: format(day, 'EEE'),
      total: total,
      completed: dayCompleted,
      percentage: percentage
    };
  });

  const totalEffort = tasks.reduce((acc, t) => acc + (t.estimatedEffortHours || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overallProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Performance Analytics</h1>
              <p className="text-muted-foreground mt-2">Neural progress tracking and workload distribution</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Overall Integrity</p>
                <p className="text-2xl font-bold text-primary">{overallProgress}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
              </div>
            </div>
          </header>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-[2rem] glass-hover border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Target size={20} />
                </div>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded-full">+12% Gain</span>
              </div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <h3 className="text-3xl font-bold mt-1">{overallProgress}%</h3>
              <Progress value={overallProgress} className="h-1 mt-4 bg-white/5" />
            </div>

            <div className="glass p-6 rounded-[2rem] glass-hover border-accent/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                  <Clock size={20} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total Invested Effort</p>
              <h3 className="text-3xl font-bold mt-1">{totalEffort}h</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Active Architecture</p>
            </div>

            <div className="glass p-6 rounded-[2rem] glass-hover border-purple-500/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Velocity Index</p>
              <h3 className="text-3xl font-bold mt-1">4.2</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Tasks per cycle</p>
            </div>

            <div className="glass p-6 rounded-[2rem] glass-hover border-rose-500/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                  <Activity size={20} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <h3 className="text-3xl font-bold mt-1">{tasks.length}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Synchronized</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Progress Tracker (New Chart) */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white font-headline text-2xl">Weekly Progress Tracker</CardTitle>
                    <CardDescription>Daily task completion & success percentage</CardDescription>
                  </div>
                  <div className="flex gap-4 text-[10px] uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Total</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Completed</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] pr-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressHistory}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#4b5563" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                      contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPercentage)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Effort Distribution Chart (Matching image) */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-white font-headline text-2xl">Effort Distribution</CardTitle>
                <CardDescription>Hour estimates by deliverable (Sorted by magnitude)</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] pr-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={effortData} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#4b5563" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(132, 94, 247, 0.05)' }}
                      contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                      itemStyle={{ color: '#845EF7' }}
                    />
                    <Bar 
                      dataKey="effort" 
                      fill="#845EF7" 
                      radius={[12, 12, 4, 4]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Productivity Legend */}
          <div className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center border-primary/5">
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-headline font-bold">Optimization Summary</h4>
              <p className="text-sm text-muted-foreground">
                Your current architectural velocity is optimal. The completion rate of <b>{overallProgress}%</b> indicates a healthy delivery pipeline. 
                AI suggestions have reduced the critical path bottleneck by <b>14.2%</b>.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="p-4 rounded-[1.5rem] bg-emerald-500/10 flex flex-col items-center">
                <span className="text-[10px] uppercase text-emerald-400/60 font-bold mb-1">Status</span>
                <span className="text-emerald-400 font-bold">STABLE</span>
              </div>
              <div className="p-4 rounded-[1.5rem] bg-primary/10 flex flex-col items-center">
                <span className="text-[10px] uppercase text-primary/60 font-bold mb-1">Sync</span>
                <span className="text-primary font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
