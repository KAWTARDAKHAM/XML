"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
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
          <div className="inline-block p-3 rounded-2xl bg-accent/10 mb-4">
            <Sparkles size={32} className="text-accent" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Join the Fleet</h1>
          <p className="text-muted-foreground">Start managing tasks with XML-powered workflows</p>
        </div>

        <div className="glass p-8 rounded-[2rem]">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Full Name</Label>
              <Input 
                placeholder="John Doe" 
                required 
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Email</Label>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest pl-1">Password</Label>
              <Input 
                type="password" 
                required 
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-accent/50"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/80 text-black font-bold rounded-xl h-12 text-md shadow-lg shadow-accent/20 fluent-transition"
              >
                {isLoading ? "Configuring Account..." : "Create Account"}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already a member? <Link href="/auth/login" className="text-accent font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
