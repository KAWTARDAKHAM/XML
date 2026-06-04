"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileCode2, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { label: 'Timeline', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Stats Hub', href: '/dashboard/stats', icon: BarChart3 },
  { label: 'XML Tools', href: '/dashboard/xml-tools', icon: FileCode2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside 
      className={cn(
        "h-screen glass border-r border-white/5 fluent-transition flex flex-col z-50 fixed left-0 top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl font-headline font-bold text-primary animate-in fade-in slide-in-from-left-2">
            FluentGantt
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-primary/10 hover:text-primary fluent-transition"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-2 py-4">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href} disableHoverableContent={!isCollapsed}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl fluent-transition group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon 
                      size={20} 
                      className={cn(
                        "fluent-transition shrink-0",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} 
                    />
                    {!isCollapsed && (
                      <span className="font-medium animate-in fade-in slide-in-from-left-1">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-popover border-white/10">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        {!isCollapsed && (
           <Button className="w-full bg-primary hover:bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20">
             <Plus size={18} className="mr-2" /> New Task
           </Button>
        )}
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-rose-400 hover:bg-rose-400/5 px-4 rounded-xl">
          <LogOut size={20} className={cn("shrink-0", !isCollapsed && "mr-4")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
