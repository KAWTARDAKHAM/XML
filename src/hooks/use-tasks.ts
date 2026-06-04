"use client"

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    name: 'Design System Architecture',
    description: 'Establish the core tokens and glassmorphic patterns.',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    priority: 'High',
    status: 'completed',
    progress: 100,
    estimatedEffortHours: 12
  },
  {
    id: '2',
    name: 'Gantt Chart Implementation',
    description: 'Develop the CSS Grid based timeline view.',
    startDate: '2024-05-06',
    endDate: '2024-05-12',
    priority: 'Critical',
    status: 'in-progress',
    progress: 45,
    estimatedEffortHours: 20
  },
  {
    id: '3',
    name: 'XSLT Preview Module',
    description: 'Allow users to apply stylesheets to task XML.',
    startDate: '2024-05-10',
    endDate: '2024-05-15',
    priority: 'Medium',
    status: 'pending',
    progress: 0,
    estimatedEffortHours: 8
  }
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fluentgantt_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(INITIAL_TASKS);
    }
    setIsLoading(false);
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('fluentgantt_tasks', JSON.stringify(newTasks));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTask, deleteTask, isLoading };
}
