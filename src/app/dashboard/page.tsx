"use client"

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { GanttChart } from '@/components/dashboard/gantt-chart';
import { AIOptimizer } from '@/components/dashboard/ai-optimizer';
import { TaskDialog } from '@/components/dashboard/task-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Plus, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { tasks, updateTask, addTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const criticalTasks = tasks.filter(t => t.priority === 'Critical').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalEffort = tasks.reduce((sum, t) => sum + (t.estimatedEffortHours || 0), 0);

  const handleTaskSubmit = (data: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast({ title: "Task Updated", description: "Node parameters successfully re-synchronized." });
    } else {
      addTask(data as Omit<Task, 'id'>);
      toast({ title: "Task Initialized", description: "New project node added to the pipeline." });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ variant: "destructive", title: "Task Deleted", description: "Node permanently removed from architecture." });
  };

  const stats = [
    { title: "Total Scope", value: totalTasks, sub: `${totalEffort} hrs effort`, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Completed", value: completedTasks, sub: `${completionRate}% Success`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Active", value: inProgressTasks, sub: "In Pipeline", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Critical", value: criticalTasks, sub: "Requires Attention", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      
      <main className="flex-1 pl-20 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                Workspace Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                You have {inProgressTasks} active nodes under optimization.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input 
                  placeholder="Search project nodes..." 
                  className="pl-10 w-72 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 focus:border-primary/40 h-11" 
                />
              </div>
              <Button size="icon" variant="outline" className="rounded-xl glass border-white/10 h-11 w-11">
                <Bell size={20} />
              </Button>
              <Button 
                onClick={() => { setEditingTask(null); setIsDialogOpen(true); }}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6 font-semibold shadow-lg shadow-primary/20 h-11"
              >
                <Plus size={18} className="mr-2" /> New Task
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass p-6 rounded-[2rem] glass-hover flex items-center gap-5">
                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <AIOptimizer tasks={tasks} onApply={(suggestions) => console.log(suggestions)} />

          <div className="h-[600px]">
            <GanttChart 
              tasks={tasks} 
              onEditTask={handleEdit}
              onDeleteTask={handleDelete}
            />
          </div>

        </div>
      </main>

      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
      />
    </div>
  );
}
