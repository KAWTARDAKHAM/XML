
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths } from 'date-fns';
import { useState, useEffect } from 'react';
import { MapPin, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden flex flex-col">
      <DashboardNav />
      
      <main className="pl-20 flex-1 flex items-center justify-center p-4 lg:p-6 overflow-hidden">
        <div className="w-full max-w-6xl h-[85vh] max-h-[750px] flex rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* LEFT PANE - TASK LIST (BLUE THEME) */}
          <div className="w-full lg:w-[35%] bg-[#1A1F4D]/60 p-6 lg:p-8 flex flex-col border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="text-7xl font-headline font-bold text-white/90 tracking-tighter">
                {selectedDate ? format(selectedDate, 'dd') : format(new Date(), 'dd')}
              </div>
              <div className="text-right">
                <div className="text-xl font-headline font-bold text-white/80">{currentTime || "--:--"}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                  {selectedDate ? format(selectedDate, 'EEEE') : format(new Date(), 'EEEE')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
              <div className="glass bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <MapPin className="text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
              </div>
              <div className="glass bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <div className="relative">
                  <MessageSquare className="text-pink-400 group-hover:scale-110 transition-transform" size={18} />
                  {tasksOnSelectedDay.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec008c]" />
                  )}
                </div>
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Activity</span>
              </div>
            </div>

            <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-4 pl-1">Daily Nodes</h3>

            <ScrollArea className="flex-1 -mx-2 px-2 relative z-10">
              <div className="space-y-2">
                {tasksOnSelectedDay.map(task => (
                  <div key={task.id} className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          task.priority === 'Critical' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : 
                          task.priority === 'High' ? "bg-orange-500" : "bg-blue-500"
                        )} />
                        <h4 className="text-xs font-semibold text-white/90 line-clamp-1">{task.name}</h4>
                      </div>
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Circle size={14} className="text-white/20 shrink-0" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[9px] text-muted-foreground line-clamp-1 opacity-60">
                        {task.estimatedEffortHours}h effort
                      </p>
                      <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">{task.priority}</span>
                    </div>
                  </div>
                ))}

                {tasksOnSelectedDay.length === 0 && (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-10">
                      <CalendarIcon size={18} />
                    </div>
                    <p className="text-[10px] font-medium italic opacity-20 uppercase tracking-widest">Idle state</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT PANE - CALENDAR GRID (MAGENTA THEME) */}
          <div className="hidden lg:flex flex-1 bg-[#2D1326]/60 p-8 flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Improved Month Selector */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={prevMonth} 
                    className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase min-w-[140px] text-center">
                    {format(month, 'MMMM yyyy')}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={nextMonth} 
                    className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="text-[9px] text-pink-400 font-bold tracking-widest uppercase bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                  {tasks.length} Nodes Loaded
                </div>
              </div>

              <div className="flex-1 bg-black/30 rounded-[1.5rem] border border-white/10 p-2 overflow-hidden flex flex-col">
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
                    head_cell: "flex-1 text-pink-400 font-bold text-[9px] uppercase tracking-[0.2em] text-center pb-2",
                    row: "flex w-full flex-1 border-t border-white/5",
                    cell: "flex-1 text-center text-sm p-0 relative border-l border-white/5 first:border-l-0 focus-within:z-20 flex items-stretch",
                    day: cn(
                      "w-full h-full font-bold transition-all flex flex-col items-center justify-center text-base text-white/40 hover:bg-white/5",
                    ),
                    day_selected: "bg-pink-600/30 !text-white !opacity-100 after:content-[''] after:absolute after:inset-0 after:border-2 after:border-pink-500 after:rounded-none",
                    day_today: "text-white underline underline-offset-4 decoration-pink-500",
                    day_outside: "opacity-10 grayscale",
                    day_hasTask: "before:content-[''] before:absolute before:top-2 before:right-2 before:w-1.5 before:h-1.5 before:bg-pink-500 before:rounded-full before:shadow-[0_0_8px_#ec008c]",
                  }}
                />
              </div>

              <div className="mt-6 flex items-center justify-between text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_5px_#ec008c]" />
                    <span>Sync Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span>Idle State</span>
                  </div>
                </div>
                <div>System Protocol v4.2</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
