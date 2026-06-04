import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AccessibilityAnnouncementService } from '../../core/services/accessibility-announcement.service';

@Component({
  selector: 'app-help',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main id="main-content" class="help" role="main" aria-label="Help and User Guide">
      <header class="page-header">
        <h1>Help & User Guide</h1>
        <p class="subtitle">Learn how to use Task Without Barriers</p>
      </header>

      <div class="help-content">
        <section class="help-section" aria-label="Getting started">
          <h2>Getting Started</h2>
          <p>
            Task Without Barriers is a fully accessible todo application designed to work
            entirely with keyboard navigation and screen readers. Every feature can be used
            without a mouse.
          </p>
        </section>

        <section class="help-section" aria-label="Navigation guide">
          <h2>Navigation</h2>
          <p>Use the navigation bar at the top of the page to switch between sections:</p>
          <ul>
            <li><strong>Dashboard</strong> - Overview of your tasks and quick stats</li>
            <li><strong>My Tasks</strong> - Create, edit, and manage your active tasks</li>
            <li><strong>Completed Tasks</strong> - View and manage completed tasks</li>
            <li><strong>Settings</strong> - Configure notification and appearance preferences</li>
            <li><strong>Accessibility Center</strong> - Customize accessibility settings</li>
            <li><strong>Help</strong> - This page</li>
          </ul>
        </section>

        <section class="help-section" aria-label="Keyboard shortcuts guide">
          <h2>Keyboard Shortcuts</h2>
          <p>Use these keyboard shortcuts for quick access:</p>
          <dl class="help-shortcuts">
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>D</kbd></dt>
              <dd>Open Dashboard</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>T</kbd></dt>
              <dd>Open My Tasks</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>C</kbd></dt>
              <dd>Open Completed Tasks</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>S</kbd></dt>
              <dd>Open Settings</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>A</kbd></dt>
              <dd>Open Accessibility Center</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>H</kbd></dt>
              <dd>Open Help</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>N</kbd></dt>
              <dd>Create New Task</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Alt</kbd> + <kbd>F</kbd></dt>
              <dd>Focus Search</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Escape</kbd></dt>
              <dd>Close Dialog or Cancel</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Tab</kbd></dt>
              <dd>Move to next interactive element</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Shift</kbd> + <kbd>Tab</kbd></dt>
              <dd>Move to previous interactive element</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Enter</kbd></dt>
              <dd>Activate button or open task</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Space</kbd></dt>
              <dd>Toggle checkbox or activate button</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Arrow Keys</kbd></dt>
              <dd>Navigate within lists and tabs</dd>
            </div>
            <div class="shortcut-entry">
              <dt><kbd>Delete</kbd></dt>
              <dd>Delete selected task</dd>
            </div>
          </dl>
        </section>

        <section class="help-section" aria-label="Creating tasks guide">
          <h2>Creating Tasks</h2>
          <ol>
            <li>Navigate to <strong>My Tasks</strong> (Alt+T)</li>
            <li>Press the <strong>New Task</strong> button (or press Alt+N)</li>
            <li>Fill in the task title (required)</li>
            <li>Add a description (optional)</li>
            <li>Select a priority (High, Medium, or Low)</li>
            <li>Set a due date (optional)</li>
            <li>Press <strong>Create Task</strong></li>
          </ol>
        </section>

        <section class="help-section" aria-label="Managing tasks guide">
          <h2>Managing Tasks</h2>
          <ul>
            <li><strong>Edit a task:</strong> Press Enter on a task or click the edit button</li>
            <li><strong>Complete a task:</strong> Press Space on a task checkbox</li>
            <li><strong>Delete a task:</strong> Press Delete on a task or use the delete button</li>
            <li><strong>Search tasks:</strong> Use the search field in My Tasks</li>
            <li><strong>Filter tasks:</strong> Use the priority filter dropdown</li>
            <li><strong>Sort tasks:</strong> Use the sort dropdown options</li>
          </ul>
        </section>

        <section class="help-section" aria-label="Accessibility features">
          <h2>Accessibility Features</h2>
          <ul>
            <li><strong>Screen Reader Support</strong> - Full compatibility with NVDA, JAWS, VoiceOver, and TalkBack</li>
            <li><strong>High Contrast Mode</strong> - Enhanced color contrast for better visibility</li>
            <li><strong>Dark Mode</strong> - Reduced eye strain in low-light environments</li>
            <li><strong>Large Text</strong> - Increased font sizes for better readability</li>
            <li><strong>Reduced Motion</strong> - Disables animations for users sensitive to motion</li>
            <li><strong>Enhanced Focus</strong> - Stronger keyboard focus indicators</li>
            <li><strong>Dyslexia Friendly</strong> - Optimized fonts and spacing</li>
            <li><strong>Full Keyboard Access</strong> - Every feature accessible without a mouse</li>
          </ul>
        </section>

        <section class="help-section" aria-label="Screen reader tips">
          <h2>Screen Reader Tips</h2>
          <ul>
            <li>The application announces your location when navigating between pages</li>
            <li>Task cards announce their title, priority, and status when focused</li>
            <li>Form errors are announced automatically when they occur</li>
            <li>Success and error notifications are announced through the live region</li>
            <li>Use headings (H1, H2) to navigate page structure</li>
            <li>All interactive elements have descriptive labels</li>
          </ul>
        </section>

        <section class="help-section" aria-label="Support information">
          <h2>Support</h2>
          <p>
            If you encounter any accessibility issues or need assistance, please let us know.
            We are committed to ensuring this application is fully usable by everyone.
          </p>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .help { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 2rem; margin: 0 0 4px; color: var(--text-primary, #1a1a1a); }
    .subtitle { margin: 0; color: var(--text-secondary, #666); }
    .help-content { display: flex; flex-direction: column; gap: 24px; }
    .help-section {
      background: var(--surface, #fff); border: 1px solid var(--border, #e0e0e0);
      border-radius: 12px; padding: 24px;
    }
    .help-section h2 { margin: 0 0 12px; font-size: 1.3rem; color: var(--text-primary, #1a1a1a); }
    .help-section p { margin: 0 0 12px; line-height: 1.6; color: var(--text-primary, #1a1a1a); }
    .help-section ul, .help-section ol { margin: 0; padding-left: 24px; }
    .help-section li { margin-bottom: 8px; line-height: 1.5; color: var(--text-primary, #1a1a1a); }
    .help-shortcuts { margin: 0; }
    .shortcut-entry {
      display: flex; align-items: center; gap: 16px;
      padding: 8px 0; border-bottom: 1px solid var(--border, #e0e0e0);
    }
    .shortcut-entry:last-child { border-bottom: none; }
    .shortcut-entry dt { font-weight: 600; min-width: 160px; }
    .shortcut-entry dd { margin: 0; color: var(--text-secondary, #666); }
    kbd {
      display: inline-block; padding: 2px 8px;
      background: var(--kbd-bg, #f0f0f0); border: 1px solid var(--border, #e0e0e0);
      border-radius: 4px; font-family: monospace; font-size: 0.85rem;
    }
  `]
})
export class HelpComponent implements OnInit {
  private announcements = inject(AccessibilityAnnouncementService);

  ngOnInit(): void {
    this.announcements.announceContext(
      'Help',
      0,
      'Use headings to navigate sections. Press Alt+D to return to Dashboard.'
    );
  }
}
