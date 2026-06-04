import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskStore } from '../../stores/task.store';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="dashboard" role="main" aria-label="Dashboard">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="dashboard-subtitle">Overview of your tasks and progress</p>
      </header>

      <section class="stats-grid" aria-label="Task statistics">
        <div class="stat-card" role="status" [attr.aria-label]="stats().total + ' total tasks'">
          <div class="stat-icon" aria-hidden="true">&#128203;</div>
          <div class="stat-value">{{ stats().total }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-card" role="status" [attr.aria-label]="stats().active + ' active tasks'">
          <div class="stat-icon active-icon" aria-hidden="true">&#9889;</div>
          <div class="stat-value">{{ stats().active }}</div>
          <div class="stat-label">Active</div>
        </div>
        <div class="stat-card" role="status" [attr.aria-label]="stats().completed + ' completed tasks'">
          <div class="stat-icon completed-icon" aria-hidden="true">&#10004;</div>
          <div class="stat-value">{{ stats().completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card" role="status" [attr.aria-label]="stats().highPriority + ' high priority tasks'">
          <div class="stat-icon priority-icon" aria-hidden="true">&#9888;</div>
          <div class="stat-value">{{ stats().highPriority }}</div>
          <div class="stat-label">High Priority</div>
        </div>
        @if (stats().overdue > 0) {
          <div class="stat-card overdue" role="status" [attr.aria-label]="stats().overdue + ' overdue tasks'">
            <div class="stat-icon overdue-icon" aria-hidden="true">&#9200;</div>
            <div class="stat-value">{{ stats().overdue }}</div>
            <div class="stat-label">Overdue</div>
          </div>
        }
      </section>

      <section class="quick-actions" aria-label="Quick actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <a routerLink="/tasks" class="action-btn primary-action" aria-label="Create new task. Press Alt+N">
            <span aria-hidden="true">+</span>
            <span>New Task</span>
            <kbd aria-hidden="true">Alt+N</kbd>
          </a>
          <a routerLink="/tasks" class="action-btn" aria-label="View all my tasks">
            <span aria-hidden="true">&#128203;</span>
            <span>View Tasks</span>
          </a>
          <a routerLink="/accessibility" class="action-btn" aria-label="Open accessibility settings">
            <span aria-hidden="true">&#9855;</span>
            <span>Accessibility</span>
          </a>
        </div>
      </section>

      @if (activeTasks().length > 0) {
        <section class="recent-tasks" aria-label="Recent active tasks">
          <h2>Recent Active Tasks</h2>
          <ul class="task-list" role="list">
            @for (task of activeTasks().slice(0, 5); track task.id) {
              <li class="task-list-item" role="listitem">
                <a
                  [routerLink]="['/tasks']"
                  class="task-link"
                  [attr.aria-label]="task.title + '. ' + task.priority + ' priority.' + (task.dueDate ? ' Due ' + formatDate(task.dueDate) + '.' : '')">
                  <span class="task-title">{{ task.title }}</span>
                  <span class="task-meta">
                    <span class="priority-badge" [class]="'priority-' + task.priority">{{ task.priority }}</span>
                    @if (task.dueDate) {
                      <span class="due-date">Due: {{ formatDate(task.dueDate) }}</span>
                    }
                  </span>
                </a>
              </li>
            }
          </ul>
          @if (activeTasks().length > 5) {
            <a routerLink="/tasks" class="view-all" aria-label="View all active tasks">
              View all {{ activeTasks().length }} tasks
            </a>
          }
        </section>
      }

      @if (stats().total === 0) {
        <section class="empty-state" aria-label="No tasks yet">
          <div class="empty-icon" aria-hidden="true">&#128221;</div>
          <h2>No Tasks Yet</h2>
          <p>Create your first task to get started.</p>
          <a routerLink="/tasks" class="action-btn primary-action" aria-label="Create your first task">
            <span aria-hidden="true">+</span>
            <span>Create First Task</span>
          </a>
        </section>
      }
    </main>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .dashboard-header { margin-bottom: 32px; }
    .dashboard-header h1 { font-size: 2rem; margin: 0 0 8px; color: var(--text-primary, #1a1a1a); }
    .dashboard-subtitle { margin: 0; color: var(--text-secondary, #666); font-size: 1.1rem; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px; margin-bottom: 32px;
    }
    .stat-card {
      background: var(--surface, #fff); border: 1px solid var(--border, #e0e0e0);
      border-radius: 12px; padding: 20px; text-align: center;
    }
    .stat-icon { font-size: 2rem; margin-bottom: 8px; }
    .active-icon { color: #f59e0b; }
    .completed-icon { color: #10b981; }
    .priority-icon { color: #ef4444; }
    .overdue-icon { color: #dc3545; }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: var(--text-primary, #1a1a1a); }
    .stat-label { font-size: 0.9rem; color: var(--text-secondary, #666); margin-top: 4px; }
    .stat-card.overdue { border-color: #dc3545; background: #fff5f5; }
    .quick-actions { margin-bottom: 32px; }
    .quick-actions h2 { font-size: 1.3rem; margin: 0 0 16px; color: var(--text-primary, #1a1a1a); }
    .action-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 20px; border-radius: 8px;
      text-decoration: none; font-size: 1rem; font-weight: 500;
      background: var(--surface, #fff); color: var(--text-primary, #1a1a1a);
      border: 2px solid var(--border, #e0e0e0);
      transition: all 0.2s;
    }
    .action-btn:hover { border-color: var(--primary, #005fcc); }
    .action-btn:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: 2px;
    }
    .action-btn.primary-action {
      background: var(--primary, #005fcc); color: #fff; border-color: var(--primary, #005fcc);
    }
    .action-btn.primary-action:hover { background: #004ba8; }
    .action-btn kbd {
      font-size: 0.75rem; background: rgba(0,0,0,0.1);
      padding: 2px 6px; border-radius: 3px; font-family: monospace;
    }
    .recent-tasks h2 { font-size: 1.3rem; margin: 0 0 16px; color: var(--text-primary, #1a1a1a); }
    .task-list { list-style: none; padding: 0; margin: 0; }
    .task-list-item { border-bottom: 1px solid var(--border, #e0e0e0); }
    .task-link {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 16px; text-decoration: none; color: var(--text-primary, #1a1a1a);
      border-radius: 8px; transition: background 0.2s;
    }
    .task-link:hover { background: var(--hover-bg, #f5f5f5); }
    .task-link:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: -3px;
    }
    .task-title { font-weight: 500; }
    .task-meta { display: flex; gap: 12px; align-items: center; font-size: 0.9rem; }
    .priority-badge {
      padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: 500;
    }
    .priority-high { background: #fde8e8; color: #c53030; }
    .priority-medium { background: #fef3cd; color: #856404; }
    .priority-low { background: #d4edda; color: #155724; }
    .due-date { color: var(--text-secondary, #666); }
    .view-all {
      display: block; text-align: center; padding: 12px;
      color: var(--primary, #005fcc); text-decoration: none;
      font-weight: 500;
    }
    .view-all:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: -3px; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 4rem; margin-bottom: 16px; }
    .empty-state h2 { margin: 0 0 8px; color: var(--text-primary, #1a1a1a); }
    .empty-state p { margin: 0 0 20px; color: var(--text-secondary, #666); }
  `]
})
export class DashboardComponent implements OnInit {
  private taskStore = inject(TaskStore);
  private announcements = inject(AccessibilityAnnouncementService);

  stats = this.taskStore.taskStats;
  activeTasks = this.taskStore.activeTasks;

  ngOnInit(): void {
    const s = this.stats();
    this.announcements.announceContext(
      'Dashboard',
      s.active,
      `Press Alt+N to create a new task.`
    );
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  }
}
