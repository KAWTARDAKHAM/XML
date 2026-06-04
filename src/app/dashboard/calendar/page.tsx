
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  format, 
  parseISO, 
  isWithinInterval, 
  startOfDay, 
  endOfDay, 
  setMonth, 
  setYear, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth 
} from 'date-fns';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 4, 15));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 4));
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setCurrentTime(format(new Date(), 'HH:mm'));
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleMonthChange = (val: string) => {
    setCurrentMonth(setMonth(currentMonth, parseInt(val)));
  };

  const handleYearChange = (val: string) => {
    setCurrentMonth(setYear(currentMonth, parseInt(val)));
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const hasTask = (date: Date) => tasks.some(task => {
    try {
      const start = startOfDay(parseISO(task.startDate));
      const end = endOfDay(parseISO(task.endDate));
      return isWithinInterval(startOfDay(date), { start, end });
    } catch (e) {
      return false;
    }
  });

  const tasksOnSelectedDay = tasks.filter(task => {
    try {
      const start = startOfDay(parseISO(task.startDate));
      const end = endOfDay(parseISO(task.endDate));
      return isWithinInterval(startOfDay(selectedDate), { start, end });
    } catch (e) {
      return false;
    }
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden flex flex-col">
      <DashboardNav />
      
      <main className="pl-20 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[85vh] max-h-[800px] flex rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* PANNEAU GAUCHE - LISTE DES TÂCHES (DATE HERO) */}
          <div className="w-[35%] bg-[#1A1F4D]/40 p-8 flex flex-col border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="text-8xl font-headline font-bold text-white/90 tracking-tighter">
                {format(selectedDate, 'dd')}
              </div>
              <div className="text-right">
                <div className="text-xl font-headline font-bold text-white/80">{currentTime || "--:--"}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                  {format(selectedDate, 'EEEE')}
                </div>
              </div>
            </div>

            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-6 pl-1 relative z-10">Active Nodes</h3>

            <ScrollArea className="flex-1 -mx-2 px-2 relative z-10">
              <div className="space-y-3">
                {tasksOnSelectedDay.map(task => (
                  <div key={task.id} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.priority === 'Critical' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" : 
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
                        {task.estimatedEffortHours}h total effort
                      </p>
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{task.priority}</span>
                    </div>
                  </div>
                ))}

                {tasksOnSelectedDay.length === 0 && (
                  <div className="py-12 text-center flex flex-col items-center gap-4 opacity-20">
                    <CalendarIcon size={32} />
                    <p className="text-[10px] font-medium uppercase tracking-widest">No Events Synchronized</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* PANNEAU DROIT - CALENDRIER ÉPURÉ (STYLE IMAGE) */}
          <div className="flex-1 bg-[#2D1326]/40 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-pink-600/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Header avec Selecteurs */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-3">
                  <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[160px] bg-black/40 border-white/10 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest focus:ring-pink-500/50">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {months.map((m, i) => (
                        <SelectItem key={m} value={i.toString()} className="text-xs uppercase tracking-widest">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-[110px] bg-black/40 border-white/10 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest focus:ring-pink-500/50">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()} className="text-xs">{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <h2 className="text-xl font-headline font-bold text-white tracking-widest uppercase opacity-40">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
              </div>

              {/* Day Headers (Su Mo Tu...) */}
              <div className="grid grid-cols-7 mb-4 shrink-0 border-b border-white/10 pb-4">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-[11px] font-black text-pink-400/60 uppercase tracking-[0.3em]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid Scrollable */}
              <ScrollArea className="flex-1 bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="grid grid-cols-7">
                  {calendarDays.map((date, i) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const currentMonthFlag = isSameMonth(date, currentMonth);
                    const dayHasTask = hasTask(date);

                    return (
                      <div 
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "relative h-24 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-b border-r border-white/5",
                          !currentMonthFlag && "opacity-10 grayscale",
                          isSelected && "bg-pink-600/20 shadow-[inset_0_0_20px_rgba(236,0,140,0.2)]",
                          "hover:bg-white/5"
                        )}
                      >
                        <span className={cn(
                          "text-lg font-headline transition-all",
                          isSelected ? "text-white scale-125 font-black" : "text-white/40 font-bold",
                          dayHasTask && !isSelected && "text-pink-500 drop-shadow-[0_0_8px_rgba(236,0,140,0.6)]",
                          isToday && "underline decoration-pink-500 decoration-2 underline-offset-4"
                        )}>
                          {format(date, 'd')}
                        </span>

                        {dayHasTask && (
                          <div className={cn(
                            "absolute bottom-4 w-1 h-1 rounded-full",
                            isSelected ? "bg-white scale-150" : "bg-pink-500 shadow-[0_0_10px_#ec008c]"
                          )} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer Status */}
              <div className="mt-6 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase shrink-0">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", tasksOnSelectedDay.length > 0 ? "bg-emerald-500" : "bg-white/10")} />
                    <span>Selected: {tasksOnSelectedDay.length} Events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <span>Neural Sync Active</span>
                  </div>
                </div>
                <div className="opacity-50">System Architecture v4.2</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
