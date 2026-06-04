import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, TodoFilter, Priority } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly STORAGE_KEY = 'accessible-todo-tasks';

  private _tasks = signal<Todo[]>(this.loadFromStorage());
  private _filter = signal<TodoFilter>({
    search: '',
    priority: 'all',
    completed: 'all',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  private _selectedTaskId = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly selectedTaskId = this._selectedTaskId.asReadonly();

  readonly activeTasks = computed(() =>
    this._tasks().filter(t => !t.completed)
  );

  readonly completedTasks = computed(() =>
    this._tasks().filter(t => t.completed)
  );

  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const f = this._filter();
    let result = [...tasks];

    if (f.search) {
      const search = f.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      );
    }

    if (f.priority !== 'all') {
      result = result.filter(t => t.priority === f.priority);
    }

    if (f.completed === 'completed') {
      result = result.filter(t => t.completed);
    } else if (f.completed === 'active') {
      result = result.filter(t => !t.completed);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (f.sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'priority': {
          const p: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          cmp = p[a.priority] - p[b.priority];
          break;
        }
        case 'dueDate': {
          const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          cmp = da - db;
          break;
        }
        case 'createdAt':
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return f.sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  });

  readonly taskStats = computed(() => {
    const all = this._tasks();
    const active = all.filter(t => !t.completed);
    const completed = all.filter(t => t.completed);
    const high = active.filter(t => t.priority === 'high');
    const overdue = active.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date()
    );
    return {
      total: all.length,
      active: active.length,
      completed: completed.length,
      highPriority: high.length,
      overdue: overdue.length
    };
  });

  constructor() {
    effect(() => {
      this.saveToStorage(this._tasks());
    });
  }

  addTask(title: string, description: string, priority: Priority, dueDate: string | null): Todo {
    const now = new Date().toISOString();
    const task: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      priority,
      dueDate,
      createdAt: now,
      updatedAt: now
    };
    this._tasks.update(tasks => [...tasks, task]);
    return task;
  }

  updateTask(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }

  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
    if (this._selectedTaskId() === id) {
      this._selectedTaskId.set(null);
    }
  }

  toggleComplete(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }

  getTaskById(id: string): Todo | undefined {
    return this._tasks().find(t => t.id === id);
  }

  selectTask(id: string | null): void {
    this._selectedTaskId.set(id);
  }

  updateFilter(filter: Partial<TodoFilter>): void {
    this._filter.update(f => ({ ...f, ...filter }));
  }

  clearCompleted(): void {
    this._tasks.update(tasks => tasks.filter(t => !t.completed));
  }

  private loadFromStorage(): Todo[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(tasks: Todo[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage full or unavailable
    }
  }
}
