"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isSameDay } from 'date-fns';
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 4, 15));

  const tasksOnSelectedDay = tasks.filter(task => 
    selectedDate && (isSameDay(parseISO(task.startDate), selectedDate) || isSameDay(parseISO(task.endDate), selectedDate))
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Timeline Scheduler</h1>
            <p className="text-muted-foreground mt-2">Manage deadlines and milestones across the temporal plane</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass border-white/5 lg:col-span-2 rounded-[2.5rem] p-6 overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full h-full flex items-center justify-center p-0"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-8",
                  table: "w-full border-collapse",
                  head_row: "flex justify-between w-full mb-4",
                  head_cell: "text-muted-foreground w-12 font-medium text-xs uppercase tracking-widest",
                  row: "flex justify-between w-full mt-4",
                  cell: "h-16 w-16 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-16 w-16 p-0 font-normal rounded-2xl hover:bg-white/5 fluent-transition flex items-center justify-center text-lg",
                  day_selected: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
                  day_today: "bg-white/5 text-primary font-bold",
                  day_outside: "opacity-20",
                }}
              />
            </Card>

            <div className="space-y-6">
              <Card className="glass border-white/5 rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">Events: {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'No date'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {tasksOnSelectedDay.length > 0 ? (
                      <div className="space-y-4">
                        {tasksOnSelectedDay.map(task => (
                          <div key={task.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 glass-hover">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-white">{task.name}</h4>
                              <Badge variant="outline" className={cn(
                                "text-[10px] uppercase border-none",
                                task.priority === 'Critical' ? "bg-rose-500/20 text-rose-400" : "bg-primary/20 text-primary"
                              )}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground/60">
                              <span>{task.estimatedEffortHours}h Duration</span>
                              <span>{task.progress}% Progress</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <div className="w-16 h-16 rounded-full bg-white/5 mb-4 flex items-center justify-center">
                          <CalendarIcon size={24} />
                        </div>
                        <p className="text-sm">No synchronized events for this node</p>
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
