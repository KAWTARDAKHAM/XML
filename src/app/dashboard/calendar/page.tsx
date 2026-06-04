
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, setMonth, setYear } from 'date-fns';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));
  const [month, setMonthState] = useState<Date>(new Date(2024, 4));
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(format(new Date(), 'HH:mm'));
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const handleMonthChange = (val: string) => {
    setMonthState(setMonth(month, parseInt(val)));
  };

  const handleYearChange = (val: string) => {
    setMonthState(setYear(month, parseInt(val)));
  };

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
      
      <main className="pl-20 flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-6xl h-[80vh] max-h-[700px] flex rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* PANNEAU GAUCHE - SCHEDULE */}
          <div className="w-[35%] bg-[#1A1F4D]/40 p-8 flex flex-col border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-10">
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

            <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-4 pl-1 relative z-10">Nodes for Selected Day</h3>

            <ScrollArea className="flex-1 -mx-2 px-2 relative z-10">
              <div className="space-y-3">
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
                    <p className="text-[10px] font-medium italic opacity-20 uppercase tracking-widest">No Events</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* PANNEAU DROIT - CALENDAR */}
          <div className="flex-1 bg-[#2D1326]/40 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Header with Custom Selectors */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Select value={month.getMonth().toString()} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs font-bold uppercase tracking-widest">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {months.map((m, i) => (
                        <SelectItem key={m} value={i.toString()} className="text-xs uppercase tracking-widest">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={month.getFullYear().toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs font-bold uppercase tracking-widest">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()} className="text-xs">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-[9px] text-pink-400 font-bold tracking-widest uppercase bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                  Matrix Synced
                </div>
              </div>

              {/* Grid Calendar */}
              <div className="flex-1 bg-black/30 rounded-[2rem] border border-white/10 p-4 overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={month}
                  onMonthChange={setMonthState}
                  modifiers={modifiers}
                  showOutsideDays={true}
                  className="w-full h-full p-0"
                  classNames={{
                    months: "flex flex-col h-full",
                    month: "space-y-4 h-full flex flex-col",
                    caption: "hidden",
                    table: "w-full border-collapse h-full flex flex-col",
                    head_row: "flex w-full mb-4",
                    head_cell: "flex-1 text-pink-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center",
                    row: "flex w-full flex-1 border-t border-white/5",
                    cell: "flex-1 text-center text-sm p-0 relative border-l border-white/5 first:border-l-0 focus-within:z-20 flex items-stretch",
                    day: cn(
                      "w-full h-full font-bold transition-all flex flex-col items-center justify-center text-base text-white/30 hover:bg-white/5 hover:text-white",
                    ),
                    day_selected: "bg-pink-600/30 !text-white !opacity-100 shadow-[inset_0_0_15px_rgba(236,0,140,0.3)] after:content-[''] after:absolute after:inset-0 after:border-2 after:border-pink-500/50 after:rounded-none",
                    day_today: "text-white underline underline-offset-4 decoration-pink-500 font-black",
                    day_outside: "opacity-10 grayscale",
                    day_hasTask: "before:content-[''] before:absolute before:top-3 before:right-3 before:w-1.5 before:h-1.5 before:bg-pink-500 before:rounded-full before:shadow-[0_0_8px_#ec008c]",
                  }}
                />
              </div>

              {/* Status Footer */}
              <div className="mt-6 flex items-center justify-between text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Nodes Loaded: {tasks.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                    <span>Sync Active</span>
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
