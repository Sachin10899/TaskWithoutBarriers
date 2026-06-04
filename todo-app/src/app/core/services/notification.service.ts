import { Injectable, inject, signal, computed } from '@angular/core';
import { Notification, NotificationType } from '../../models/notification.model';
import { AccessibilityAnnouncementService } from './accessibility-announcement.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private announcements = inject(AccessibilityAnnouncementService);
  private _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  readonly activeNotifications = computed(() =>
    this._notifications().filter(n => Date.now() - n.timestamp < (n.duration || 5000))
  );

  constructor() {
    setInterval(() => this.cleanup(), 1000);
  }

  show(type: NotificationType, message: string, duration = 5000): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration,
      timestamp: Date.now()
    };
    this._notifications.update(n => [...n, notification]);

    switch (type) {
      case 'success':
        this.announcements.announceSuccess(message);
        break;
      case 'error':
        this.announcements.announceError(message);
        break;
      case 'warning':
        this.announcements.announceWarning(message);
        break;
      case 'info':
        this.announcements.announceInfo(message);
        break;
    }
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message, 8000);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: string): void {
    this._notifications.update(n => n.filter(notif => notif.id !== id));
  }

  private cleanup(): void {
    const now = Date.now();
    this._notifications.update(n =>
      n.filter(notif => now - notif.timestamp < (notif.duration || 5000) + 1000)
    );
  }
}
