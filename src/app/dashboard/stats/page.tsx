
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Activity, Target, Clock, TrendingUp } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function StatsHubPage() {
  const { tasks } = useTasks();

  // 1. Weekly Progress Tracking (Simulation for the last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const progressHistory = last7Days.map((day, index) => {
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    // Simulation d'une progression historique
    const dayCompleted = Math.max(0, completedCount - (6 - index));
    
    return {
      date: format(day, 'EEE'),
      total: total,
      completed: dayCompleted,
    };
  });

  const totalEffort = tasks.reduce((acc, t) => acc + (t.estimatedEffortHours || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overallProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Données pour le diagramme circulaire
  const radialData = [
    {
      name: 'Completion',
      value: overallProgress,
      fill: 'hsl(var(--primary))',
    }
  ];

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
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <Activity size={20} className="text-primary animate-pulse" />
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
              <p className="text-sm text-muted-foreground">Invested Effort</p>
              <h3 className="text-3xl font-bold mt-1">{totalEffort}h</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Total Project Scope</p>
            </div>

            <div className="glass p-6 rounded-[2rem] glass-hover border-purple-500/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Active Units</p>
              <h3 className="text-3xl font-bold mt-1">{tasks.length}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Synchronized Nodes</p>
            </div>

            <div className="glass p-6 rounded-[2rem] glass-hover border-emerald-500/10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Activity size={20} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Status</p>
              <h3 className="text-3xl font-bold mt-1 uppercase text-emerald-400">Stable</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Neural Link Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Diagramme Circulaire - Overall Goal */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-white font-headline text-2xl">Global Progress</CardTitle>
                <CardDescription>Current completion status against architecture goals</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                   <span className="text-5xl font-bold text-white">{overallProgress}%</span>
                   <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">Complete</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="70%" 
                    outerRadius="100%" 
                    barSize={20} 
                    data={radialData}
                    startAngle={90}
                    endAngle={450}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={15}
                      fill="hsl(var(--primary))"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Progress Tracker (Area Chart) */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white font-headline text-2xl">Weekly Activity</CardTitle>
                    <CardDescription>Task nodes activity for the current cycle</CardDescription>
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
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorCompleted)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Legend / Status Bar */}
          <div className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center border-primary/5">
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-headline font-bold">System Insights</h4>
              <p className="text-sm text-muted-foreground">
                The completion rate of <b>{overallProgress}%</b> is currently within the optimal range. Weekly velocity is consistent with project scope. 
                AI recommendation: Focus on high-priority nodes to maintain the 14% improvement index.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-4 rounded-[1.5rem] bg-primary/10 border border-primary/10 flex flex-col items-center">
                <span className="text-[10px] uppercase text-primary/60 font-bold mb-1">Architecture</span>
                <span className="text-primary font-bold">SECURE</span>
              </div>
              <div className="px-6 py-4 rounded-[1.5rem] bg-accent/10 border border-accent/10 flex flex-col items-center">
                <span className="text-[10px] uppercase text-accent/60 font-bold mb-1">Pipeline</span>
                <span className="text-accent font-bold">SYNCED</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
