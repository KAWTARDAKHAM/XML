
"use client"

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { differenceInDays, format, startOfMonth, addDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface GanttChartProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

export function GanttChart({ tasks, onEditTask, onDeleteTask }: GanttChartProps) {
  const startDate = startOfMonth(new Date(2024, 4, 1)); // May 2024
  const days = Array.from({ length: 31 }, (_, i) => addDays(startDate, i));

  const getTaskBarStyle = (task: Task) => {
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    
    const safeStart = isNaN(start.getTime()) ? startDate : start;
    const safeEnd = isNaN(end.getTime()) ? addDays(startDate, 1) : end;

    const startOffset = Math.max(0, differenceInDays(safeStart, startDate));
    const duration = Math.max(1, differenceInDays(safeEnd, safeStart) + 1);

    return {
      gridColumnStart: startOffset + 2, 
      gridColumnEnd: startOffset + 2 + duration,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/80 border-rose-400 shadow-rose-500/20';
      case 'High': return 'bg-orange-500/80 border-orange-400 shadow-orange-500/20';
      case 'Medium': return 'bg-indigo-500/80 border-indigo-400 shadow-indigo-500/20';
      default: return 'bg-cyan-500/80 border-cyan-400 shadow-cyan-500/20';
    }
  };

  return (
    <div className="glass rounded-[2rem] overflow-hidden h-full flex flex-col border-white/5 shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div>
          <h2 className="text-xl font-headline font-semibold text-foreground">Project Roadmap</h2>
          <p className="text-sm text-muted-foreground">Architecture node synchronization timeline</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-white/10 text-xs px-4 py-1 rounded-full bg-white/5 text-primary">May 2024 Cycle</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="min-w-fit">
          {/* Header row: Tasks Label + Days */}
          <div className="gantt-grid sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="p-4 font-headline text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-r border-white/5 flex items-center">
              Active Project Nodes
            </div>
            {days.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-2 text-center border-l border-white/5 text-[10px] font-medium flex flex-col items-center justify-center min-h-[70px]",
                  day.getDay() === 0 || day.getDay() === 6 ? "bg-white/[0.03]" : ""
                )}
              >
                <span className="text-muted-foreground opacity-60 uppercase mb-1">{format(day, 'EEE')}</span>
                <span className="text-foreground text-lg font-bold">{format(day, 'd')}</span>
              </div>
            ))}
          </div>

          {/* Task rows */}
          <div className="relative">
            {tasks.map((task) => (
              <div key={task.id} className="gantt-grid group border-b border-white/5 items-center hover:bg-white/[0.02] fluent-transition">
                {/* Task Node Information (Left Side) */}
                <div className="p-5 border-r border-white/5 overflow-hidden flex items-center justify-between sticky left-0 bg-background/50 backdrop-blur-sm z-10">
                  <div className="truncate flex-1">
                    <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{task.name}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn(
                        "w-2 h-2 rounded-full", 
                        task.priority === 'Critical' ? "bg-rose-500" : task.priority === 'High' ? "bg-orange-500" : "bg-blue-500"
                      )} />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
                        {task.priority} • {task.estimatedEffortHours}h
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 fluent-transition hover:bg-white/5">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-white/10">
                      <DropdownMenuItem onClick={() => onEditTask?.(task)} className="text-xs">
                        <Edit2 size={12} className="mr-2" /> Edit Node
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteTask?.(task.id)} className="text-xs text-rose-500 focus:text-rose-500">
                        <Trash2 size={12} className="mr-2" /> Terminate Node
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Visual Task Bar (Right Side Timeline) */}
                <div 
                  style={getTaskBarStyle(task)}
                  className="relative h-12 my-4 px-2"
                >
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-2xl border flex items-center px-4 text-[10px] font-black text-white shadow-xl fluent-transition group-hover:scale-[1.01] overflow-hidden",
                      getPriorityColor(task.priority)
                    )}
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-1000 ease-out" 
                      style={{ width: `${task.progress}%` }} 
                    />
                    <span className="relative z-10 truncate flex items-center gap-2 drop-shadow-md uppercase tracking-wider">
                      {task.progress === 100 ? <CheckCircle2 size={14} className="text-emerald-300" /> : null}
                      {task.progress}% Complete
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Vertical grid lines background (Visual aid) */}
            <div className="absolute inset-0 pointer-events-none grid gantt-grid" style={{ zIndex: -1 }}>
              <div className="col-start-1 h-full border-r border-white/5 bg-black/10" />
              {days.map((_, i) => (
                <div key={i} className="h-full border-r border-white/[0.02]" />
              ))}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
