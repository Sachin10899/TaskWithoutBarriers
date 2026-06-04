import { Component, input, output, signal, inject, effect, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { AccessibilityAnnouncementService } from '../../../core/services/accessibility-announcement.service';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';

@Component({
  selector: 'app-accessible-dialog',
  standalone: true,
  imports: [FocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="dialog-overlay" (click)="close()" role="presentation">
        <div
          class="dialog-content"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="descriptionId"
          [appFocusTrap]="true"
          (keydown.escape)="close()">
          <div class="dialog-header">
            <h2 [id]="titleId" class="dialog-title">{{ title() }}</h2>
            <button
              class="dialog-close-btn"
              (click)="close()"
              [attr.aria-label]="'Close ' + title() + ' dialog'">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div [id]="descriptionId" class="dialog-body">
            <ng-content></ng-content>
          </div>
          <div class="dialog-footer">
            <ng-content select="[dialog-footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .dialog-content {
      background: var(--surface, #fff);
      color: var(--text-primary, #1a1a1a);
      border-radius: 8px;
      max-width: 560px; width: 90%;
      max-height: 90vh;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      overflow-y: auto;
    }
    .dialog-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px; border-bottom: 1px solid var(--border, #e0e0e0);
    }
    .dialog-title { margin: 0; font-size: 1.25rem; }
    .dialog-close-btn {
      background: none; border: none; font-size: 1.5rem;
      cursor: pointer; padding: 4px 8px; line-height: 1;
      color: var(--text-primary, #1a1a1a);
      border-radius: 4px;
    }
    .dialog-close-btn:focus-visible {
      outline: 3px solid var(--focus, #005fcc);
      outline-offset: 2px;
    }
    .dialog-body { padding: 20px; }
    .dialog-footer { padding: 12px 20px; border-top: 1px solid var(--border, #e0e0e0); display: flex; gap: 8px; justify-content: flex-end; }
  `]
})
export class AccessibleDialogComponent {
  private announcements = inject(AccessibilityAnnouncementService);
  private audio = inject(AudioFeedbackService);

  isOpen = signal(false);
  title = input<string>('Dialog');
  closed = output<void>();

  titleId = `dialog-title-${Math.random().toString(36).substr(2, 9)}`;
  descriptionId = `dialog-desc-${Math.random().toString(36).substr(2, 9)}`;

  open(): void {
    this.audio.play('open');
    this.isOpen.set(true);
    this.announcements.announce(`${this.title()} dialog opened`);
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      const firstFocusable = document.querySelector<HTMLElement>(
        '.dialog-content button, .dialog-content input, .dialog-content select, .dialog-content textarea, .dialog-content [tabindex]'
      );
      firstFocusable?.focus();
    }, 100);
  }

  close(): void {
    this.audio.play('close');
    this.isOpen.set(false);
    this.announcements.announce(`${this.title()} dialog closed`);
    this.closed.emit();
  }
}
