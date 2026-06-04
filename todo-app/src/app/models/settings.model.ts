export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type FontSize = 'normal' | 'large' | 'extra-large';

export interface AccessibilitySettings {
  screenReaderMode: boolean;
  highContrastMode: boolean;
  darkMode: boolean;
  lightMode: boolean;
  largeTextMode: boolean;
  fontSize: FontSize;
  reducedMotionMode: boolean;
  dyslexiaFriendlyMode: boolean;
  enhancedFocusMode: boolean;
  announceOnFocus: boolean;
  announceOnNavigation: boolean;
  keyboardShortcutGuideVisible: boolean;
  audioFeedbackEnabled: boolean;
  audioFeedbackVolume: number;
  speechAnnouncementEnabled: boolean;
  speechAnnouncementVolume: number;
  speechAnnouncementRate: number;
  speechAnnouncementPitch: number;
  speechAnnouncementLanguage: string;
}

export interface AppSettings {
  theme: ThemeMode;
  accessibility: AccessibilitySettings;
  notifications: {
    enabled: boolean;
    success: boolean;
    errors: boolean;
    warnings: boolean;
    info: boolean;
  };
}
