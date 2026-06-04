import { Directive, ElementRef, inject, input, output, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAnnounceOnChange]',
  standalone: true
})
export class AnnounceOnChangeDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);

  appAnnounceOnChange = input<string>('');
  changeAnnounced = output<string>();

  private observer?: MutationObserver;

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const message = this.appAnnounceOnChange();
        if (message) {
          this.changeAnnounced.emit(message);
        }
      });
    });
    this.observer.observe(element, { attributes: true, childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
