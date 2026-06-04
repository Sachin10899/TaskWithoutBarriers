import { Component, inject, OnInit, OnDestroy, NgZone, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccessibilityAnnouncementService } from './core/services/accessibility-announcement.service';
import { SettingsStore } from './stores/settings.store';
import { TaskStore } from './stores/task.store';
import { NotificationService } from './core/services/notification.service';
import { AudioFeedbackService } from './core/services/audio-feedback.service';
import { LiveRegionComponent } from './core/live-region/live-region.component';
import { AccessibilityToolbarComponent } from './shared/components/accessibility-toolbar/accessibility-toolbar.component';
import { AccessibleNotificationComponent } from './shared/components/accessible-notification/accessible-notification.component';
import { AccessibleDialogComponent } from './shared/components/accessible-dialog/accessible-dialog.component';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, LiveRegionComponent, AccessibilityToolbarComponent,
    AccessibleNotificationComponent, AccessibleDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-container" [class]="appClasses()">
      <app-live-region></app-live-region>
      <a
        href="#main-content"
        class="skip-link"
        (click)="skipToMain($event)">
        Skip to main content
      </a>
      <app-accessibility-toolbar></app-accessibility-toolbar>
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
      <app-accessible-notification></app-accessible-notification>

      <!-- Keyboard Shortcut Guide Dialog -->
      <app-accessible-dialog #shortcutGuide title="Keyboard Shortcuts">
        <div class="shortcut-guide">
          <dl>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>D</kbd></dt>
              <dd>Open Dashboard</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>T</kbd></dt>
              <dd>Open My Tasks</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>C</kbd></dt>
              <dd>Open Completed Tasks</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>S</kbd></dt>
              <dd>Open Settings</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>A</kbd></dt>
              <dd>Open Accessibility Center</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>H</kbd></dt>
              <dd>Open Help</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>N</kbd></dt>
              <dd>Create New Task</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Alt</kbd> + <kbd>F</kbd></dt>
              <dd>Focus Search</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Escape</kbd></dt>
              <dd>Close Dialog</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>Delete</kbd></dt>
              <dd>Delete Selected Task</dd>
            </div>
            <div class="guide-item">
              <dt><kbd>?</kbd></dt>
              <dd>Toggle This Guide</dd>
            </div>
          </dl>
        </div>
      </app-accessible-dialog>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh; display: flex; flex-direction: column;
      background: var(--bg, #f5f5f5); color: var(--text-primary, #1a1a1a);
    }
    .app-content { flex: 1; }
    .skip-link {
      position: absolute; top: -100px; left: 16px; z-index: 10000;
      background: var(--primary, #005fcc); color: #fff;
      padding: 12px 24px; border-radius: 0 0 8px 8px;
      text-decoration: none; font-weight: 600; font-size: 1rem;
    }
    .skip-link:focus { top: 0; }
    .shortcut-guide dl { margin: 0; }
    .guide-item {
      display: flex; align-items: center; gap: 16px;
      padding: 8px 0; border-bottom: 1px solid var(--border, #e0e0e0);
    }
    .guide-item:last-child { border-bottom: none; }
    .guide-item dt { font-weight: 600; min-width: 160px; }
    .guide-item dd { margin: 0; color: var(--text-secondary, #666); }
    kbd {
      display: inline-block; padding: 2px 8px;
      background: var(--kbd-bg, #f0f0f0); border: 1px solid var(--border, #e0e0e0);
      border-radius: 4px; font-family: monospace; font-size: 0.85rem;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('shortcutGuide') shortcutGuide!: AccessibleDialogComponent;

  private router = inject(Router);
  private announcements = inject(AccessibilityAnnouncementService);
  private settingsStore = inject(SettingsStore);
  private taskStore = inject(TaskStore);
  private notifications = inject(NotificationService);
  private audio = inject(AudioFeedbackService);
  private zone = inject(NgZone);

  private cleanupFns: (() => void)[] = [];

  private lastInteractionType: 'keyboard' | 'pointer' = 'keyboard';
  private lastAnnouncedElement: HTMLElement | null = null;

  appClasses = this.settingsStore.accessibility;

  ngOnInit(): void {
    this.setupRouteAnnouncements();
    this.setupGlobalKeyboardShortcuts();
    this.setupGlobalInteractionListeners();
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
  }

  skipToMain(event: Event): void {
    event.preventDefault();
    if (typeof document === 'undefined') return;
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.tabIndex = -1;
    }
  }

  private setupRouteAnnouncements(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      const route = this.router.routerState.snapshot.root;
      let announcement = '';

      const findAnnouncement = (r: any): string => {
        if (r.data && r.data['announcement']) return r.data['announcement'];
        if (r.children) {
          for (const child of r.children) {
            const result = findAnnouncement(child);
            if (result) return result;
          }
        }
        return '';
      };

      announcement = findAnnouncement(route.root || route);
      if (announcement) {
        this.announcements.announceNavigation(announcement.replace(' page loaded', ''));
      }

      const main = typeof document !== 'undefined' ? document.getElementById('main-content') : null;
      if (main) {
        main.tabIndex = -1;
        main.focus();
      }
    });
  }

  private setupGlobalKeyboardShortcuts(): void {
    if (typeof document === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      const handler = (event: KeyboardEvent) => {
        const altKey = event.altKey;
        const key = event.key.toLowerCase();

        const shortcuts: Record<string, () => void> = {
          'd': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/dashboard']); this.announcements.announce('Dashboard navigated. Shortcut: Alt+D'); }),
          't': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/tasks']); this.announcements.announce('My Tasks navigated. Shortcut: Alt+T'); }),
          'c': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/completed']); this.announcements.announce('Completed Tasks navigated. Shortcut: Alt+C'); }),
          's': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/settings']); this.announcements.announce('Settings navigated. Shortcut: Alt+S'); }),
          'a': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/accessibility']); this.announcements.announce('Accessibility Center navigated. Shortcut: Alt+A'); }),
          'h': () => this.zone.run(() => { this.audio.play('navigate'); this.router.navigate(['/help']); this.announcements.announce('Help navigated. Shortcut: Alt+H'); }),
          'n': () => this.zone.run(() => { this.audio.play('open'); this.router.navigate(['/tasks']); this.announcements.announce('New Task opened. Shortcut: Alt+N'); }),
          'f': () => this.zone.run(() => {
            this.audio.play('focus');
            const searchInput = document.querySelector<HTMLInputElement>('[type="search"]');
            if (searchInput) { searchInput.focus(); this.announcements.announce('Search focused'); }
          })
        };

        if (altKey && shortcuts[key]) {
          event.preventDefault();
          shortcuts[key]();
          return;
        }

        if (key === '?' && !altKey && !event.ctrlKey && !event.metaKey) {
          const tag = (event.target as HTMLElement).tagName;
          if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
            event.preventDefault();
            this.zone.run(() => {
              if (this.shortcutGuide.isOpen()) {
                this.shortcutGuide.close();
              } else {
                this.shortcutGuide.open();
              }
            });
          }
        }

        if (key === 'escape') {
          this.zone.run(() => {
            if (this.shortcutGuide.isOpen()) {
              this.shortcutGuide.close();
            }
          });
        }

        if (key === 'delete') {
          const tag = (event.target as HTMLElement).tagName;
          if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
            const selectedId = this.taskStore.selectedTaskId();
            if (selectedId) {
              const task = this.taskStore.getTaskById(selectedId);
              if (task) {
                event.preventDefault();
                this.zone.run(() => {
                  this.taskStore.deleteTask(selectedId);
                  this.notifications.success(`Task "${task.title}" deleted`);
                });
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handler);
      this.cleanupFns.push(() => document.removeEventListener('keydown', handler));
    });
  }

  private setupGlobalInteractionListeners(): void {
    if (typeof document === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      const mousedownHandler = () => {
        this.lastInteractionType = 'pointer';
      };

      const keydownHandler = (e: KeyboardEvent) => {
        // Any key down indicates keyboard interaction mode
        this.lastInteractionType = 'keyboard';

        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target as HTMLElement;
          if (!target) return;

          // If the element doesn't natively dispatch a click (like custom div/span roles),
          // or is not a native button/link, let keydown handle the speech announcement.
          const role = target.getAttribute('role');
          const isNativeClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT';
          const isInteractive = isNativeClickable || role === 'button' || role === 'link' || role === 'tab' || target.getAttribute('tabindex') !== null;

          if (isInteractive && !isNativeClickable) {
            // For custom role="button", role="tab" etc. that might not fire native click
            if (target.getAttribute('aria-disabled') === 'true' || (target as any).disabled) {
              return;
            }

            const info = this.getElementFriendlyName(target);
            if (!info || !info.name) return;

            this.zone.run(() => {
              let msg = '';
              if (info.role === 'tab' || info.role === 'link') {
                msg = `${info.name} navigated`;
              } else {
                msg = `${info.name} clicked`;
              }
              this.audio.play(info.role === 'tab' || info.role === 'link' ? 'navigate' : 'click');
              this.announcements.announce(msg);
            });
          }
        }
      };

      const focusHandler = (event: FocusEvent) => {
        const target = event.target as HTMLElement;
        if (!target) return;

        const info = this.getElementFriendlyName(target);
        if (!info || !info.name) return;

        if (this.lastInteractionType === 'keyboard' && this.lastAnnouncedElement !== target) {
          this.zone.run(() => {
            let msg = '';
            if (info.role === 'tab') {
              msg = `${info.name} tab navigated`;
            } else if (info.role === 'button') {
              msg = `${info.name} button focused`;
            } else if (info.role === 'link') {
              msg = `${info.name} tab navigated`;
            } else if (info.role === 'input') {
              msg = `${info.name} input focused`;
            } else {
              msg = `${info.name} focused`;
            }
            this.audio.play(info.role === 'tab' ? 'tab-select' : 'focus');
            this.announcements.announce(msg);
            this.lastAnnouncedElement = target;
          });
        }
      };

      const clickHandler = (event: MouseEvent) => {
        let target = event.target as HTMLElement | null;
        let interactiveEl: HTMLElement | null = null;

        while (target && target !== document.body) {
          const role = target.getAttribute('role');
          const isInteractive =
            target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' ||
            role === 'button' ||
            role === 'link' ||
            role === 'tab' ||
            target.getAttribute('tabindex') !== null;

          if (isInteractive) {
            interactiveEl = target;
            break;
          }
          target = target.parentElement;
        }

        if (!interactiveEl) return;

        if (interactiveEl.getAttribute('aria-disabled') === 'true' || (interactiveEl as any).disabled) {
          return;
        }

        const info = this.getElementFriendlyName(interactiveEl);
        if (!info || !info.name) return;

        this.zone.run(() => {
          let msg = '';
          if (info.role === 'tab' || info.role === 'link') {
            msg = `${info.name} navigated`;
          } else {
            msg = `${info.name} clicked`;
          }
          this.audio.play(info.role === 'tab' || info.role === 'link' ? 'navigate' : 'click');
          this.announcements.announce(msg);
          // Set this to avoid double focus announcement when clicked
          this.lastAnnouncedElement = interactiveEl;
        });
      };

      document.addEventListener('mousedown', mousedownHandler, true);
      document.addEventListener('keydown', keydownHandler, true);
      document.addEventListener('focus', focusHandler, true);
      document.addEventListener('click', clickHandler, true);

      this.cleanupFns.push(() => {
        document.removeEventListener('mousedown', mousedownHandler, true);
        document.removeEventListener('keydown', keydownHandler, true);
        document.removeEventListener('focus', focusHandler, true);
        document.removeEventListener('click', clickHandler, true);
      });
    });
  }

  private getElementFriendlyName(el: HTMLElement): { name: string, role: string } | null {
    let role = el.getAttribute('role') || '';
    const tagName = el.tagName.toLowerCase();

    if (!role) {
      if (tagName === 'button') role = 'button';
      else if (tagName === 'a') role = 'link';
      else if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') role = 'input';
    }

    if (!role && (el.classList.contains('nav-link') || el.id?.startsWith('tab-') || el.classList.contains('tab-button'))) {
      role = 'tab';
    }

    let name = '';

    let ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) {
      name = ariaLabel;
    } else {
      const labelledBy = el.getAttribute('aria-labelledby');
      if (labelledBy) {
        const labels = labelledBy.split(/\s+/).map(id => document.getElementById(id)).filter(Boolean);
        if (labels.length > 0) {
          name = labels.map(l => l?.textContent || '').join(' ');
        }
      }
    }

    if (!name && (tagName === 'input' || tagName === 'textarea')) {
      name = el.getAttribute('placeholder') || '';
    }

    if (!name && (tagName === 'input' || tagName === 'textarea' || tagName === 'select')) {
      const id = el.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          name = label.textContent || '';
        }
      }
      if (!name) {
        const parentLabel = el.closest('label');
        if (parentLabel) {
          name = parentLabel.textContent || '';
        }
      }
    }

    if (!name) {
      name = el.textContent || '';
    }

    if (!name) {
      name = el.getAttribute('title') || '';
    }

    if (!name) {
      if (tagName === 'img') {
        name = el.getAttribute('alt') || '';
      } else {
        const img = el.querySelector('img');
        if (img) {
          name = img.getAttribute('alt') || '';
        }
      }
    }

    name = name.trim();
    if (!name) return null;

    name = name.replace(/\.?\s*Press\s+Alt\+.$/gi, '');
    name = name.replace(/\.?\s*Shortcut:.*$/gi, '');
    name = name.replace(/[^\x20-\x7E\s]/g, '');
    name = name.trim();

    // Avoid announcing very long content
    if (name.length > 60) {
      name = name.substring(0, 57) + '...';
    }

    return { name, role };
  }
}
