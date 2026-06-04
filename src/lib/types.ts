export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0-100
  estimatedEffortHours: number;
}

export interface UserProfile {
  email: string;
  name: string;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
}
