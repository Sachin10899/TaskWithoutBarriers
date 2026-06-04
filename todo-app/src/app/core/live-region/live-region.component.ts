import { Component, inject, effect, ChangeDetectionStrategy, NgZone, AfterViewInit } from '@angular/core';
import { AccessibilityAnnouncementService } from '../services/accessibility-announcement.service';

@Component({
  selector: 'app-live-region',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
      role="status"
      aria-label="Live announcements">
    </div>
    <div
      class="sr-only"
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      aria-label="Urgent announcements">
    </div>
  `,
  styles: [`
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0;
      margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
      white-space: nowrap; border: 0;
    }
  `]
})
export class LiveRegionComponent implements AfterViewInit {
  private announcements = inject(AccessibilityAnnouncementService);
  private zone = inject(NgZone);
  private isBrowser = typeof document !== 'undefined';

  constructor() {
    effect(() => {
      const message = this.announcements.lastAnnouncement();
      if (message && this.isBrowser) {
        this.assertToScreenReader(message);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
  }

  private assertToScreenReader(message: string): void {
    const polite = document.querySelector('[aria-live="polite"]');
    const assertive = document.querySelector('[aria-live="assertive"]');

    if (polite) {
      polite.textContent = '';
      setTimeout(() => {
        polite.textContent = message;
      }, 100);
    }

    if (assertive) {
      assertive.textContent = '';
      setTimeout(() => {
        assertive.textContent = message;
      }, 100);
    }
  }
}
