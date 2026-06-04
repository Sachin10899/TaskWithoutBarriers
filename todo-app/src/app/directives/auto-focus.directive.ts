import { Directive, ElementRef, inject, AfterViewInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  ngAfterViewInit(): void {
    if (typeof document === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 100);
    });
  }
}
