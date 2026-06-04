import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationType } from '../../../models/notification.model';

@Component({
  selector: 'app-accessible-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="notification-container" role="region" aria-label="Notifications">
      @for (notification of notificationService.activeNotifications(); track notification.id) {
        <div
          class="notification"
          [class]="'notification notification-' + notification.type"
          role="alert"
          [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'"
          [attr.aria-atomic]="true">
          <span class="notification-icon" aria-hidden="true">
            @switch (notification.type) {
              @case ('success') { <span>&#10003;</span> }
              @case ('error') { <span>&#10007;</span> }
              @case ('warning') { <span>!</span> }
              @case ('info') { <span>i</span> }
            }
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button
            class="notification-dismiss"
            [attr.aria-label]="'Dismiss notification: ' + notification.message"
            (click)="dismiss(notification.id)">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed; top: 16px; right: 16px; z-index: 2000;
      display: flex; flex-direction: column; gap: 8px;
      max-width: 400px; width: calc(100% - 32px);
    }
    .notification {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .notification-success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
    .notification-error { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
    .notification-warning { background: #fff3cd; color: #856404; border-left: 4px solid #ffc107; }
    .notification-info { background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8; }
    .notification-icon { font-weight: bold; font-size: 1.2rem; flex-shrink: 0; }
    .notification-message { flex: 1; }
    .notification-dismiss {
      background: none; border: none; cursor: pointer;
      font-size: 1.2rem; padding: 2px 6px; border-radius: 4px;
      color: inherit; opacity: 0.7;
    }
    .notification-dismiss:hover { opacity: 1; }
    .notification-dismiss:focus-visible {
      outline: 3px solid var(--focus, #005fcc);
      outline-offset: 2px;
      opacity: 1;
    }
  `]
})
export class AccessibleNotificationComponent {
  notificationService = inject(NotificationService);

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
