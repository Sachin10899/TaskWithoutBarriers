import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';

@Component({
  selector: 'app-accessible-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [attr.aria-disabled]="disabled() || null"
      [disabled]="disabled() || false"
      [tabindex]="disabled() ? -1 : 0"
      (click)="onClick($event)"
      (keydown.enter)="onClick($event)"
      (keydown.space)="$event.preventDefault(); onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`:host { display: inline-block; }`]
})
export class AccessibleButtonComponent {
  private audio = inject(AudioFeedbackService);

  type = input<string>('button');
  buttonClass = input<string>('btn');
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  disabled = input<boolean>(false);
  clicked = output<Event>();

  onClick(event: Event): void {
    if (!this.disabled()) {
      this.audio.play('click');
      this.clicked.emit(event);
    }
  }
}
