
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useState, useEffect } from 'react';
import { MapPin, MessageSquare, PlusCircle, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden">
      <DashboardNav />
      
      <main className="pl-20 h-screen flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-6xl h-[750px] flex rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* LEFT PANE - BLUE THEME */}
          <div className="w-full lg:w-[42%] bg-[#1A1F4D]/60 p-10 flex flex-col border-r border-white/5 relative overflow-hidden">
            {/* Background glow for blue pane */}
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

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <MapPin className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Map</span>
              </div>
              <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all border-white/5">
                <div className="relative">
                  <MessageSquare className="text-pink-400 group-hover:scale-110 transition-transform" size={24} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Messages</span>
              </div>
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-3">
                {tasksOnSelectedDay.map(task => (
                  <div key={task.id} className="group p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-all duration-300">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <PlusCircle size={14} className="text-blue-400 opacity-50" />
                        <h4 className="text-sm font-semibold text-white/90 line-clamp-1">{task.name}</h4>
                      </div>
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Circle size={16} className="text-white/20 shrink-0" />
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 pl-6 opacity-60">
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}

                {tasksOnSelectedDay.length === 0 && (
                  <div className="py-20 text-center opacity-20">
                    <p className="text-sm font-medium italic">No events scheduled</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-8 flex justify-center items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <ChevronLeft size={16} className="cursor-pointer hover:text-white" />
              <div className="flex gap-2">
                <span className="text-white">1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
              <ChevronRight size={16} className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* RIGHT PANE - PINK THEME */}
          <div className="hidden lg:flex w-[58%] bg-[#3D1A33]/60 p-12 flex-col relative overflow-hidden">
             {/* Background glow for pink pane */}
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
                  className="w-full p-0"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-8",
                    caption: "hidden", // We use our own header
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
                  }}
                />
              </div>
            </div>

            <div className="mt-auto relative z-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-lg mb-1">00.00 Meeting</div>
                  <div className="text-xs text-white/40 font-medium">Select the day and add the event</div>
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
