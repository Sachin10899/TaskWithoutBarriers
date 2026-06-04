import { Component, input, output, signal, inject, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilityAnnouncementService } from '../../../core/services/accessibility-announcement.service';

@Component({
  selector: 'app-accessible-search',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-container" role="search">
      <label [for]="inputId()" class="search-label sr-only">{{ label() }}</label>
      <div class="search-input-wrapper">
        <span class="search-icon" aria-hidden="true">&#128269;</span>
        <input
          #searchInput
          [id]="inputId()"
          type="search"
          [placeholder]="placeholder()"
          [value]="searchValue()"
          [attr.aria-label]="label()"
          [attr.aria-describedby]="showResultCount() ? resultCountId : null"
          class="search-input"
          (input)="onInput($event)"
          (keydown.escape)="clearSearch()">
        @if (searchValue()) {
          <button
            class="search-clear"
            [attr.aria-label]="'Clear search: ' + searchValue()"
            (click)="clearSearch()">
            <span aria-hidden="true">&times;</span>
          </button>
        }
      </div>
      @if (showResultCount() && searchValue()) {
        <div [id]="resultCountId" class="search-results-count" aria-live="polite" role="status">
          {{ resultCount() }} {{ resultCount() === 1 ? 'result' : 'results' }} found
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container { width: 100%; }
    .search-input-wrapper {
      display: flex; align-items: center; position: relative;
      background: var(--surface, #fff); border: 2px solid var(--border, #e0e0e0);
      border-radius: 8px; overflow: hidden;
    }
    .search-input-wrapper:focus-within {
      border-color: var(--primary, #005fcc);
      box-shadow: 0 0 0 3px rgba(0,95,204,0.2);
    }
    .search-icon { padding: 0 12px; font-size: 1.1rem; color: var(--text-secondary, #666); }
    .search-input {
      flex: 1; padding: 12px 8px; border: none; outline: none;
      font-size: 1rem; background: transparent; color: var(--text-primary, #1a1a1a);
    }
    .search-clear {
      background: none; border: none; cursor: pointer; padding: 8px 12px;
      font-size: 1.2rem; color: var(--text-secondary, #666);
    }
    .search-clear:focus-visible {
      outline: 3px solid var(--focus, #005fcc); outline-offset: -3px;
    }
    .search-results-count {
      padding: 8px 0; font-size: 0.9rem; color: var(--text-secondary, #666);
    }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `]
})
export class AccessibleSearchComponent {
  @ViewChild('searchInput') searchInputRef?: ElementRef;

  label = input<string>('Search');
  placeholder = input<string>('Search...');
  searchValue = input<string>('');
  resultCount = input<number>(0);
  showResultCount = input<boolean>(true);

  searchChanged = output<string>();
  cleared = output<void>();

  private announcements = inject(AccessibilityAnnouncementService);
  inputId = signal(`search-${Math.random().toString(36).substr(2, 9)}`);
  resultCountId = `search-results-${Math.random().toString(36).substr(2, 9)}`;

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
    if (value) {
      this.announcements.announce(`Search input: ${value}`);
    }
  }

  clearSearch(): void {
    this.searchChanged.emit('');
    this.cleared.emit();
    this.announcements.announce('Search cleared');
    this.searchInputRef?.nativeElement?.focus();
  }

  focus(): void {
    this.searchInputRef?.nativeElement?.focus();
  }
}
