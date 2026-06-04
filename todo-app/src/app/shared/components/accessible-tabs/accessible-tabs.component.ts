import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { AudioFeedbackService } from '../../../core/services/audio-feedback.service';

export interface TabItem {
  id: string;
  label: string;
  ariaLabel?: string;
}

@Component({
  selector: 'app-accessible-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs-container">
      <div
        role="tablist"
        [attr.aria-label]="ariaLabel()"
        class="tab-list">
        @for (tab of tabs(); track tab.id) {
          <button
            role="tab"
            [id]="'tab-' + tab.id"
            [attr.aria-selected]="selectedTab() === tab.id"
            [attr.aria-controls]="'tabpanel-' + tab.id"
            [attr.aria-label]="tab.ariaLabel || tab.label"
            [class.active]="selectedTab() === tab.id"
            [tabindex]="selectedTab() === tab.id ? 0 : -1"
            (click)="selectTab(tab.id)"
            (keydown.arrowRight)="onArrowRight($event, tab.id)"
            (keydown.arrowLeft)="onArrowLeft($event, tab.id)"
            (keydown.home)="onHome($event)"
            (keydown.end)="onEnd($event)">
            {{ tab.label }}
          </button>
        }
      </div>
      <div
        role="tabpanel"
        [id]="'tabpanel-' + selectedTab()"
        [attr.aria-labelledby]="'tab-' + selectedTab()"
        [attr.aria-hidden]="false"
        tabindex="0"
        class="tab-panel">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .tab-list {
      display: flex; gap: 0; border-bottom: 2px solid var(--border, #e0e0e0);
    }
    .tab-list button {
      padding: 12px 20px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-secondary, #666);
      transition: all 0.2s;
      margin-bottom: -2px;
      position: relative;
    }
    .tab-list button:hover {
      color: var(--text-primary, #1a1a1a);
      background: var(--hover-bg, #f5f5f5);
    }
    .tab-list button.active {
      color: var(--primary, #005fcc);
      border-bottom-color: var(--primary, #005fcc);
      font-weight: 600;
    }
    .tab-list button:focus-visible {
      outline: 3px solid var(--focus, #005fcc);
      outline-offset: -3px;
      z-index: 1;
    }
    .tab-panel {
      padding: 20px 0;
      min-height: 200px;
    }
  `]
})
export class AccessibleTabsComponent {
  private audio = inject(AudioFeedbackService);

  tabs = input.required<TabItem[]>();
  selectedTab = input.required<string>();
  tabSelected = output<string>();

  selectTab(tabId: string): void {
    const tab = this.tabs().find(t => t.id === tabId);
    if (tab) {
      this.audio.play('tab-select');
      this.tabSelected.emit(tabId);
    }
  }

  onArrowRight(event: KeyboardEvent, currentTabId: string): void {
    event.preventDefault();
    const tabs = this.tabs();
    const currentIndex = tabs.findIndex(t => t.id === currentTabId);
    const nextIndex = (currentIndex + 1) % tabs.length;
    this.selectTab(tabs[nextIndex].id);
    this.focusTab(tabs[nextIndex].id);
  }

  onArrowLeft(event: KeyboardEvent, currentTabId: string): void {
    event.preventDefault();
    const tabs = this.tabs();
    const currentIndex = tabs.findIndex(t => t.id === currentTabId);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    this.selectTab(tabs[prevIndex].id);
    this.focusTab(tabs[prevIndex].id);
  }

  onHome(event: KeyboardEvent): void {
    event.preventDefault();
    const tabs = this.tabs();
    this.selectTab(tabs[0].id);
    this.focusTab(tabs[0].id);
  }

  onEnd(event: KeyboardEvent): void {
    event.preventDefault();
    const tabs = this.tabs();
    this.selectTab(tabs[tabs.length - 1].id);
    this.focusTab(tabs[tabs.length - 1].id);
  }

  private focusTab(tabId: string): void {
    setTimeout(() => {
      document.getElementById(`tab-${tabId}`)?.focus();
    });
  }
}
