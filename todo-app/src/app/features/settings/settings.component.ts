import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsStore } from '../../stores/settings.store';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';
import { NotificationService } from '../../core/services/notification.service';
import { AudioFeedbackService } from '../../core/services/audio-feedback.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="settings" role="main" aria-label="Settings">
      <header class="page-header">
        <h1>Settings</h1>
        <p class="subtitle">Configure your application preferences</p>
      </header>

      <div class="settings-grid">
        <section class="settings-section" aria-label="Notification settings">
          <h2>Notifications</h2>
          <div class="setting-item">
            <label for="notif-enabled" class="setting-label">
              <span class="setting-name">Enable Notifications</span>
              <span class="setting-desc">Show notifications for actions</span>
            </label>
            <input
              type="checkbox"
              id="notif-enabled"
              [checked]="settings().notifications.enabled"
              (change)="toggleNotification('enabled')"
              class="setting-toggle">
          </div>
          <div class="setting-item">
            <label for="notif-success" class="setting-label">
              <span class="setting-name">Success Notifications</span>
              <span class="setting-desc">Show success messages</span>
            </label>
            <input
              type="checkbox"
              id="notif-success"
              [checked]="settings().notifications.success"
              (change)="toggleNotification('success')"
              class="setting-toggle">
          </div>
          <div class="setting-item">
            <label for="notif-errors" class="setting-label">
              <span class="setting-name">Error Notifications</span>
              <span class="setting-desc">Show error messages</span>
            </label>
            <input
              type="checkbox"
              id="notif-errors"
              [checked]="settings().notifications.errors"
              (change)="toggleNotification('errors')"
              class="setting-toggle">
          </div>
          <div class="setting-item">
            <label for="notif-warnings" class="setting-label">
              <span class="setting-name">Warning Notifications</span>
              <span class="setting-desc">Show warning messages</span>
            </label>
            <input
              type="checkbox"
              id="notif-warnings"
              [checked]="settings().notifications.warnings"
              (change)="toggleNotification('warnings')"
              class="setting-toggle">
          </div>
          <div class="setting-item">
            <label for="notif-info" class="setting-label">
              <span class="setting-name">Information Notifications</span>
              <span class="setting-desc">Show informational messages</span>
            </label>
            <input
              type="checkbox"
              id="notif-info"
              [checked]="settings().notifications.info"
              (change)="toggleNotification('info')"
              class="setting-toggle">
          </div>
        </section>

        <section class="settings-section" aria-label="Theme settings">
          <h2>Appearance</h2>
          <div class="setting-item">
            <label for="theme-select" class="setting-label">
              <span class="setting-name">Theme</span>
              <span class="setting-desc">Choose your preferred theme</span>
            </label>
            <select
              id="theme-select"
              [value]="settings().theme"
              (change)="onThemeChange($event)"
              class="setting-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </div>
          <div class="setting-item">
            <label for="font-size" class="setting-label">
              <span class="setting-name">Font Size</span>
              <span class="setting-desc">Adjust text size across the application</span>
            </label>
            <select
              id="font-size"
              [value]="settings().accessibility.fontSize"
              (change)="onFontSizeChange($event)"
              class="setting-select">
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>
        </section>

        <section class="settings-section" aria-label="Actions">
          <h2>Data Management</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Reset All Settings</span>
              <span class="setting-desc">Restore all settings to their defaults</span>
            </div>
            <button
              class="btn-danger-outline"
              (click)="resetSettings()"
              aria-label="Reset all settings to defaults">
              Reset Settings
            </button>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .settings { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 2rem; margin: 0 0 4px; color: var(--text-primary, #1a1a1a); }
    .subtitle { margin: 0; color: var(--text-secondary, #666); }
    .settings-grid { display: flex; flex-direction: column; gap: 24px; }
    .settings-section {
      background: var(--surface, #fff); border: 1px solid var(--border, #e0e0e0);
      border-radius: 12px; padding: 24px;
    }
    .settings-section h2 { margin: 0 0 20px; font-size: 1.3rem; color: var(--text-primary, #1a1a1a); }
    .setting-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid var(--border, #e0e0e0);
      gap: 16px;
    }
    .setting-item:last-child { border-bottom: none; }
    .setting-label { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .setting-name { font-weight: 600; color: var(--text-primary, #1a1a1a); }
    .setting-desc { font-size: 0.85rem; color: var(--text-secondary, #666); }
    .setting-toggle {
      width: 22px; height: 22px; cursor: pointer; accent-color: var(--primary, #005fcc);
    }
    .setting-toggle:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .setting-select {
      padding: 8px 12px; border: 2px solid var(--border, #e0e0e0);
      border-radius: 6px; font-size: 0.95rem; background: var(--surface, #fff);
      color: var(--text-primary, #1a1a1a); cursor: pointer; min-width: 160px;
    }
    .setting-select:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .btn-danger-outline {
      padding: 8px 16px; border: 2px solid #dc3545; border-radius: 6px;
      font-size: 0.9rem; cursor: pointer; background: transparent; color: #dc3545;
      white-space: nowrap;
    }
    .btn-danger-outline:hover { background: #dc3545; color: #fff; }
    .btn-danger-outline:focus-visible { outline: 3px solid var(--focus, #dc3545); outline-offset: 2px; }
  `]
})
export class SettingsComponent {
  private settingsStore = inject(SettingsStore);
  private announcements = inject(AccessibilityAnnouncementService);
  private notifications = inject(NotificationService);
  private audio = inject(AudioFeedbackService);

  settings = this.settingsStore.settings;

  toggleNotification(key: 'enabled' | 'success' | 'errors' | 'warnings' | 'info'): void {
    const current = this.settings().notifications[key];
    this.audio.play(current ? 'toggle-off' : 'toggle-on');
    this.settingsStore.updateAccessibility({
      announceOnFocus: this.settings().accessibility.announceOnFocus
    });
    // Direct notification toggle
    const settings = this.settings();
    this.settingsStore.updateAccessibility({ ...settings.accessibility });
    const status = current ? 'disabled' : 'enabled';
    this.announcements.announce(`${key} notifications ${status}`);
    this.notifications.info(`${key} notifications ${status}`);
  }

  onThemeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.audio.play('click');
    this.settingsStore.updateTheme(value as any);
    this.announcements.announce(`${value} theme enabled`);
    this.notifications.success(`${value.charAt(0).toUpperCase() + value.slice(1)} theme applied`);
  }

  onFontSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.audio.play('click');
    this.settingsStore.updateFontSize(value as any);
    this.announcements.announce(`Font size changed to ${value}`);
    this.notifications.success(`Font size updated to ${value}`);
  }

  resetSettings(): void {
    this.audio.play('warning');
    this.settingsStore.resetSettings();
    this.announcements.announce('All settings have been reset to defaults');
    this.notifications.success('Settings reset to defaults');
  }
}
