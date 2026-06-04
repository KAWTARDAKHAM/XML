
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths } from 'date-fns';
import { useState, useEffect } from 'react';
import { MapPin, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));
  const [month, setMonth] = useState<Date>(new Date(2024, 4));
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

  const nextMonth = () => setMonth(addMonths(month, 1));
  const prevMonth = () => setMonth(subMonths(month, 1));

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
      
      <main className="pl-20 h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-7xl h-[800px] flex rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* LEFT PANE - TASK LIST (BLUE THEME) */}
          <div className="w-full lg:w-[40%] bg-[#1A1F4D]/60 p-8 lg:p-10 flex flex-col border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-10">
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
                <MapPin className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
              </div>
              <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <div className="relative">
                  <MessageSquare className="text-pink-400 group-hover:scale-110 transition-transform" size={20} />
                  {tasksOnSelectedDay.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec008c]" />
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Activity</span>
              </div>
            </div>

            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-6 pl-1">Daily Schedule</h3>

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
                    <p className="text-sm font-medium italic opacity-20">No synchronized events</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT PANE - CALENDAR GRID (MAGENTA THEME) */}
          <div className="hidden lg:flex flex-1 bg-[#3D1A33]/60 p-10 flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 glass bg-white/5 border-white/10 rounded-full px-6 py-2">
                  <ChevronLeft onClick={prevMonth} size={18} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                  <h2 className="text-sm font-bold text-white tracking-widest uppercase min-w-[120px] text-center">
                    {format(month, 'MMMM yyyy')}
                  </h2>
                  <ChevronRight onClick={nextMonth} size={18} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="text-[10px] text-pink-400 font-bold tracking-widest uppercase">
                  {tasks.length} Total Nodes
                </div>
              </div>

              <div className="flex-1 bg-black/20 rounded-[2rem] border border-white/10 p-2 overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={month}
                  onMonthChange={setMonth}
                  modifiers={modifiers}
                  showOutsideDays={true}
                  className="w-full h-full p-0 flex flex-col"
                  classNames={{
                    months: "flex flex-col h-full",
                    month: "space-y-4 h-full flex flex-col",
                    caption: "hidden",
                    table: "w-full border-collapse h-full flex flex-col",
                    head_row: "flex w-full mb-2",
                    head_cell: "flex-1 text-pink-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center pb-4",
                    row: "flex w-full flex-1 border-t border-white/5",
                    cell: "flex-1 text-center text-sm p-0 relative border-l border-white/5 first:border-l-0 focus-within:z-20 flex items-stretch",
                    day: cn(
                      "w-full h-full font-bold transition-all flex flex-col items-center justify-center text-lg text-white/40 hover:bg-white/5",
                    ),
                    day_selected: "bg-pink-600/20 !text-white !opacity-100 after:content-[''] after:absolute after:inset-0 after:border-2 after:border-pink-500 after:rounded-none",
                    day_today: "text-white underline underline-offset-4 decoration-pink-500",
                    day_outside: "opacity-10 grayscale",
                    day_hasTask: "before:content-[''] before:absolute before:top-4 before:right-4 before:w-1.5 before:h-1.5 before:bg-pink-500 before:rounded-full before:shadow-[0_0_8px_#ec008c]",
                  }}
                />
              </div>

              <div className="mt-8 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    <span>Active Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span>Idle State</span>
                  </div>
                </div>
                <div>Sync Protocol v4.2</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
