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
  Calendar,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Analytics', href: '/dashboard/stats', icon: BarChart3 },
  { label: 'Calendar', href: '#', icon: Calendar },
  { label: 'XML Tools', href: '/dashboard/xml-tools', icon: FileCode2 },
  { label: 'Projects', href: '#', icon: Layers },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="h-screen bg-white border-r border-[#F0F2F5] w-20 flex flex-col items-center py-8 z-50 fixed left-0 top-0">
      <div className="mb-12">
        <div className="w-12 h-12 rounded-[1.25rem] bg-black flex items-center justify-center text-white p-2.5">
          <div className="w-full h-full border-4 border-white rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full" />
          </div>
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
                      "w-12 h-12 flex items-center justify-center rounded-[1.25rem] fluent-transition",
                      isActive 
                        ? "bg-black text-white shadow-lg" 
                        : "text-muted-foreground hover:bg-[#F0F2F5] hover:text-black"
                    )}
                  >
                    <Icon size={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white border-none">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto">
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-[1.25rem] text-muted-foreground hover:text-rose-500 hover:bg-rose-50">
          <LogOut size={22} />
        </Button>
      </div>
    </aside>
  );
}