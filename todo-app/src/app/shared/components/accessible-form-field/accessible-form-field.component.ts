import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accessible-form-field',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-field" [class.has-error]="hasError()">
      <label [for]="fieldId()" class="form-label">
        {{ label() }}
        @if (required()) {
          <span class="required-mark" aria-hidden="true">*</span>
          <span class="sr-only">(required)</span>
        }
      </label>
      @if (instruction()) {
        <p [id]="instructionId()" class="form-instruction">{{ instruction() }}</p>
      }
      @switch (type()) {
        @case ('textarea') {
          <textarea
            [id]="fieldId()"
            [value]="value()"
            [attr.aria-label]="ariaLabel() || label()"
            [attr.aria-describedby]="getDescribedBy()"
            [attr.aria-required]="required()"
            [attr.aria-invalid]="hasError()"
            [class]="'form-' + type()"
            [placeholder]="placeholder()"
            (input)="onInput($event)"></textarea>
        }
        @case ('select') {
          <select
            [id]="fieldId()"
            [value]="value()"
            [attr.aria-label]="ariaLabel() || label()"
            [attr.aria-describedby]="getDescribedBy()"
            [attr.aria-required]="required()"
            [attr.aria-invalid]="hasError()"
            class="form-select"
            (change)="onSelectChange($event)">
            <ng-content></ng-content>
          </select>
        }
        @default {
          <input
            [id]="fieldId()"
            [type]="type()"
            [value]="value()"
            [attr.aria-label]="ariaLabel() || label()"
            [attr.aria-describedby]="getDescribedBy()"
            [attr.aria-required]="required()"
            [attr.aria-invalid]="hasError()"
            [class]="'form-' + type()"
            [placeholder]="placeholder()"
            [attr.min]="min()"
            [attr.max]="max()"
            (input)="onInput($event)">
        }
      }
      @if (hasError()) {
        <p [id]="errorId()" class="form-error" role="alert" aria-live="assertive">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `,
  styles: [`
    .form-field { margin-bottom: 16px; }
    .form-label {
      display: block; margin-bottom: 6px;
      font-weight: 600; font-size: 0.95rem;
      color: var(--text-primary, #1a1a1a);
    }
    .required-mark { color: #dc3545; margin-left: 2px; }
    .form-instruction { margin: 4px 0 6px; font-size: 0.85rem; color: var(--text-secondary, #666); }
    .form-text, .form-email, .form-password, .form-date, .form-number {
      width: 100%; padding: 10px 12px;
      border: 2px solid var(--border, #e0e0e0);
      border-radius: 6px; font-size: 1rem;
      background: var(--surface, #fff); color: var(--text-primary, #1a1a1a);
      box-sizing: border-box;
    }
    .form-text:focus, .form-email:focus, .form-password:focus, .form-date:focus, .form-number:focus {
      outline: none; border-color: var(--primary, #005fcc);
      box-shadow: 0 0 0 3px rgba(0,95,204,0.2);
    }
    .form-textarea { width: 100%; padding: 10px 12px; border: 2px solid var(--border, #e0e0e0); border-radius: 6px; font-size: 1rem; min-height: 80px; resize: vertical; background: var(--surface, #fff); color: var(--text-primary, #1a1a1a); box-sizing: border-box; }
    .form-textarea:focus { outline: none; border-color: var(--primary, #005fcc); box-shadow: 0 0 0 3px rgba(0,95,204,0.2); }
    .form-select { width: 100%; padding: 10px 12px; border: 2px solid var(--border, #e0e0e0); border-radius: 6px; font-size: 1rem; background: var(--surface, #fff); color: var(--text-primary, #1a1a1a); cursor: pointer; box-sizing: border-box; }
    .form-select:focus { outline: none; border-color: var(--primary, #005fcc); box-shadow: 0 0 0 3px rgba(0,95,204,0.2); }
    .has-error .form-text, .has-error .form-textarea, .has-error .form-select, .has-error .form-date, .has-error .form-number {
      border-color: #dc3545;
    }
    .has-error .form-text:focus, .has-error .form-textarea:focus, .has-error .form-select:focus {
      box-shadow: 0 0 0 3px rgba(220,53,69,0.2);
    }
    .form-error { margin: 6px 0 0; font-size: 0.85rem; color: #dc3545; font-weight: 500; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `]
})
export class AccessibleFormFieldComponent {
  label = input<string>('');
  type = input<string>('text');
  value = input<string>('');
  placeholder = input<string>('');
  required = input<boolean>(false);
  instruction = input<string>('');
  errorMessage = input<string>('');
  ariaLabel = input<string>('');
  min = input<string>('');
  max = input<string>('');

  fieldId = signal(`field-${Math.random().toString(36).substr(2, 9)}`);
  errorId = signal(`error-${Math.random().toString(36).substr(2, 9)}`);
  instructionId = signal(`instruction-${Math.random().toString(36).substr(2, 9)}`);

  valueChanged = output<string>();

  hasError = signal(false);

  setError(message: string): void {
    this.hasError.set(true);
  }

  clearError(): void {
    this.hasError.set(false);
  }

  getDescribedBy(): string {
    const parts: string[] = [];
    if (this.instruction()) parts.push(this.instructionId());
    if (this.hasError()) parts.push(this.errorId());
    return parts.join(' ') || '';
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.valueChanged.emit(value);
  }

  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChanged.emit(value);
  }
}
