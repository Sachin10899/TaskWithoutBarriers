import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechAnnouncementService {
  private _enabled = signal(true);
  private _volume = signal(0.8);
  private _rate = signal(1.0);
  private _pitch = signal(1.0);
  private _language = signal('en-US');
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private lastSpeechText = '';
  private lastSpeechTime = 0;

  readonly enabled = this._enabled.asReadonly();
  readonly volume = this._volume.asReadonly();
  readonly rate = this._rate.asReadonly();
  readonly pitch = this._pitch.asReadonly();
  readonly language = this._language.asReadonly();

  get isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  toggle(): void {
    this._enabled.update(e => !e);
    if (!this._enabled()) {
      this.stop();
    }
  }

  setEnabled(value: boolean): void {
    this._enabled.set(value);
    if (!value) {
      this.stop();
    }
  }

  setVolume(v: number): void {
    this._volume.set(Math.max(0, Math.min(1, v)));
  }

  setRate(r: number): void {
    this._rate.set(Math.max(0.5, Math.min(2, r)));
  }

  setPitch(p: number): void {
    this._pitch.set(Math.max(0, Math.min(2, p)));
  }

  setLanguage(lang: string): void {
    this._language.set(lang);
  }

  speak(text: string): void {
    if (!this._enabled() || !this.isSupported || !text) return;

    const now = Date.now();
    const normalizedText = text.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedLast = this.lastSpeechText.trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalizedText === normalizedLast && now - this.lastSpeechTime < 250) {
      return;
    }
    this.lastSpeechText = text;
    this.lastSpeechTime = now;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this._volume();
    utterance.rate = this._rate();
    utterance.pitch = this._pitch();
    utterance.lang = this._language();

    utterance.onend = () => {
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  speakNav(elementName: string): void {
    this.speak(`${elementName} navigated`);
  }

  speakClick(elementName: string): void {
    this.speak(`${elementName} clicked`);
  }

  speakFocus(elementName: string): void {
    this.speak(elementName);
  }

  speakToggle(elementName: string, enabled: boolean): void {
    this.speak(`${elementName} ${enabled ? 'enabled' : 'disabled'}`);
  }

  stop(): void {
    if (this.isSupported) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }
}
