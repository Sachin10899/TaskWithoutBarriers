import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TaskStore } from '../../stores/task.store';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';
import { NotificationService } from '../../core/services/notification.service';
import { AudioFeedbackService } from '../../core/services/audio-feedback.service';
import { AccessibleTaskCardComponent } from '../../shared/components/accessible-task-card/accessible-task-card.component';
import { AccessibleSearchComponent } from '../../shared/components/accessible-search/accessible-search.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [
    AccessibleTaskCardComponent, AccessibleSearchComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="completed-tasks" role="main" aria-label="Completed Tasks">
      <header class="page-header">
        <h1>Completed Tasks</h1>
        <p class="subtitle">Review and manage your completed tasks</p>
      </header>

      <section class="toolbar-section" aria-label="Completed tasks toolbar">
        <app-accessible-search
          label="Search completed tasks"
          placeholder="Search completed tasks..."
          [searchValue]="searchValue()"
          [resultCount]="filteredTasks().length"
          (searchChanged)="onSearchChange($event)">
        </app-accessible-search>

        @if (completedTasks().length > 0) {
          <div class="actions-bar">
            <button
              class="btn-danger-outline"
              (click)="confirmClearAll()"
              aria-label="Clear all completed tasks">
              <span aria-hidden="true">&#128465;</span>
              <span>Clear All</span>
            </button>
          </div>
        }
      </section>

      <section class="tasks-section" aria-label="Completed tasks list">
        <div class="tasks-count" role="status" aria-live="polite">
          {{ filteredTasks().length }} {{ filteredTasks().length === 1 ? 'completed task' : 'completed tasks' }}
        </div>

        @if (filteredTasks().length === 0) {
          <div class="empty-state" role="status">
            <div class="empty-icon" aria-hidden="true">&#10004;</div>
            <h2>No Completed Tasks</h2>
            <p>Tasks you complete will appear here.</p>
          </div>
        } @else {
          <div class="task-grid">
            @for (task of filteredTasks(); track task.id) {
              <app-accessible-task-card
                [task]="task"
                (openTask)="reopenTask($event)"
                (editTask)="reopenTask($event)"
                (deleteTask)="deleteTask($event)"
                (toggled)="reopenTask($event)">
              </app-accessible-task-card>
            }
          </div>
        }
      </section>

      <!-- Clear All Confirmation -->
      <div
        class="dialog-overlay"
        [class.visible]="showClearConfirm()"
        [attr.aria-hidden]="!showClearConfirm()"
        role="dialog"
        aria-modal="true"
        aria-label="Confirm clear all completed tasks"
        (keydown.escape)="showClearConfirm.set(false)">
        @if (showClearConfirm()) {
          <div class="dialog-box">
            <h2>Clear All Completed Tasks</h2>
            <p>Are you sure you want to delete all completed tasks? This action cannot be undone.</p>
            <div class="form-actions">
              <button class="btn-secondary" (click)="showClearConfirm.set(false)">
                Cancel
              </button>
              <button class="btn-danger" (click)="clearAll()">
                Clear All
              </button>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .completed-tasks { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 2rem; margin: 0 0 4px; color: var(--text-primary, #1a1a1a); }
    .subtitle { margin: 0; color: var(--text-secondary, #666); }
    .toolbar-section { margin-bottom: 24px; }
    .actions-bar { margin-top: 12px; display: flex; gap: 8px; }
    .tasks-count { margin-bottom: 16px; font-size: 0.95rem; color: var(--text-secondary, #666); }
    .task-grid { display: flex; flex-direction: column; gap: 12px; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-state h2 { margin: 0 0 8px; }
    .empty-state p { margin: 0; color: var(--text-secondary, #666); }
    .dialog-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: none; align-items: center; justify-content: center; z-index: 1000;
    }
    .dialog-overlay.visible { display: flex; }
    .dialog-box {
      background: var(--surface, #fff); border-radius: 12px; padding: 24px;
      max-width: 440px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .dialog-box h2 { margin: 0 0 12px; }
    .dialog-box p { margin: 0 0 20px; color: var(--text-secondary, #666); }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-secondary {
      padding: 10px 20px; border: 2px solid var(--border, #e0e0e0); border-radius: 6px;
      font-size: 1rem; cursor: pointer; background: var(--surface, #fff); color: var(--text-primary, #1a1a1a);
    }
    .btn-secondary:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .btn-danger {
      padding: 10px 20px; border: none; border-radius: 6px; font-size: 1rem;
      font-weight: 600; cursor: pointer; background: #dc3545; color: #fff;
    }
    .btn-danger:focus-visible { outline: 3px solid var(--focus, #dc3545); outline-offset: 2px; }
    .btn-danger-outline {
      padding: 8px 16px; border: 2px solid #dc3545; border-radius: 6px;
      font-size: 0.9rem; cursor: pointer; background: transparent; color: #dc3545;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .btn-danger-outline:hover { background: #dc3545; color: #fff; }
    .btn-danger-outline:focus-visible { outline: 3px solid var(--focus, #dc3545); outline-offset: 2px; }
  `]
})
export class CompletedTasksComponent implements OnInit {
  private taskStore = inject(TaskStore);
  private announcements = inject(AccessibilityAnnouncementService);
  private notifications = inject(NotificationService);
  private audio = inject(AudioFeedbackService);

  completedTasks = this.taskStore.completedTasks;
  searchValue = signal('');
  showClearConfirm = signal(false);

  filteredTasks = signal<Todo[]>([]);

  ngOnInit(): void {
    this.updateFiltered();
    const count = this.completedTasks().length;
    this.announcements.announceContext(
      'Completed Tasks',
      count,
      'Use search to find specific completed tasks.'
    );
  }

  onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.updateFiltered();
    const count = this.filteredTasks().length;
    this.announcements.announce(`Search results: ${count} completed tasks found`);
  }

  private updateFiltered(): void {
    const tasks = this.completedTasks();
    const search = this.searchValue().toLowerCase();
    this.filteredTasks.set(
      search ? tasks.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      ) : tasks
    );
  }

  reopenTask(task: Todo): void {
    this.audio.play('uncheck');
    this.taskStore.toggleComplete(task.id);
    this.notifications.success(`Task "${task.title}" reopened`);
    this.announcements.announce(`Task "${task.title}" reopened`);
  }

  deleteTask(task: Todo): void {
    this.audio.play('delete');
    this.taskStore.deleteTask(task.id);
    this.notifications.success(`Task "${task.title}" deleted`);
    this.announcements.announce(`Task "${task.title}" deleted`);
    this.updateFiltered();
  }

  confirmClearAll(): void {
    this.showClearConfirm.set(true);
    this.announcements.announce('Confirm clearing all completed tasks');
  }

  clearAll(): void {
    this.audio.play('delete');
    this.taskStore.clearCompleted();
    this.notifications.success('All completed tasks cleared');
    this.announcements.announce('All completed tasks cleared');
    this.showClearConfirm.set(false);
    this.updateFiltered();
  }
}
