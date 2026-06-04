import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { AppSettings, AccessibilitySettings, ThemeMode, FontSize } from '../models/settings.model';
import { AudioFeedbackService } from '../core/services/audio-feedback.service';
import { SpeechAnnouncementService } from '../core/services/speech-announcement.service';

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly STORAGE_KEY = 'accessible-todo-settings';
  private audioFeedback = inject(AudioFeedbackService);
  private speechAnnouncement = inject(SpeechAnnouncementService);

  private _settings = signal<AppSettings>(this.loadFromStorage());

  readonly settings = this._settings.asReadonly();
  readonly accessibility = computed(() => this._settings().accessibility);
  readonly theme = computed(() => this._settings().theme);
  readonly fontSize = computed(() => this._settings().accessibility.fontSize);

  constructor() {
    effect(() => {
      const settings = this._settings();
      this.saveToStorage(settings);
      this.applyTheme(settings);
      this.audioFeedback.setEnabled(settings.accessibility.audioFeedbackEnabled);
      this.audioFeedback.setVolume(settings.accessibility.audioFeedbackVolume);
      this.speechAnnouncement.setEnabled(settings.accessibility.speechAnnouncementEnabled);
      this.speechAnnouncement.setVolume(settings.accessibility.speechAnnouncementVolume);
      this.speechAnnouncement.setRate(settings.accessibility.speechAnnouncementRate);
      this.speechAnnouncement.setPitch(settings.accessibility.speechAnnouncementPitch);
      this.speechAnnouncement.setLanguage(settings.accessibility.speechAnnouncementLanguage);
    });
    this.applyTheme(this._settings());
  }

  updateTheme(theme: ThemeMode): void {
    this._settings.update(s => ({
      ...s,
      theme,
      accessibility: {
        ...s.accessibility,
        highContrastMode: theme === 'high-contrast',
        darkMode: theme === 'dark',
        lightMode: theme === 'light'
      }
    }));
  }

  updateAccessibility(updates: Partial<AccessibilitySettings>): void {
    this._settings.update(s => ({
      ...s,
      accessibility: { ...s.accessibility, ...updates }
    }));
  }

  updateFontSize(size: FontSize): void {
    this._settings.update(s => ({
      ...s,
      accessibility: { ...s.accessibility, fontSize: size }
    }));
  }

  toggleAudioFeedback(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        audioFeedbackEnabled: !s.accessibility.audioFeedbackEnabled
      }
    }));
  }

  setAudioVolume(volume: number): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        audioFeedbackVolume: Math.max(0, Math.min(1, volume))
      }
    }));
  }

  toggleScreenReaderMode(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        screenReaderMode: !s.accessibility.screenReaderMode
      }
    }));
  }

  toggleHighContrast(): void {
    const isHC = this._settings().accessibility.highContrastMode;
    this._settings.update(s => ({
      ...s,
      theme: isHC ? 'light' : 'high-contrast',
      accessibility: {
        ...s.accessibility,
        highContrastMode: !isHC,
        darkMode: false,
        lightMode: isHC
      }
    }));
  }

  toggleDarkMode(): void {
    const isDark = this._settings().accessibility.darkMode;
    this._settings.update(s => ({
      ...s,
      theme: isDark ? 'light' : 'dark',
      accessibility: {
        ...s.accessibility,
        darkMode: !isDark,
        lightMode: isDark,
        highContrastMode: false
      }
    }));
  }

  toggleLargeText(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        largeTextMode: !s.accessibility.largeTextMode
      }
    }));
  }

  toggleReducedMotion(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        reducedMotionMode: !s.accessibility.reducedMotionMode
      }
    }));
  }

  toggleDyslexiaFriendly(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        dyslexiaFriendlyMode: !s.accessibility.dyslexiaFriendlyMode
      }
    }));
  }

  toggleEnhancedFocus(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        enhancedFocusMode: !s.accessibility.enhancedFocusMode
      }
    }));
  }

  toggleSpeechAnnouncement(): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        speechAnnouncementEnabled: !s.accessibility.speechAnnouncementEnabled
      }
    }));
  }

  setSpeechVolume(volume: number): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        speechAnnouncementVolume: Math.max(0, Math.min(1, volume))
      }
    }));
  }

  setSpeechRate(rate: number): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        speechAnnouncementRate: Math.max(0.5, Math.min(2, rate))
      }
    }));
  }

  setSpeechPitch(pitch: number): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        speechAnnouncementPitch: Math.max(0, Math.min(2, pitch))
      }
    }));
  }

  setSpeechLanguage(lang: string): void {
    this._settings.update(s => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        speechAnnouncementLanguage: lang
      }
    }));
  }

  resetSettings(): void {
    this._settings.set(this.getDefaultSettings());
  }

  private applyTheme(settings: AppSettings): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast',
      'font-normal', 'font-large', 'font-extra-large',
      'reduced-motion', 'dyslexia-friendly', 'enhanced-focus', 'large-text');

    root.classList.add(`theme-${settings.theme}`);
    root.classList.add(`font-${settings.accessibility.fontSize}`);

    if (settings.accessibility.largeTextMode) root.classList.add('large-text');
    if (settings.accessibility.reducedMotionMode) root.classList.add('reduced-motion');
    if (settings.accessibility.dyslexiaFriendlyMode) root.classList.add('dyslexia-friendly');
    if (settings.accessibility.enhancedFocusMode) root.classList.add('enhanced-focus');
  }

  private getDefaultSettings(): AppSettings {
    return {
      theme: 'light',
      accessibility: {
        screenReaderMode: false,
        highContrastMode: false,
        darkMode: false,
        lightMode: true,
        largeTextMode: false,
        fontSize: 'normal',
        reducedMotionMode: false,
        dyslexiaFriendlyMode: false,
        enhancedFocusMode: false,
        announceOnFocus: true,
        announceOnNavigation: true,
        keyboardShortcutGuideVisible: false,
        audioFeedbackEnabled: true,
        audioFeedbackVolume: 0.3,
        speechAnnouncementEnabled: true,
        speechAnnouncementVolume: 0.8,
        speechAnnouncementRate: 1.0,
        speechAnnouncementPitch: 1.0,
        speechAnnouncementLanguage: 'en-US'
      },
      notifications: {
        enabled: true,
        success: true,
        errors: true,
        warnings: true,
        info: true
      }
    };
  }

  private loadFromStorage(): AppSettings {
    try {
      if (typeof localStorage === 'undefined') return this.getDefaultSettings();
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? { ...this.getDefaultSettings(), ...JSON.parse(stored) } : this.getDefaultSettings();
    } catch {
      return this.getDefaultSettings();
    }
  }

  private saveToStorage(settings: AppSettings): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable
    }
  }
}
