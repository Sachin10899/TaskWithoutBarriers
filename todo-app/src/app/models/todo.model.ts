export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface TodoFilter {
  search: string;
  priority: Priority | 'all';
  completed: 'all' | 'completed' | 'active';
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortDirection: 'asc' | 'desc';
}
