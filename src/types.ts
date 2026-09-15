export type Priority = 'low' | 'medium' | 'high';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  bgLight: string;
  textColor: string;
  borderColor: string;
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: Priority;
  categoryId: string;
  completed: boolean;
  completedAt?: string;
  recurrence: Recurrence;
  createdAt: string;
  notified?: boolean;
}

export type FilterView = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';
export type SortOption = 'date-asc' | 'date-desc' | 'priority' | 'title' | 'created';
