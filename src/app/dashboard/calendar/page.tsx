"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));

  // Filter tasks that are active on the selected day
  const tasksOnSelectedDay = tasks.filter(task => {
    if (!selectedDate) return false;
    try {
      const start = startOfDay(parseISO(task.startDate));
      const end = endOfDay(parseISO(task.endDate));
      return isWithinInterval(selectedDate, { start, end });
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Temporal Grid</h1>
            <p className="text-muted-foreground mt-2">Interactive roadmap synchronization by date selection</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Section */}
            <Card className="glass border-white/5 lg:col-span-8 rounded-[2.5rem] p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-headline font-bold">Select Date</h2>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">May 2024 Cycle</Badge>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex items-center justify-center p-0"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-8",
                  table: "w-full border-collapse",
                  head_row: "flex justify-between w-full mb-6",
                  head_cell: "text-muted-foreground w-14 font-medium text-xs uppercase tracking-widest",
                  row: "flex justify-between w-full mt-4",
                  cell: "h-20 w-20 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-20 w-20 p-0 font-normal rounded-2xl hover:bg-white/5 fluent-transition flex flex-col items-center justify-center gap-1 text-lg",
                  day_selected: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
                  day_today: "bg-white/5 text-primary font-bold border border-primary/20",
                  day_outside: "opacity-20",
                }}
              />
            </Card>

            {/* Tasks Section */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass border-white/5 rounded-[2.5rem] h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-headline">Schedule</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'No date selected'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    {tasksOnSelectedDay.length > 0 ? (
                      <div className="space-y-4">
                        {tasksOnSelectedDay.map(task => (
                          <div key={task.id} className="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/10 glass-hover animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white leading-tight">{task.name}</h4>
                              <Badge variant="outline" className={cn(
                                "text-[9px] uppercase border-none px-2",
                                task.priority === 'Critical' ? "bg-rose-500/20 text-rose-400" : 
                                task.priority === 'High' ? "bg-orange-500/20 text-orange-400" :
                                "bg-primary/20 text-primary"
                              )}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">{task.progress}%</span>
                               </div>
                               <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                                 {task.status === 'completed' && <CheckCircle2 size={10} />}
                                 <span className="uppercase tracking-tighter">{task.status}</span>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 opacity-30">
                        <div className="w-20 h-20 rounded-full bg-white/5 mb-6 flex items-center justify-center">
                          <CalendarIcon size={32} />
                        </div>
                        <p className="text-sm font-medium">No tasks allocated for this temporal node</p>
                        <p className="text-xs mt-1">Select another date to view the pipeline</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
