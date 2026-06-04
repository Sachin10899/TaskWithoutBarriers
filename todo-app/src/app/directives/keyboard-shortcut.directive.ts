import { Directive, ElementRef, inject, input, output, OnDestroy, afterNextRender, NgZone } from '@angular/core';

@Directive({
  selector: '[appKeyboardShortcut]',
  standalone: true
})
export class KeyboardShortcutDirective implements OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  appKeyboardShortcut = input.required<string>({ alias: 'appKeyboardShortcut' });
  shortcutTriggered = output<KeyboardEvent>();

  private cleanupFn?: () => void;

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        const handler = (event: KeyboardEvent) => {
          if (event.key === '?') {
            event.preventDefault();
            this.zone.run(() => {
              this.shortcutTriggered.emit(event);
            });
          }
        };
        document.addEventListener('keydown', handler);
        this.cleanupFn = () => document.removeEventListener('keydown', handler);
      });
    });
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
