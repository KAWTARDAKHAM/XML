"use client"

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    name: 'Core Engine Architecture',
    description: 'Establish the core tokens and glassmorphic patterns.',
    startDate: '2024-05-01',
    endDate: '2024-05-08',
    priority: 'Critical',
    status: 'completed',
    progress: 100,
    estimatedEffortHours: 24
  },
  {
    id: '2',
    name: 'Gantt Chart Engine',
    description: 'Develop the CSS Grid based timeline view with real-time scaling.',
    startDate: '2024-05-06',
    endDate: '2024-05-15',
    priority: 'High',
    status: 'in-progress',
    progress: 65,
    estimatedEffortHours: 40
  },
  {
    id: '3',
    name: 'AI Integration Layer',
    description: 'Connect Genkit flows to the main dashboard events.',
    startDate: '2024-05-12',
    endDate: '2024-05-20',
    priority: 'High',
    status: 'in-progress',
    progress: 30,
    estimatedEffortHours: 15
  },
  {
    id: '4',
    name: 'XSLT Preview Module',
    description: 'Allow users to apply stylesheets to task XML.',
    startDate: '2024-05-18',
    endDate: '2024-05-25',
    priority: 'Medium',
    status: 'pending',
    progress: 0,
    estimatedEffortHours: 12
  },
  {
    id: '5',
    name: 'Security Audit & IAM',
    description: 'Ensure data isolation and XML validation rules.',
    startDate: '2024-05-22',
    endDate: '2024-05-30',
    priority: 'Low',
    status: 'blocked',
    progress: 10,
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