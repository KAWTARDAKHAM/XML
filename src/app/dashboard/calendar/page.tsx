
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { MapPin, MessageSquare, PlusCircle, ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(format(new Date(), 'HH:mm'));
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks for the selected day
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

  // Modifiers for react-day-picker to show indicators
  const modifiers = {
    hasTask: (date: Date) => tasks.some(task => {
      try {
        const start = startOfDay(parseISO(task.startDate));
        const end = endOfDay(parseISO(task.endDate));
        return isWithinInterval(startOfDay(date), { start, end });
      } catch (e) {
        return false;
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden">
      <DashboardNav />
      
      <main className="pl-20 h-screen flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-6xl h-[750px] flex rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* LEFT PANE - TASK LIST (BLUE THEME) */}
          <div className="w-full lg:w-[42%] bg-[#1A1F4D]/60 p-10 flex flex-col border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="text-8xl font-headline font-bold text-white/90 tracking-tighter">
                {selectedDate ? format(selectedDate, 'dd') : format(new Date(), 'dd')}
              </div>
              <div className="text-right">
                <div className="text-2xl font-headline font-bold text-white/80">{currentTime || "--:--"}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-blue-400 font-bold">
                  {selectedDate ? format(selectedDate, 'EEEE') : format(new Date(), 'EEEE')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
              <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <MapPin className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
              </div>
              <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <div className="relative">
                  <MessageSquare className="text-pink-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className={cn("absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full", tasksOnSelectedDay.length > 0 ? "block" : "hidden")} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Activity</span>
              </div>
            </div>

            <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold mb-6 pl-1">Daily Schedule</h3>

            <ScrollArea className="flex-1 -mx-2 px-2 relative z-10">
              <div className="space-y-3">
                {tasksOnSelectedDay.map(task => (
                  <div key={task.id} className="group p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-all duration-300">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.priority === 'Critical' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : 
                          task.priority === 'High' ? "bg-orange-500" : "bg-blue-500"
                        )} />
                        <h4 className="text-sm font-semibold text-white/90 line-clamp-1">{task.name}</h4>
                      </div>
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Circle size={16} className="text-white/20 shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground line-clamp-1 opacity-60">
                        {task.estimatedEffortHours}h effort estimated
                      </p>
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{task.priority}</span>
                    </div>
                  </div>
                ))}

                {tasksOnSelectedDay.length === 0 && (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-20">
                      <CalendarIcon size={20} />
                    </div>
                    <p className="text-sm font-medium italic opacity-20">No tasks for this date</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT PANE - CALENDAR GRID (PINK THEME) */}
          <div className="hidden lg:flex w-[58%] bg-[#3D1A33]/60 p-12 flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-8 mb-16">
                <ChevronLeft size={24} className="text-white/30 hover:text-white cursor-pointer transition-colors" />
                <h2 className="text-4xl font-headline font-bold text-white tracking-widest uppercase">
                  {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'May 2024'}
                </h2>
                <ChevronRight size={24} className="text-white/30 hover:text-white cursor-pointer transition-colors" />
              </div>

              <div className="px-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={modifiers}
                  className="w-full p-0"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-8",
                    caption: "hidden",
                    table: "w-full border-collapse",
                    head_row: "flex justify-between w-full mb-8",
                    head_cell: "text-pink-400 w-14 font-bold text-xs uppercase tracking-[0.2em] text-center",
                    row: "flex justify-between w-full mb-2",
                    cell: "h-14 w-14 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: cn(
                      "h-14 w-14 p-0 font-bold rounded-full hover:bg-white/5 transition-all flex items-center justify-center text-lg text-white/50",
                    ),
                    day_selected: "bg-pink-600 text-white hover:bg-pink-500 shadow-[0_0_25px_rgba(236,0,140,0.5)] !text-white !opacity-100",
                    day_today: "border-2 border-pink-500/50 text-white",
                    day_outside: "opacity-10 grayscale",
                    // Adding indicator via pseudo-element for days with tasks
                    day_hasTask: "after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-pink-400 after:rounded-full after:shadow-[0_0_4px_#ec008c]",
                  }}
                />
              </div>
            </div>

            <div className="mt-auto relative z-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg mb-1">
                    {tasksOnSelectedDay.length} Active Node{tasksOnSelectedDay.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-white/40 font-medium">Click a date to sync view</div>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer group">
                  <PlusCircle size={24} className="text-white/40 group-hover:text-pink-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
