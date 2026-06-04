import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appScreenReaderOnly]',
  standalone: true,
  host: {
    '[class.sr-only]': 'true',
    '[attr.aria-hidden]': 'null'
  }
})
export class ScreenReaderOnlyDirective {}
