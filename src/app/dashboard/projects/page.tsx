"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Layers, Box, Terminal, Globe, Shield } from 'lucide-react';

export default function ProjectsPage() {
  const { tasks } = useTasks();

  const projectModules = [
    { 
      name: "Core Infrastructure", 
      icon: Box, 
      color: "text-blue-400", 
      count: tasks.filter(t => t.name.toLowerCase().includes('engine') || t.name.toLowerCase().includes('core')).length,
      health: 94
    },
    { 
      name: "AI Framework", 
      icon: Terminal, 
      color: "text-purple-400", 
      count: tasks.filter(t => t.name.toLowerCase().includes('ai')).length,
      health: 68
    },
    { 
      name: "User Interface", 
      icon: Layers, 
      color: "text-emerald-400", 
      count: tasks.filter(t => t.name.toLowerCase().includes('ui') || t.name.toLowerCase().includes('gantt')).length,
      health: 82
    },
    { 
      name: "Security Protocols", 
      icon: Shield, 
      color: "text-rose-400", 
      count: tasks.filter(t => t.priority === 'Critical' || t.name.toLowerCase().includes('security')).length,
      health: 45
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white">Project Matrix</h1>
            <p className="text-muted-foreground mt-2">Global health monitoring of architectural nodes</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectModules.map((module, i) => (
              <Card key={i} className="glass border-white/5 rounded-[2.5rem] overflow-hidden group">
                <CardHeader className="flex flex-row items-center gap-6 p-8">
                  <div className={cn("p-5 rounded-[1.5rem] bg-white/5 group-hover:scale-110 fluent-transition", module.color)}>
                    <module.icon size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <CardTitle className="text-2xl font-headline">{module.name}</CardTitle>
                      <Badge className="bg-white/5 border-none text-muted-foreground">{module.count} Nodes</Badge>
                    </div>
                    <CardDescription>Active synchronization status: {module.health}%</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      <span>Integrity Health</span>
                      <span>{module.health}%</span>
                    </div>
                    <Progress value={module.health} className="h-2 bg-white/5 overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", 
                          module.health > 80 ? "bg-emerald-500" : module.health > 50 ? "bg-yellow-500" : "bg-rose-500"
                        )} 
                        style={{ width: `${module.health}%` }} 
                      />
                    </Progress>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Status</p>
                      <p className={cn("text-xs font-bold", module.health > 50 ? "text-emerald-400" : "text-rose-400")}>
                        {module.health > 80 ? "Stable" : module.health > 50 ? "Optimal" : "Degraded"}
                      </p>
                    </div>
                    <div className="text-center border-x border-white/5 px-4">
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Uptime</p>
                      <p className="text-xs font-bold text-white">99.9%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">Nodes</p>
                      <p className="text-xs font-bold text-white">{module.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass border-white/5 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] -z-10 rounded-full" />
            <h2 className="text-3xl font-headline font-bold mb-4">Architecture Insights</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Your project matrix is currently operating within expected parameters. AI-driven optimization has improved node delivery speed by 14.2% this cycle.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
