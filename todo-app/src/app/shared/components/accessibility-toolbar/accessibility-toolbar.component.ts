import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsStore } from '../../../stores/settings.store';

@Component({
  selector: 'app-accessibility-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="accessibility-toolbar"
      role="navigation"
      aria-label="Accessibility toolbar">
      <div class="toolbar-content">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{exact: true}"
          class="toolbar-brand"
          aria-label="Task Without Barriers - Home">
          <span aria-hidden="true" class="brand-icon">&#10003;</span>
          <span class="brand-text">Task Without Barriers</span>
        </a>
        <div class="toolbar-links" role="menubar" aria-label="Main navigation">
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="Dashboard. Press Alt+D">
            <span aria-hidden="true">&#128200;</span>
            <span>Dashboard</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+D</kbd>
          </a>
          <a
            routerLink="/tasks"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="My Tasks. Press Alt+T">
            <span aria-hidden="true">&#128203;</span>
            <span>My Tasks</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+T</kbd>
          </a>
          <a
            routerLink="/completed"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="Completed Tasks. Press Alt+C">
            <span aria-hidden="true">&#10004;</span>
            <span>Completed</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+C</kbd>
          </a>
          <a
            routerLink="/settings"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="Settings. Press Alt+S">
            <span aria-hidden="true">&#9881;</span>
            <span>Settings</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+S</kbd>
          </a>
          <a
            routerLink="/accessibility"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="Accessibility Center. Press Alt+A">
            <span aria-hidden="true">&#9855;</span>
            <span>Accessibility</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+A</kbd>
          </a>
          <a
            routerLink="/help"
            routerLinkActive="active"
            role="menuitem"
            class="nav-link"
            aria-label="Help and User Guide. Press Alt+H">
            <span aria-hidden="true">&#10067;</span>
            <span>Help</span>
            <kbd class="shortcut-hint" aria-hidden="true">Alt+H</kbd>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .accessibility-toolbar {
      background: var(--nav-bg, #1a1a2e);
      color: var(--nav-text, #fff);
      padding: 0;
      position: sticky; top: 0; z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .toolbar-content {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; gap: 8px;
      padding: 0 16px;
    }
    .toolbar-brand {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; color: inherit;
      padding: 12px 16px; font-weight: 700; font-size: 1.05rem;
      white-space: nowrap;
    }
    .toolbar-brand:focus-visible {
      outline: 3px solid var(--focus, #005fcc);
      outline-offset: -3px; border-radius: 4px;
    }
    .brand-icon { font-size: 1.3rem; color: #4ade80; }
    .toolbar-links {
      display: flex; align-items: center; gap: 2px;
      flex-wrap: wrap;
    }
    .nav-link {
      display: flex; align-items: center; gap: 6px;
      text-decoration: none; color: rgba(255,255,255,0.8);
      padding: 10px 12px; border-radius: 6px;
      font-size: 0.9rem; white-space: nowrap;
      transition: all 0.2s;
    }
    .nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .nav-link.active {
      background: rgba(255,255,255,0.15); color: #fff; font-weight: 600;
    }
    .nav-link:focus-visible {
      outline: 3px solid var(--focus, #4ade80);
      outline-offset: -3px;
    }
    .shortcut-hint {
      font-size: 0.7rem; background: rgba(255,255,255,0.15);
      padding: 1px 5px; border-radius: 3px;
      font-family: monospace;
    }
    @media (max-width: 900px) {
      .toolbar-content { flex-direction: column; align-items: stretch; }
      .toolbar-links { flex-wrap: wrap; justify-content: center; }
      .shortcut-hint { display: none; }
    }
  `]
})
export class AccessibilityToolbarComponent {
  settingsStore = inject(SettingsStore);
}
