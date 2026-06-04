import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: { announcement: 'Dashboard page loaded' }
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/my-tasks/my-tasks.component').then(m => m.MyTasksComponent),
    data: { announcement: 'My Tasks page loaded' }
  },
  {
    path: 'completed',
    loadComponent: () =>
      import('./features/completed-tasks/completed-tasks.component').then(m => m.CompletedTasksComponent),
    data: { announcement: 'Completed Tasks page loaded' }
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(m => m.SettingsComponent),
    data: { announcement: 'Settings page loaded' }
  },
  {
    path: 'accessibility',
    loadComponent: () =>
      import('./features/accessibility-center/accessibility-center.component').then(m => m.AccessibilityCenterComponent),
    data: { announcement: 'Accessibility Center page loaded' }
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./features/help/help.component').then(m => m.HelpComponent),
    data: { announcement: 'Help page loaded' }
  },
  { path: '**', redirectTo: 'dashboard' }
];
