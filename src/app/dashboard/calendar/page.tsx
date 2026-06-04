
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));

  // Filter tasks that are active on the selected day (range-based)
  const tasksOnSelectedDay = tasks.filter(task => {
    if (!selectedDate) return false;
    try {
      const start = startOfDay(parseISO(task.startDate));
      const end = endOfDay(parseISO(task.endDate));
      const target = startOfDay(selectedDate);
      return isWithinInterval(target, { start, end });
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-headline font-bold text-white tracking-tight">Select Date</h1>
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              May 2024 Cycle
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Calendar Section - Matching the provided image style */}
            <div className="lg:col-span-8">
              <div className="glass rounded-[2.5rem] p-10 border-white/5 bg-white/[0.02]">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full p-0"
                  classNames={{
                    months: "w-full space-y-8",
                    month: "w-full space-y-8",
                    caption: "flex justify-start items-center relative mb-8",
                    caption_label: "text-3xl font-headline font-bold text-white ml-2",
                    nav: "flex items-center gap-4 absolute right-0",
                    nav_button: "h-10 w-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors border border-white/5",
                    table: "w-full border-collapse",
                    head_row: "flex justify-between w-full mb-8",
                    head_cell: "text-muted-foreground w-14 font-semibold text-sm uppercase tracking-[0.2em]",
                    row: "flex justify-between w-full mb-4",
                    cell: "h-20 w-20 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-20 w-20 p-0 font-medium rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center text-xl text-white/70",
                    ),
                    day_selected: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_30px_rgba(132,94,247,0.3)] !text-white !opacity-100",
                    day_today: "border border-primary/40 text-primary font-bold",
                    day_outside: "opacity-10",
                  }}
                  components={{
                    IconLeft: () => <ChevronLeft className="h-6 w-6 text-white/50" />,
                    IconRight: () => <ChevronRight className="h-6 w-6 text-white/50" />,
                  }}
                />
              </div>
            </div>

            {/* Task Side Panel */}
            <div className="lg:col-span-4 h-full">
              <div className="glass rounded-[2.5rem] border-white/5 h-[600px] flex flex-col bg-white/[0.01]">
                <div className="p-8 border-b border-white/5">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 rounded-2xl bg-primary/20 text-primary">
                        <Clock size={20} />
                      </div>
                      <h2 className="text-2xl font-headline font-bold">Schedule</h2>
                   </div>
                   <p className="text-muted-foreground text-sm pl-14">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM dd') : 'Select a node'}
                  </p>
                </div>
                
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full px-8 py-6">
                    {tasksOnSelectedDay.length > 0 ? (
                      <div className="space-y-4">
                        {tasksOnSelectedDay.map(task => (
                          <div key={task.id} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-white leading-tight pr-2">{task.name}</h4>
                              <Badge variant="outline" className={cn(
                                "text-[9px] uppercase border-none px-2 py-0.5",
                                task.priority === 'Critical' ? "bg-rose-500/20 text-rose-400" : 
                                task.priority === 'High' ? "bg-orange-500/20 text-orange-400" :
                                "bg-primary/20 text-primary"
                              )}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between">
                               <div className="flex-1 mr-4">
                                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                                  </div>
                               </div>
                               <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                                 {task.status === 'completed' && <CheckCircle2 size={10} />}
                                 <span className="uppercase tracking-widest">{task.progress}%</span>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30 mt-12">
                        <div className="w-20 h-20 rounded-full bg-white/5 mb-6 flex items-center justify-center">
                          <CalendarIcon size={32} />
                        </div>
                        <p className="text-sm font-medium">No tasks allocated</p>
                        <p className="text-xs mt-2">Check another temporal node</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
