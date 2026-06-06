
"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Github, Mail, ArrowRight, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-headline font-bold text-2xl shadow-lg shadow-primary/20">F</div>
          </div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your FluentGantt workstation</p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] text-primary/70 uppercase tracking-widest mt-4">
            <Info size={12} />
            <span>Prototype mode: Use any credentials</span>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Email</Label>
              <Input 
                type="email" 
                placeholder="demo@example.com" 
                required 
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••"
                required 
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary/50"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/80 text-white rounded-xl h-12 text-md font-semibold shadow-lg shadow-primary/20 fluent-transition"
            >
              {isLoading ? "Synchronizing..." : "Continue"}
              {!isLoading && <ArrowRight size={18} className="ml-2" />}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-muted-foreground">Or connect with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button variant="outline" className="glass border-white/10 hover:bg-white/5 rounded-xl h-12">
              <Github size={18} className="mr-2" /> Github
            </Button>
            <Button variant="outline" className="glass border-white/10 hover:bg-white/5 rounded-xl h-12">
              <Mail size={18} className="mr-2" /> Google
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New to the lab? <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
