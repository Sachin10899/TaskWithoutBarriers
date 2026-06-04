import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SettingsStore } from '../../stores/settings.store';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';
import { NotificationService } from '../../core/services/notification.service';
import { AudioFeedbackService } from '../../core/services/audio-feedback.service';

@Component({
  selector: 'app-accessibility-center',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="accessibility-center" role="main" aria-label="Accessibility Center">
      <header class="page-header">
        <h1>Accessibility Center</h1>
        <p class="subtitle">Customize your accessibility preferences</p>
      </header>

      <div class="settings-grid">
        <section class="settings-section" aria-label="Screen reader settings">
          <h2>Screen Reader</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Screen Reader Mode</span>
              <span class="setting-desc">Optimize announcements for screen readers</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().screenReaderMode"
              [attr.aria-pressed]="accessibility().screenReaderMode"
              [attr.aria-label]="accessibility().screenReaderMode ? 'Disable screen reader mode' : 'Enable screen reader mode'"
              (click)="toggleSetting('screenReaderMode')">
              {{ accessibility().screenReaderMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Announce on Focus</span>
              <span class="setting-desc">Automatically announce elements when focused</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().announceOnFocus"
              [attr.aria-pressed]="accessibility().announceOnFocus"
              [attr.aria-label]="accessibility().announceOnFocus ? 'Disable focus announcements' : 'Enable focus announcements'"
              (click)="toggleSetting('announceOnFocus')">
              {{ accessibility().announceOnFocus ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Announce on Navigation</span>
              <span class="setting-desc">Announce page changes when navigating</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().announceOnNavigation"
              [attr.aria-pressed]="accessibility().announceOnNavigation"
              [attr.aria-label]="accessibility().announceOnNavigation ? 'Disable navigation announcements' : 'Enable navigation announcements'"
              (click)="toggleSetting('announceOnNavigation')">
              {{ accessibility().announceOnNavigation ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </section>

        <section class="settings-section" aria-label="Speech announcement settings">
          <h2>Speech Announcements</h2>
          <p class="section-desc">Configure voice announcements for UI interactions</p>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Speech Announcements</span>
              <span class="setting-desc">Speak element names when navigating or clicking</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().speechAnnouncementEnabled"
              [attr.aria-pressed]="accessibility().speechAnnouncementEnabled"
              [attr.aria-label]="accessibility().speechAnnouncementEnabled ? 'Disable speech announcements' : 'Enable speech announcements'"
              (click)="toggleSpeech()">
              {{ accessibility().speechAnnouncementEnabled ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <label for="speech-volume" class="setting-label">
              <span class="setting-name">Speech Volume</span>
              <span class="setting-desc">Adjust voice volume</span>
            </label>
            <input
              type="range"
              id="speech-volume"
              min="0"
              max="100"
              [value]="accessibility().speechAnnouncementVolume * 100"
              (change)="onSpeechVolumeChange($event)"
              class="setting-range"
              [attr.aria-label]="'Speech volume: ' + (accessibility().speechAnnouncementVolume * 100) + ' percent'">
          </div>
          <div class="setting-item">
            <label for="speech-rate" class="setting-label">
              <span class="setting-name">Speech Rate</span>
              <span class="setting-desc">Adjust speaking speed</span>
            </label>
            <input
              type="range"
              id="speech-rate"
              min="50"
              max="200"
              [value]="accessibility().speechAnnouncementRate * 100"
              (change)="onSpeechRateChange($event)"
              class="setting-range"
              [attr.aria-label]="'Speech rate: ' + accessibility().speechAnnouncementRate + ' times'">
          </div>
          <div class="setting-item">
            <label for="speech-pitch" class="setting-label">
              <span class="setting-name">Speech Pitch</span>
              <span class="setting-desc">Adjust voice pitch</span>
            </label>
            <input
              type="range"
              id="speech-pitch"
              min="0"
              max="200"
              [value]="accessibility().speechAnnouncementPitch * 100"
              (change)="onSpeechPitchChange($event)"
              class="setting-range"
              [attr.aria-label]="'Speech pitch: ' + accessibility().speechAnnouncementPitch">
          </div>
          <div class="setting-item">
            <label for="speech-language" class="setting-label">
              <span class="setting-name">Speech Language</span>
              <span class="setting-desc">Choose the language for voice announcements</span>
            </label>
            <select
              id="speech-language"
              [value]="accessibility().speechAnnouncementLanguage"
              (change)="onSpeechLanguageChange($event)"
              class="setting-select">
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="hi-IN">Hindi</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>
        </section>

        <section class="settings-section" aria-label="Visual settings">
          <h2>Visual Accessibility</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">High Contrast Mode</span>
              <span class="setting-desc">Increase color contrast for better visibility</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().highContrastMode"
              [attr.aria-pressed]="accessibility().highContrastMode"
              [attr.aria-label]="accessibility().highContrastMode ? 'Disable high contrast mode' : 'Enable high contrast mode'"
              (click)="toggleHighContrast()">
              {{ accessibility().highContrastMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Dark Mode</span>
              <span class="setting-desc">Use a dark color scheme</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().darkMode"
              [attr.aria-pressed]="accessibility().darkMode"
              [attr.aria-label]="accessibility().darkMode ? 'Disable dark mode' : 'Enable dark mode'"
              (click)="toggleDarkMode()">
              {{ accessibility().darkMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Light Mode</span>
              <span class="setting-desc">Use a light color scheme</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().lightMode"
              [attr.aria-pressed]="accessibility().lightMode"
              [attr.aria-label]="accessibility().lightMode ? 'Disable light mode' : 'Enable light mode'"
              (click)="toggleLightMode()">
              {{ accessibility().lightMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Large Text Mode</span>
              <span class="setting-desc">Increase font size globally</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().largeTextMode"
              [attr.aria-pressed]="accessibility().largeTextMode"
              [attr.aria-label]="accessibility().largeTextMode ? 'Disable large text mode' : 'Enable large text mode'"
              (click)="toggleLargeText()">
              {{ accessibility().largeTextMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </section>

        <section class="settings-section" aria-label="Motion and focus settings">
          <h2>Motion & Focus</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Reduced Motion Mode</span>
              <span class="setting-desc">Disable animations and transitions</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().reducedMotionMode"
              [attr.aria-pressed]="accessibility().reducedMotionMode"
              [attr.aria-label]="accessibility().reducedMotionMode ? 'Disable reduced motion mode' : 'Enable reduced motion mode'"
              (click)="toggleReducedMotion()">
              {{ accessibility().reducedMotionMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Enhanced Focus Mode</span>
              <span class="setting-desc">Show stronger keyboard focus indicators</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().enhancedFocusMode"
              [attr.aria-pressed]="accessibility().enhancedFocusMode"
              [attr.aria-label]="accessibility().enhancedFocusMode ? 'Disable enhanced focus mode' : 'Enable enhanced focus mode'"
              (click)="toggleEnhancedFocus()">
              {{ accessibility().enhancedFocusMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-name">Dyslexia Friendly Mode</span>
              <span class="setting-desc">Use dyslexia-friendly fonts and spacing</span>
            </div>
            <button
              class="toggle-btn"
              [class.active]="accessibility().dyslexiaFriendlyMode"
              [attr.aria-pressed]="accessibility().dyslexiaFriendlyMode"
              [attr.aria-label]="accessibility().dyslexiaFriendlyMode ? 'Disable dyslexia friendly mode' : 'Enable dyslexia friendly mode'"
              (click)="toggleDyslexiaFriendly()">
              {{ accessibility().dyslexiaFriendlyMode ? 'Enabled' : 'Disabled' }}
            </button>
          </div>
        </section>

        <section class="settings-section" aria-label="Keyboard shortcut guide">
          <h2>Keyboard Shortcuts</h2>
          <p class="section-desc">All keyboard shortcuts available in the application:</p>
          <dl class="shortcut-list">
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>D</kbd></dt>
              <dd>Open Dashboard</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>T</kbd></dt>
              <dd>Open My Tasks</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>C</kbd></dt>
              <dd>Open Completed Tasks</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>S</kbd></dt>
              <dd>Open Settings</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>A</kbd></dt>
              <dd>Open Accessibility Center</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>H</kbd></dt>
              <dd>Open Help</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>N</kbd></dt>
              <dd>Create New Task</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Alt</kbd> + <kbd>F</kbd></dt>
              <dd>Focus Search</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>?</kbd></dt>
              <dd>Toggle Keyboard Shortcut Guide</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Escape</kbd></dt>
              <dd>Close Dialog</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Delete</kbd></dt>
              <dd>Delete Selected Task</dd>
            </div>
            <div class="shortcut-item">
              <dt><kbd>Arrow Keys</kbd></dt>
              <dd>Navigate task list</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .accessibility-center { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 2rem; margin: 0 0 4px; color: var(--text-primary, #1a1a1a); }
    .subtitle { margin: 0; color: var(--text-secondary, #666); }
    .settings-grid { display: flex; flex-direction: column; gap: 24px; }
    .settings-section {
      background: var(--surface, #fff); border: 1px solid var(--border, #e0e0e0);
      border-radius: 12px; padding: 24px;
    }
    .settings-section h2 { margin: 0 0 8px; font-size: 1.3rem; color: var(--text-primary, #1a1a1a); }
    .section-desc { margin: 0 0 16px; color: var(--text-secondary, #666); }
    .setting-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid var(--border, #e0e0e0);
      gap: 16px;
    }
    .setting-item:last-child { border-bottom: none; }
    .setting-label { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .setting-name { font-weight: 600; color: var(--text-primary, #1a1a1a); }
    .setting-desc { font-size: 0.85rem; color: var(--text-secondary, #666); }
    .toggle-btn {
      padding: 8px 20px; border: 2px solid var(--border, #e0e0e0);
      border-radius: 20px; font-size: 0.9rem; font-weight: 500;
      cursor: pointer; background: var(--surface, #fff);
      color: var(--text-secondary, #666);
      transition: all 0.2s;
    }
    .toggle-btn.active {
      background: var(--primary, #005fcc); color: #fff;
      border-color: var(--primary, #005fcc);
    }
    .toggle-btn:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: 2px;
    }
    .setting-range {
      width: 160px; height: 6px; cursor: pointer;
      accent-color: var(--primary, #005fcc);
    }
    .setting-range:focus-visible { outline: 3px solid var(--focus, #005fcc); outline-offset: 2px; }
    .shortcut-list { margin: 0; }
    .shortcut-item {
      display: flex; align-items: center; gap: 16px;
      padding: 8px 0; border-bottom: 1px solid var(--border, #e0e0e0);
    }
    .shortcut-item:last-child { border-bottom: none; }
    .shortcut-item dt { font-weight: 600; min-width: 180px; }
    .shortcut-item dd { margin: 0; color: var(--text-secondary, #666); }
    kbd {
      display: inline-block; padding: 2px 8px;
      background: var(--kbd-bg, #f0f0f0); border: 1px solid var(--border, #e0e0e0);
      border-radius: 4px; font-family: monospace; font-size: 0.85rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  `]
})
export class AccessibilityCenterComponent {
  private settingsStore = inject(SettingsStore);
  private announcements = inject(AccessibilityAnnouncementService);
  private notifications = inject(NotificationService);
  private audio = inject(AudioFeedbackService);

  accessibility = this.settingsStore.accessibility;

  toggleSetting(key: string): void {
    const currentValue = (this.accessibility() as any)[key];
    this.audio.play(currentValue ? 'toggle-off' : 'toggle-on');
    this.settingsStore.updateAccessibility({
      [key]: !currentValue
    });
    const value = (this.accessibility() as any)[key];
    const status = value ? 'enabled' : 'disabled';
    this.announcements.announce(`${this.formatKey(key)} ${status}`);
    this.notifications.info(`${this.formatKey(key)} ${status}`);
  }

  toggleSpeech(): void {
    const wasEnabled = this.accessibility().speechAnnouncementEnabled;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleSpeechAnnouncement();
    const enabled = this.accessibility().speechAnnouncementEnabled;
    this.announcements.announce(`Speech announcements ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Speech announcements ${enabled ? 'enabled' : 'disabled'}`);
  }

  onSpeechVolumeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber / 100;
    this.settingsStore.setSpeechVolume(value);
    this.announcements.announce(`Speech volume set to ${Math.round(value * 100)} percent`);
  }

  onSpeechRateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber / 100;
    this.settingsStore.setSpeechRate(value);
    this.announcements.announce(`Speech rate set to ${value.toFixed(1)}`);
  }

  onSpeechPitchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber / 100;
    this.settingsStore.setSpeechPitch(value);
    this.announcements.announce(`Speech pitch set to ${value.toFixed(1)}`);
  }

  onSpeechLanguageChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.settingsStore.setSpeechLanguage(value);
    this.announcements.announce(`Speech language changed to ${value}`);
  }

  toggleHighContrast(): void {
    const wasEnabled = this.accessibility().highContrastMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleHighContrast();
    const enabled = this.accessibility().highContrastMode;
    this.announcements.announce(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleDarkMode(): void {
    const wasEnabled = this.accessibility().darkMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleDarkMode();
    const enabled = this.accessibility().darkMode;
    this.announcements.announce(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleLightMode(): void {
    this.audio.play('toggle-on');
    this.settingsStore.updateTheme('light');
    this.announcements.announce('Light mode enabled');
    this.notifications.info('Light mode enabled');
  }

  toggleLargeText(): void {
    const wasEnabled = this.accessibility().largeTextMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleLargeText();
    const enabled = this.accessibility().largeTextMode;
    this.announcements.announce(`Large text mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Large text mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleReducedMotion(): void {
    const wasEnabled = this.accessibility().reducedMotionMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleReducedMotion();
    const enabled = this.accessibility().reducedMotionMode;
    this.announcements.announce(`Reduced motion mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Reduced motion mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleEnhancedFocus(): void {
    const wasEnabled = this.accessibility().enhancedFocusMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleEnhancedFocus();
    const enabled = this.accessibility().enhancedFocusMode;
    this.announcements.announce(`Enhanced focus mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Enhanced focus mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  toggleDyslexiaFriendly(): void {
    const wasEnabled = this.accessibility().dyslexiaFriendlyMode;
    this.audio.play(wasEnabled ? 'toggle-off' : 'toggle-on');
    this.settingsStore.toggleDyslexiaFriendly();
    const enabled = this.accessibility().dyslexiaFriendlyMode;
    this.announcements.announce(`Dyslexia friendly mode ${enabled ? 'enabled' : 'disabled'}`);
    this.notifications.info(`Dyslexia friendly mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }
}
