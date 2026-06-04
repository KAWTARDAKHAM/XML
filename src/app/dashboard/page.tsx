"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useTasks } from '@/hooks/use-tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Settings, TrendingUp, Users, Briefcase, Linkedin, Github, Globe, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { tasks } = useTasks();

  const stats = [
    { title: "Total tasks", value: "+120", trend: "24%", color: "stat-card-lavender", icon: Users },
    { title: "Completed", value: "+24", trend: "14%", color: "stat-card-blue", icon: TrendingUp },
    { title: "Active projects", value: "+6", trend: "30%", color: "stat-card-pink", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      <DashboardNav />
      
      <main className="flex-1 pl-24 pr-4 py-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto flex gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-headline tracking-tight">Good morning, Alexandra</h1>
                <p className="text-muted-foreground text-sm">You have {tasks.filter(t => t.status === 'in-progress').length} active tasks today</p>
              </div>
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Search tasks..." className="pl-10 w-64 border-none bg-transparent focus-visible:ring-0" />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl"><Bell size={20} /></Button>
              </div>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className={cn("p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-64", stat.color)}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium opacity-80">{stat.title}</p>
                      <h3 className="text-5xl font-bold tracking-tighter">{stat.value}</h3>
                    </div>
                    <Badge variant="outline" className="bg-white/50 border-white/20 text-[10px] gap-1 px-2 py-0.5 rounded-full">
                      <TrendingUp size={10} /> {stat.trend} <span className="opacity-60 font-normal">vs last week</span>
                    </Badge>
                  </div>
                  
                  {/* Stylized Bar Chart Mockup */}
                  <div className="flex items-end gap-2 h-20 mt-4">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, j) => (
                      <div 
                        key={j} 
                        className="flex-1 rounded-t-lg bg-current opacity-20" 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Task Pipeline Table */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-headline">Task Management Pipeline</h2>
                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-7 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-4 px-4">
                  <div className="col-span-2">Task Title</div>
                  <div>Planning</div>
                  <div>Analysis</div>
                  <div>Design</div>
                  <div>Dev</div>
                  <div>Review</div>
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="grid grid-cols-7 items-center group hover:bg-[#F8F9FB] p-4 rounded-2xl fluent-transition">
                    <div className="col-span-2">
                      <p className="font-semibold text-sm">{task.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">{task.priority}</p>
                    </div>
                    <div className="flex justify-center"><Badge className="bg-lavender-100 text-[#283593] hover:bg-lavender-100 rounded-lg px-4 py-1">12</Badge></div>
                    <div className="flex justify-center"><Badge className="bg-blue-100 text-[#0277BD] hover:bg-blue-100 rounded-lg px-4 py-1">8</Badge></div>
                    <div className="flex justify-center"><Badge className={cn("rounded-lg px-4 py-1", task.progress > 40 ? "bg-pink-100 text-[#AD1457]" : "bg-gray-100 text-gray-400")}>{task.progress > 40 ? "15" : "-"}</Badge></div>
                    <div className="flex justify-center"><Badge className={cn("rounded-lg px-4 py-1", task.progress > 70 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400")}>{task.progress > 70 ? "5" : "-"}</Badge></div>
                    <div className="flex justify-center"><Badge className="bg-gray-100 text-gray-400 rounded-lg px-4 py-1">-</Badge></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white">
              <h3 className="text-lg font-headline mb-6">Platform Insights</h3>
              <div className="space-y-6">
                {[
                  { name: "LinkedIn", icon: Linkedin, color: "bg-blue-50 text-blue-600" },
                  { name: "GitHub", icon: Github, color: "bg-gray-100 text-gray-800" },
                  { name: "Website", icon: Globe, color: "bg-purple-50 text-purple-600" },
                ].map((plat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl", plat.color)}>
                        <plat.icon size={20} />
                      </div>
                      <span className="font-medium text-sm">{plat.name}</span>
                    </div>
                    <Badge variant="ghost" className="opacity-0 group-hover:opacity-100 fluent-transition">View</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-headline">Contributors</h3>
                <Button variant="link" className="text-xs p-0 text-primary">See all</Button>
              </div>
              <div className="space-y-6">
                {[
                  { name: "Hubert B.", role: "Lead Analyst", img: "https://picsum.photos/seed/h/100/100" },
                  { name: "Joanna W.", role: "UX Designer", img: "https://picsum.photos/seed/j/100/100" },
                  { name: "Alex K.", role: "Developer", img: "https://picsum.photos/seed/a/100/100" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 rounded-2xl">
                      <AvatarImage src={user.img} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}