"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { GanttChart } from '@/components/dashboard/gantt-chart';
import { useTasks } from '@/hooks/use-tasks';
import { AIOptimizer } from '@/components/dashboard/ai-optimizer';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export default function DashboardPage() {
  const { tasks, isLoading } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="pl-20 md:pl-20 transition-all duration-300 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Project Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your tasks with XML-powered precision</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="glass border-white/5 hover:bg-white/5 text-white rounded-xl">
                <Download size={18} className="mr-2" /> Export XML
              </Button>
              <Button className="bg-primary hover:bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20">
                <Plus size={18} className="mr-2" /> New Task
              </Button>
            </div>
          </header>

          <AIOptimizer tasks={tasks} onApply={() => {}} />

          <section className="h-[600px]">
            {isLoading ? (
              <div className="glass rounded-2xl h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <GanttChart tasks={tasks} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
