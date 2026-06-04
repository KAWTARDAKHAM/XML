"use client"

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { differenceInDays, format, startOfMonth, addDays, isWithinInterval, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface GanttChartProps {
  tasks: Task[];
}

export function GanttChart({ tasks }: GanttChartProps) {
  const startDate = startOfMonth(new Date(2024, 4, 1)); // May 2024 for demo
  const days = Array.from({ length: 31 }, (_, i) => addDays(startDate, i));

  const getTaskStyle = (task: Task) => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    const startOffset = differenceInDays(start, startDate);
    const duration = differenceInDays(end, start) + 1;

    // Grid columns: 200px (header) + 31 days
    // CSS Grid columns start at 1. Header is col 1. First day is col 2.
    return {
      gridColumnStart: startOffset + 2,
      gridColumnEnd: startOffset + 2 + duration,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500 shadow-rose-500/20';
      case 'High': return 'bg-orange-500 shadow-orange-500/20';
      case 'Medium': return 'bg-indigo-500 shadow-indigo-500/20';
      default: return 'bg-cyan-500 shadow-cyan-500/20';
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-headline font-semibold text-white">Project Roadmap</h2>
          <p className="text-sm text-muted-foreground">Timeline view of all active deliverables</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-white/10 text-xs">May 2024</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="min-w-[1200px]">
          {/* Header row */}
          <div className="gantt-grid sticky top-0 z-10 glass border-b border-white/5">
            <div className="p-4 font-headline text-xs text-muted-foreground uppercase tracking-wider">Task Details</div>
            {days.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-2 text-center border-l border-white/5 text-[10px] font-medium flex flex-col items-center justify-center",
                  day.getDay() === 0 || day.getDay() === 6 ? "bg-white/[0.02]" : ""
                )}
              >
                <span className="text-muted-foreground">{format(day, 'EEE')}</span>
                <span className="text-white">{format(day, 'd')}</span>
              </div>
            ))}
          </div>

          {/* Task rows */}
          <div className="relative">
            {tasks.map((task) => (
              <div key={task.id} className="gantt-grid group border-b border-white/5 items-center">
                <div className="p-4 border-r border-white/5 overflow-hidden">
                  <h4 className="text-sm font-medium text-white truncate">{task.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority).split(' ')[0])} />
                    <span className="text-[10px] text-muted-foreground uppercase">{task.priority}</span>
                  </div>
                </div>
                
                {/* Visual Task Bar */}
                <div 
                  style={getTaskStyle(task)}
                  className="relative h-10 my-4 px-1"
                >
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-lg flex items-center px-3 text-[10px] font-bold text-white shadow-lg fluent-transition group-hover:scale-[1.02]",
                      getPriorityColor(task.priority)
                    )}
                  >
                    <div className="absolute left-0 top-0 bottom-0 bg-black/10 rounded-l-lg fluent-transition" style={{ width: `${task.progress}%` }} />
                    <span className="relative z-10 truncate">{task.progress}% Complete</span>
                  </div>
                </div>

                {/* Vertical grid lines background (hidden logic, visually simulated by days border-l) */}
              </div>
            ))}

            {/* Empty space lines */}
            <div className="absolute inset-0 pointer-events-none grid gantt-grid" style={{ zIndex: -1 }}>
              <div className="col-start-1 h-full border-r border-white/5" />
              {days.map((_, i) => (
                <div key={i} className="h-full border-r border-white/[0.03]" />
              ))}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
