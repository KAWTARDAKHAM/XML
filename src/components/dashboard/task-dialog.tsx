"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { Slider } from '@/components/ui/slider';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Partial<Task>) => void;
  initialData?: Task | null;
}

export function TaskDialog({ open, onOpenChange, onSubmit, initialData }: TaskDialogProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    name: '',
    description: '',
    startDate: new Date(2024, 4, 1).toISOString().split('T')[0],
    endDate: new Date(2024, 4, 10).toISOString().split('T')[0],
    priority: 'Medium',
    status: 'pending',
    progress: 0,
    estimatedEffortHours: 8
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '2024-05-01',
        endDate: '2024-05-10',
        priority: 'Medium',
        status: 'pending',
        progress: 0,
        estimatedEffortHours: 8
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 text-white max-w-md sm:rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            {initialData ? 'Edit Task Node' : 'Initialize New Task'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure task parameters for the project architecture.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Task Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., UI Refactor" 
              className="bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Start Date</Label>
              <Input 
                type="date"
                value={formData.startDate} 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">End Date</Label>
              <Input 
                type="date"
                value={formData.endDate} 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(v) => setFormData({...formData, priority: v as TaskPriority})}
              >
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Effort (Hours)</Label>
              <Input 
                type="number"
                value={formData.estimatedEffortHours} 
                onChange={(e) => setFormData({...formData, estimatedEffortHours: parseInt(e.target.value)})}
                className="bg-white/5 border-white/10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Progress ({formData.progress}%)</Label>
            </div>
            <Slider 
              value={[formData.progress || 0]} 
              max={100} 
              step={5}
              onValueChange={(v) => setFormData({...formData, progress: v[0]})}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 rounded-xl px-8">
            {initialData ? 'Update Node' : 'Confirm & Launch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
