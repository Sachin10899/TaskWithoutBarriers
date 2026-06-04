import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../../models/todo.model';
import { AccessibilityAnnouncementService } from '../../../core/services/accessibility-announcement.service';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';

@Component({
  selector: 'app-accessible-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="task-card"
      [class.completed]="task().completed"
      [class.selected]="selected()"
      role="article"
      [attr.aria-label]="getAriaLabel()"
      [tabindex]="0"
      (keydown.enter)="openTask.emit(task())"
      (keydown.space)="$event.preventDefault(); toggleTask()"
      (keydown.delete)="$event.preventDefault(); deleteTask.emit(task())"
      (click)="openTask.emit(task())">
      <div class="task-card-header">
        <label class="task-checkbox-label" [attr.aria-label]="'Toggle completion for ' + task().title">
          <input
            type="checkbox"
            [checked]="task().completed"
            [attr.aria-label]="'Mark ' + task().title + (task().completed ? ' as incomplete' : ' as complete')"
            class="task-checkbox"
            (change)="toggleTask()"
            (click)="$event.stopPropagation()">
          <span class="checkmark" aria-hidden="true"></span>
        </label>
        <div class="task-info">
          <h3 class="task-title" [class.strikethrough]="task().completed">{{ task().title }}</h3>
          @if (task().description) {
            <p class="task-description">{{ task().description }}</p>
          }
        </div>
        <span
          class="task-priority"
          [class]="'priority-' + task().priority"
          [attr.aria-label]="'Priority: ' + task().priority">
          {{ task().priority }}
        </span>
      </div>
      <div class="task-card-footer">
        @if (task().dueDate) {
          <span class="task-due" [class.overdue]="isOverdue()">
            <span aria-hidden="true">&#128197;</span>
            <span>Due: {{ formatDate(task().dueDate!) }}</span>
          </span>
        }
        <div class="task-actions">
          <button
            class="task-action-btn"
            [attr.aria-label]="'Edit ' + task().title"
            (click)="$event.stopPropagation(); editTask.emit(task())">
            <span aria-hidden="true">&#9998;</span>
            <span class="sr-only">Edit</span>
          </button>
          <button
            class="task-action-btn delete-btn"
            [attr.aria-label]="'Delete ' + task().title"
            (click)="$event.stopPropagation(); deleteTask.emit(task())">
            <span aria-hidden="true">&#128465;</span>
            <span class="sr-only">Delete</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background: var(--surface, #fff);
      border: 1px solid var(--border, #e0e0e0);
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .task-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .task-card:focus-visible {
      outline: 3px solid var(--focus, #005fcc);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(0,95,204,0.2);
    }
    .task-card.selected { border-color: var(--primary, #005fcc); }
    .task-card.completed { opacity: 0.7; background: var(--completed-bg, #f9f9f9); }
    .task-card-header { display: flex; align-items: flex-start; gap: 12px; }
    .task-checkbox-label { display: flex; align-items: center; cursor: pointer; }
    .task-checkbox {
      width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary, #005fcc);
    }
    .task-checkbox:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .task-info { flex: 1; }
    .task-title { margin: 0 0 4px; font-size: 1.1rem; font-weight: 600; }
    .task-title.strikethrough { text-decoration: line-through; }
    .task-description { margin: 0; color: var(--text-secondary, #666); font-size: 0.9rem; }
    .task-priority {
      padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;
      text-transform: capitalize; flex-shrink: 0;
    }
    .priority-high { background: #fde8e8; color: #c53030; }
    .priority-medium { background: #fef3cd; color: #856404; }
    .priority-low { background: #d4edda; color: #155724; }
    .task-card-footer {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border, #e0e0e0);
    }
    .task-due { font-size: 0.85rem; color: var(--text-secondary, #666); display: flex; align-items: center; gap: 4px; }
    .task-due.overdue { color: #dc3545; font-weight: 600; }
    .task-actions { display: flex; gap: 4px; }
    .task-action-btn {
      background: none; border: 1px solid transparent; cursor: pointer;
      padding: 6px 8px; border-radius: 4px; font-size: 1rem;
      color: var(--text-secondary, #666);
    }
    .task-action-btn:hover { background: var(--hover-bg, #f0f0f0); color: var(--text-primary, #1a1a1a); }
    .task-action-btn:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: 2px;
    }
    .delete-btn:hover { color: #dc3545; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `]
})
export class AccessibleTaskCardComponent {
  task = input.required<Todo>();
  selected = input<boolean>(false);
  openTask = output<Todo>();
  editTask = output<Todo>();
  deleteTask = output<Todo>();
  toggled = output<Todo>();

  private announcements = inject(AccessibilityAnnouncementService);
  private audio = inject(AudioFeedbackService);

  getAriaLabel(): string {
    const t = this.task();
    const status = t.completed ? 'Completed' : 'Not completed';
    const due = t.dueDate ? `Due ${this.formatDate(t.dueDate)}` : 'No due date';
    return `${t.title}. ${t.priority} priority. ${due}. ${status}.`;
  }

  toggleTask(): void {
    const t = this.task();
    this.audio.play(t.completed ? 'uncheck' : 'check');
    this.toggled.emit(t);
    this.announcements.announce(
      t.completed ? `${t.title} marked as incomplete` : `${t.title} marked as complete`
    );
  }

  isOverdue(): boolean {
    const dueDate = this.task().dueDate;
    return !!dueDate && new Date(dueDate) < new Date();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }
}
