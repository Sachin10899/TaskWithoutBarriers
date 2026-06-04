import { Directive, ElementRef, inject, input, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  appFocusTrap = input<boolean>(true);
  private cleanupFn?: () => void;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const element = this.el.nativeElement;
      const handler = (event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !this.appFocusTrap()) return;

        const focusable = element.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      };

      element.addEventListener('keydown', handler);
      this.cleanupFn = () => element.removeEventListener('keydown', handler);
    });
  }

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}
