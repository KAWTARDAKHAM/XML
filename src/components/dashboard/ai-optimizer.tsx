"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { optimizeTasks } from '@/ai/flows/ai-task-optimizer';
import { Task } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AIOptimizerProps {
  tasks: Task[];
  onApply: (suggestions: any[]) => void;
}

export function AIOptimizer({ tasks, onApply }: AIOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const formattedTasks = tasks.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        currentDeadline: t.endDate,
        currentPriority: t.priority,
        status: t.status,
        estimatedEffortHours: t.estimatedEffortHours
      }));

      const result = await optimizeTasks({ tasks: formattedTasks });
      setSuggestions(result);
      toast({
        title: "Analysis Complete",
        description: `AI suggested improvements for ${result.length} tasks.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Could not reach the AI consultant. Please try again later.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass p-6 rounded-2xl flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles size={24} className={isAnalyzing ? "animate-pulse" : ""} />
          </div>
          <div>
            <h3 className="text-lg font-headline font-semibold text-white">AI Productivity Consultant</h3>
            <p className="text-sm text-muted-foreground">Analyze your workload for optimal efficiency</p>
          </div>
        </div>
        <Button 
          disabled={isAnalyzing} 
          onClick={handleAnalyze}
          className="bg-primary hover:bg-primary/80 text-white rounded-xl shadow-lg shadow-primary/20"
        >
          {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isAnalyzing ? "Analyzing Tasks..." : "Optimize My List"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
          {suggestions.map((s) => {
            const originalTask = tasks.find(t => t.id === s.id);
            return (
              <Card key={s.id} className="glass border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md text-white">{originalTask?.name}</CardTitle>
                    <CheckCircle2 size={16} className="text-primary" />
                  </div>
                  <CardDescription className="text-xs text-muted-foreground">AI Suggestion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Suggested Priority</p>
                      <p className="text-sm font-semibold text-white">{s.suggestedPriority}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase">Suggested Deadline</p>
                      <p className="text-sm font-semibold text-white">{s.suggestedDeadline}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Reasoning</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.reasoning}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-[10px] uppercase tracking-wider border-primary/20 hover:bg-primary/10">
                    Apply Changes
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
