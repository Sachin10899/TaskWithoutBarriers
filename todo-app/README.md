# TodoApp

TodoApp is an accessible task management application built with Angular 19. It demonstrates inclusive UI patterns, keyboard-first navigation, screen reader support, and customizable accessibility settings.

## What this app does

- Manages tasks with create, edit, complete, delete, filter, sort, and search capabilities.
- Displays a dashboard with task statistics and quick actions.
- Stores tasks and settings in browser `localStorage` so data persists across refreshes.
- Includes a dedicated Accessibility Center for personalized interaction settings.

## Why this app is useful

- Serves as a strong example of accessible frontend development in Angular.
- Helps teams learn how to implement keyboard navigation, live announcements, and accessible dialogs.
- Supports users with vision, mobility, cognitive, or motion-sensitivity needs.
- Works well as a prototype, portfolio project, or internal productivity tool.

## Key accessibility features

- `Skip to main content` link for screen reader and keyboard users.
- Live region announcements for navigation and page updates.
- Keyboard shortcuts for fast app navigation and task creation.
- Accessible dialogs and form controls with ARIA labels and focus management.
- Visual modes for high contrast, dark mode, large text, reduced motion, and dyslexia-friendly layouts.
- Audio feedback and speech announcements with adjustable volume, rate, pitch, and language.
- Focus announcement support and enhanced keyboard focus styles.

## Where this application can be used

- As a demo or training tool for inclusive web development.
- In team tools or personal productivity apps where accessibility is a priority.
- As a base to extend into a larger task manager, planner, or project tracker.
- For usability testing with assistive technology users.
- In design systems that need accessible baseline components.

## How to use the app

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open your browser at:

```text
http://localhost:4200/
```

4. Use the available features:

- `Dashboard` for an overview of tasks, active counts, and overdue items.
- `My Tasks` to create, search, filter, sort, and manage active tasks.
- `Completed Tasks` to review finished work.
- `Accessibility Center` to configure modes such as screen reader, high contrast, and reduced motion.
- `Help` to view guidance and keyboard shortcuts.

## Keyboard shortcuts

- `Alt + D` — Open Dashboard
- `Alt + T` — Open My Tasks
- `Alt + C` — Open Completed Tasks
- `Alt + S` — Open Settings
- `Alt + A` — Open Accessibility Center
- `Alt + H` — Open Help
- `Alt + N` — Create a new task
- `Alt + F` — Focus search input
- `?` — Toggle the keyboard shortcut guide
- `Delete` — Delete the selected task
- `Escape` — Close the active dialog

## Project structure

- `src/app/features` — feature pages like dashboard, tasks, completed tasks, settings, help, and accessibility center.
- `src/app/shared/components` — reusable accessible UI components including dialogs, form fields, search, notifications, tabs, and task cards.
- `src/app/core` — shared services for announcements, audio feedback, notifications, speech, and live regions.
- `src/app/stores` — state management for tasks and accessibility settings.
- `src/app/directives` — custom directives for focus and keyboard behavior.

## Improvements to consider

- Add backend authentication and multi-user support.
- Add unit tests and E2E tests to validate accessibility workflows.
- Add PWA support for offline use and installability.
- Add categories, tags, reminders, and calendar integration.
- Improve mobile responsiveness and adaptive layouts.
- Add localization for more languages and translated UI content.
- Add voice commands or smarter assistive interactions.
- Add analytics or reporting features for task habits.

## Build and run commands

- Install dependencies:

```bash
npm install
```

- Run locally:

```bash
npm start
```

- Build for production:

```bash
npm run build
```

- Run unit tests:

```bash
npm test
```

- Serve SSR output:

```bash
npm run serve:ssr:todo-app
```

## Notes

- The app uses Angular standalone components and modern reactive patterns.
- Data is persisted locally in the browser, so tasks and accessibility preferences remain across page refreshes.
- This repository is a good foundation for building an accessible task manager or productivity application.
