
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  FileCode2, 
  Settings, 
  LogOut,
  Calendar as CalendarIcon,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSettings } from '@/hooks/use-settings-context';

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useSettings();

  const NAV_ITEMS = [
    { label: t.nav.home, href: '/dashboard', icon: Home },
    { label: t.nav.analytics, href: '/dashboard/stats', icon: BarChart3 },
    { label: t.nav.calendar, href: '/dashboard/calendar', icon: CalendarIcon },
    { label: t.nav.xmlTools, href: '/dashboard/xml-tools', icon: FileCode2 },
    { label: t.nav.settings, href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="h-screen bg-card border-r border-white/5 w-20 flex flex-col items-center py-8 z-50 fixed left-0 top-0">
      <div className="mb-12">
        <div className="w-12 h-12 rounded-[1.25rem] bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(132,94,247,0.4)]">
           <Box size={24} />
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-[1.25rem] transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 text-primary shadow-inner" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon size={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-white/10 ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto">
        <Link href="/auth/login">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-[1.25rem] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10">
            <LogOut size={22} />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
