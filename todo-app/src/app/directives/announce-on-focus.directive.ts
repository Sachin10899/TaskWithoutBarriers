import { Directive, ElementRef, inject, input, output, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { AccessibilityAnnouncementService } from '../services/accessibility-announcement.service';

@Directive({
  selector: '[appAnnounceOnFocus]',
  standalone: true
})
export class AnnounceOnFocusDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private announcements = inject(AccessibilityAnnouncementService);

  appAnnounceOnFocus = input<string>('');
  focusAnnounced = output<void>();

  private handleFocus = (): void => {
    const message = this.appAnnounceOnFocus();
    if (message) {
      this.announcements.announceFocus(message);
      this.focusAnnounced.emit();
    }
  };

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.setAttribute('tabindex', element.getAttribute('tabindex') ?? '0');
    element.addEventListener('focus', this.handleFocus);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('focus', this.handleFocus);
  }
}
