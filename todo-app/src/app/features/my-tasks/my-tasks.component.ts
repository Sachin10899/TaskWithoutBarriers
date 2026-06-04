import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStore } from '../../stores/task.store';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';
import { NotificationService } from '../../core/services/notification.service';
import { AudioFeedbackService } from '../../core/services/audio-feedback.service';
import { AccessibleTaskCardComponent } from '../../shared/components/accessible-task-card/accessible-task-card.component';
import { AccessibleSearchComponent } from '../../shared/components/accessible-search/accessible-search.component';
import { AccessibleDialogComponent } from '../../shared/components/accessible-dialog/accessible-dialog.component';
import { AccessibleFormFieldComponent } from '../../shared/components/accessible-form-field/accessible-form-field.component';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [
    FormsModule, AccessibleTaskCardComponent, AccessibleSearchComponent,
    AccessibleDialogComponent, AccessibleFormFieldComponent,
    AutoFocusDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="my-tasks" role="main" aria-label="My Tasks">
      <header class="page-header">
        <div class="header-top">
          <div>
            <h1>My Tasks</h1>
            <p class="subtitle">Manage your active tasks</p>
          </div>
          <button
            class="btn-primary add-task-btn"
            (click)="openCreateDialog()"
            aria-label="Create new task. Press Alt+N">
            <span aria-hidden="true">+</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      <section class="toolbar-section" aria-label="Task toolbar">
        <app-accessible-search
          label="Search tasks"
          placeholder="Search tasks by title or description..."
          [searchValue]="searchValue()"
          [resultCount]="filteredTasks().length"
          (searchChanged)="onSearchChange($event)">
        </app-accessible-search>

        <div class="filter-bar" role="group" aria-label="Filter and sort controls">
          <div class="filter-group">
            <label for="priority-filter" class="filter-label">Priority:</label>
            <select
              id="priority-filter"
              [value]="filter().priority"
              aria-label="Filter by priority"
              (change)="onPriorityFilterChange($event)">
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="sort-select" class="filter-label">Sort by:</label>
            <select
              id="sort-select"
              [value]="filter().sortBy"
              aria-label="Sort tasks by"
              (change)="onSortChange($event)">
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="sort-dir" class="filter-label">Order:</label>
            <select
              id="sort-dir"
              [value]="filter().sortDirection"
              aria-label="Sort direction"
              (change)="onSortDirChange($event)">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </section>

      <section class="tasks-section" aria-label="Active tasks">
        <div class="tasks-count" role="status" aria-live="polite">
          {{ filteredTasks().length }} {{ filteredTasks().length === 1 ? 'task' : 'tasks' }} found
        </div>

        @if (filteredTasks().length === 0) {
          <div class="empty-state" role="status">
            @if (searchValue() || filter().priority !== 'all') {
              <p>No tasks match your search or filters.</p>
              <button class="btn-secondary" (click)="clearFilters()" aria-label="Clear all filters and search">
                Clear Filters
              </button>
            } @else {
              <div class="empty-icon" aria-hidden="true">&#128221;</div>
              <h2>No Active Tasks</h2>
              <p>Create your first task to get started.</p>
              <button class="btn-primary" (click)="openCreateDialog()" aria-label="Create your first task">
                <span aria-hidden="true">+</span>
                <span>Create First Task</span>
              </button>
            }
          </div>
        } @else {
          <div
            class="task-grid"
            role="listbox"
            aria-label="Task list"
            (keydown)="onKeyDown($event)">
            @for (task of filteredTasks(); track task.id; let i = $index) {
              <div role="option" [attr.aria-selected]="selectedTaskId() === task.id">
                <app-accessible-task-card
                  [task]="task"
                  [selected]="selectedTaskId() === task.id"
                  (openTask)="openEditDialog($event)"
                  (editTask)="openEditDialog($event)"
                  (deleteTask)="confirmDelete($event)"
                  (toggled)="toggleComplete($event)">
                </app-accessible-task-card>
              </div>
            }
          </div>
        }
      </section>

      <!-- Create Task Dialog -->
      <app-accessible-dialog #createDialog title="Create New Task" (closed)="resetForm()">
        <form (submit)="createTask($event)" class="task-form" aria-label="Create task form">
          <app-accessible-form-field
            label="Task Title"
            type="text"
            [value]="formData().title"
            placeholder="Enter task title"
            [required]="true"
            instruction="Provide a clear, descriptive title for your task"
            [errorMessage]="formErrors().title"
            (valueChanged)="updateFormField('title', $event)">
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Description"
            type="textarea"
            [value]="formData().description"
            placeholder="Enter task description (optional)"
            (valueChanged)="updateFormField('description', $event)">
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Priority"
            type="select"
            [value]="formData().priority"
            [required]="true"
            instruction="Select how important this task is"
            (valueChanged)="updateFormField('priority', $event)">
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Due Date"
            type="date"
            [value]="formData().dueDate"
            instruction="Optional. Set a deadline for this task"
            (valueChanged)="updateFormField('dueDate', $event)">
          </app-accessible-form-field>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="createDialog.close()">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </app-accessible-dialog>

      <!-- Edit Task Dialog -->
      <app-accessible-dialog #editDialog title="Edit Task" (closed)="resetForm()">
        <form (submit)="updateTask($event)" class="task-form" aria-label="Edit task form">
          <app-accessible-form-field
            label="Task Title"
            type="text"
            [value]="formData().title"
            placeholder="Enter task title"
            [required]="true"
            [errorMessage]="formErrors().title"
            (valueChanged)="updateFormField('title', $event)">
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Description"
            type="textarea"
            [value]="formData().description"
            placeholder="Enter task description"
            (valueChanged)="updateFormField('description', $event)">
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Priority"
            type="select"
            [value]="formData().priority"
            [required]="true"
            (valueChanged)="updateFormField('priority', $event)">
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </app-accessible-form-field>

          <app-accessible-form-field
            label="Due Date"
            type="date"
            [value]="formData().dueDate"
            (valueChanged)="updateFormField('dueDate', $event)">
          </app-accessible-form-field>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="editDialog.close()">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </app-accessible-dialog>

      <!-- Delete Confirmation Dialog -->
      <app-accessible-dialog #deleteDialog title="Delete Task">
        <p>Are you sure you want to delete "{{ taskToDelete()?.title }}"? This action cannot be undone.</p>
        <div class="form-actions">
          <button class="btn-secondary" (click)="deleteDialog.close()">
            Cancel
          </button>
          <button class="btn-danger" (click)="deleteTask()" appAutoFocus>
            Delete Task
          </button>
        </div>
      </app-accessible-dialog>
    </main>
  `,
  styles: [`
    .my-tasks { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 24px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { font-size: 2rem; margin: 0 0 4px; color: var(--text-primary, #1a1a1a); }
    .subtitle { margin: 0; color: var(--text-secondary, #666); }
    .add-task-btn { padding: 10px 20px; font-size: 1rem; }
    .toolbar-section { margin-bottom: 24px; }
    .filter-bar {
      display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;
      padding: 12px 16px; background: var(--surface, #fff);
      border: 1px solid var(--border, #e0e0e0); border-radius: 8px;
    }
    .filter-group { display: flex; align-items: center; gap: 8px; }
    .filter-label { font-weight: 500; font-size: 0.9rem; white-space: nowrap; }
    .filter-group select {
      padding: 8px 12px; border: 2px solid var(--border, #e0e0e0);
      border-radius: 6px; font-size: 0.9rem; background: var(--surface, #fff);
      color: var(--text-primary, #1a1a1a); cursor: pointer;
    }
    .filter-group select:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: 2px;
    }
    .tasks-count { margin-bottom: 16px; font-size: 0.95rem; color: var(--text-secondary, #666); }
    .task-grid { display: flex; flex-direction: column; gap: 12px; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-state h2 { margin: 0 0 8px; }
    .empty-state p { margin: 0 0 16px; color: var(--text-secondary, #666); }
    .task-form { display: flex; flex-direction: column; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
    .btn-primary {
      padding: 10px 20px; border: none; border-radius: 6px; font-size: 1rem;
      font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
      background: var(--primary, #005fcc); color: #fff;
    }
    .btn-primary:hover { background: #004ba8; }
    .btn-primary:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .btn-secondary {
      padding: 10px 20px; border: 2px solid var(--border, #e0e0e0); border-radius: 6px;
      font-size: 1rem; font-weight: 500; cursor: pointer;
      background: var(--surface, #fff); color: var(--text-primary, #1a1a1a);
    }
    .btn-secondary:hover { border-color: var(--primary, #005fcc); }
    .btn-secondary:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .btn-danger {
      padding: 10px 20px; border: none; border-radius: 6px; font-size: 1rem;
      font-weight: 600; cursor: pointer; background: #dc3545; color: #fff;
    }
    .btn-danger:hover { background: #c82333; }
    .btn-danger:focus-visible { outline: 3px solid var(--focus, #dc3545); outline-offset: 2px; }
  `]
})
export class MyTasksComponent implements OnInit {
  @ViewChild('createDialog') createDialog!: AccessibleDialogComponent;
  @ViewChild('editDialog') editDialog!: AccessibleDialogComponent;
  @ViewChild('deleteDialog') deleteDialog!: AccessibleDialogComponent;

  private taskStore = inject(TaskStore);
  private announcements = inject(AccessibilityAnnouncementService);
  private notifications = inject(NotificationService);
  private audio = inject(AudioFeedbackService);

  filteredTasks = this.taskStore.filteredTasks;
  filter = this.taskStore.filter;
  selectedTaskId = this.taskStore.selectedTaskId;

  searchValue = signal('');
  editingTaskId = signal<string | null>(null);
  taskToDelete = signal<Todo | null>(null);

  formData = signal({
    title: '', description: '', priority: 'medium' as Priority, dueDate: ''
  });
  formErrors = signal({ title: '' });

  ngOnInit(): void {
    const count = this.filteredTasks().length;
    this.announcements.announceContext(
      'My Tasks',
      count,
      'Press Alt+N to create a new task. Use arrow keys to navigate tasks.'
    );
  }

  onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.taskStore.updateFilter({ search: value });
    const count = this.filteredTasks().length;
    this.announcements.announce(`Search results: ${count} ${count === 1 ? 'task' : 'tasks'} found`);
  }

  onPriorityFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Priority | 'all';
    this.taskStore.updateFilter({ priority: value });
    this.announcements.announce(`Priority filter changed to ${value}`);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.taskStore.updateFilter({ sortBy: value as any });
    this.announcements.announce(`Sort changed to ${value}`);
  }

  onSortDirChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'asc' | 'desc';
    this.taskStore.updateFilter({ sortDirection: value });
    this.announcements.announce(`Sort direction changed to ${value}`);
  }

  clearFilters(): void {
    this.searchValue.set('');
    this.taskStore.updateFilter({
      search: '', priority: 'all', sortBy: 'createdAt', sortDirection: 'desc'
    });
    this.announcements.announce('All filters cleared');
  }

  openCreateDialog(): void {
    this.resetForm();
    this.createDialog.open();
    this.announcements.announce('Create new task dialog opened');
  }

  openEditDialog(task: Todo): void {
    this.editingTaskId.set(task.id);
    this.formData.set({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || ''
    });
    this.formErrors.set({ title: '' });
    this.editDialog.open();
    this.announcements.announce(`Edit task: ${task.title}`);
  }

  confirmDelete(task: Todo): void {
    this.taskToDelete.set(task);
    this.deleteDialog.open();
    this.announcements.announce(`Delete confirmation for task: ${task.title}`);
  }

  updateFormField(field: string, value: string): void {
    this.formData.update(f => ({ ...f, [field]: value }));
    if (field === 'title' && value.trim()) {
      this.formErrors.set({ title: '' });
    }
  }

  createTask(event: Event): void {
    event.preventDefault();
    const data = this.formData();
    if (!data.title.trim()) {
      this.audio.play('error');
      this.formErrors.set({ title: 'Task title is required. Please enter a task title.' });
      this.announcements.announceError('Task title is required. Please enter a task title.');
      return;
    }
    const task = this.taskStore.addTask(
      data.title.trim(), data.description.trim(),
      data.priority, data.dueDate || null
    );
    this.audio.play('success');
    this.notifications.success('Task created successfully');
    this.createDialog.close();
    this.resetForm();
  }

  updateTask(event: Event): void {
    event.preventDefault();
    const data = this.formData();
    const taskId = this.editingTaskId();
    if (!data.title.trim()) {
      this.audio.play('error');
      this.formErrors.set({ title: 'Task title is required. Please enter a task title.' });
      this.announcements.announceError('Task title is required. Please enter a task title.');
      return;
    }
    if (taskId) {
      this.taskStore.updateTask(taskId, {
        title: data.title.trim(),
        description: data.description.trim(),
        priority: data.priority,
        dueDate: data.dueDate || null
      });
      this.audio.play('success');
      this.notifications.success('Task updated successfully');
    }
    this.editDialog.close();
    this.resetForm();
  }

  deleteTask(): void {
    const task = this.taskToDelete();
    if (task) {
      this.audio.play('delete');
      this.taskStore.deleteTask(task.id);
      this.notifications.success(`Task "${task.title}" deleted successfully`);
    }
    this.deleteDialog.close();
    this.taskToDelete.set(null);
  }

  toggleComplete(task: Todo): void {
    this.taskStore.toggleComplete(task.id);
  }

  onKeyDown(event: KeyboardEvent): void {
    const tasks = this.filteredTasks();
    const currentIndex = tasks.findIndex(t => t.id === this.selectedTaskId());

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = Math.min(currentIndex + 1, tasks.length - 1);
        this.taskStore.selectTask(tasks[next]?.id || null);
        this.announceTaskSelection(tasks[next]);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = Math.max(currentIndex - 1, 0);
        this.taskStore.selectTask(tasks[prev]?.id || null);
        this.announceTaskSelection(tasks[prev]);
        break;
      }
      case 'Home': {
        event.preventDefault();
        if (tasks.length) {
          this.taskStore.selectTask(tasks[0].id);
          this.announceTaskSelection(tasks[0]);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        if (tasks.length) {
          this.taskStore.selectTask(tasks[tasks.length - 1].id);
          this.announceTaskSelection(tasks[tasks.length - 1]);
        }
        break;
      }
    }
  }

  private announceTaskSelection(task: Todo | undefined): void {
    if (task) {
      const status = task.completed ? 'Completed' : 'Not completed';
      this.announcements.announce(`${task.title}, ${task.priority} priority, ${status}`);
    }
  }

  resetForm(): void {
    this.formData.set({ title: '', description: '', priority: 'medium', dueDate: '' });
    this.formErrors.set({ title: '' });
    this.editingTaskId.set(null);
  }
}
