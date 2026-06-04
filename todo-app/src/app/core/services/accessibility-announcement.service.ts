import { Injectable, inject, signal } from '@angular/core';
import { SpeechAnnouncementService } from './speech-announcement.service';

@Injectable({ providedIn: 'root' })
export class AccessibilityAnnouncementService {
  private speech = inject(SpeechAnnouncementService);
  private announcementQueue = signal<string[]>([]);
  private _lastAnnouncement = signal<string>('');

  get lastAnnouncement() {
    return this._lastAnnouncement.asReadonly();
  }

  announce(message: string): void {
    this._lastAnnouncement.set(message);
    this.announcementQueue.update(q => [...q, message]);
    this.speech.speak(message);
    this.clearQueueAfterDelay();
  }

  announceSuccess(message: string): void {
    this.announce(`Success: ${message}`);
  }

  announceError(message: string): void {
    this.announce(`Error: ${message}`);
  }

  announceWarning(message: string): void {
    this.announce(`Warning: ${message}`);
  }

  announceInfo(message: string): void {
    this.announce(message);
  }

  announceNavigation(pageName: string): void {
    this.announce(`${pageName} page loaded`);
  }

  announceFocus(elementName: string): void {
    this.announce(elementName);
  }

  announceKeyboardShortcut(action: string, shortcut: string): void {
    this.announce(`${action} opened. Shortcut: ${shortcut}`);
  }

  announceContext(pageName: string, itemCount: number, instructions: string): void {
    const countText = itemCount === 1 ? '1 item' : `${itemCount} items`;
    this.announce(`${pageName} loaded. ${countText} available. ${instructions}`);
  }

  private clearQueueAfterDelay(): void {
    setTimeout(() => {
      this.announcementQueue.set([]);
    }, 1000);
  }
}
