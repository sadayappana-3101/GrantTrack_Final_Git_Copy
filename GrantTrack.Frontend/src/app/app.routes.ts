import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Authenticated landing — picks a dashboard by role.
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },

  // Forbidden landing for the role guard.
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/forbidden/forbidden.component').then(
        m => m.ForbiddenComponent,
      ),
  },

  // Module 2 — Admin (users + programs + reviewer assignments).
  // The guard chain inside admin.routes.ts blocks non-Admin users.
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  // Module 3 — Applicant (browse programs + apply + my-applications).
  {
    path: 'applicant',
    loadChildren: () =>
      import('./features/applicant/applicant.routes').then(m => m.APPLICANT_ROUTES),
  },

  //Reviewer
  {
    path: 'reviewer',
    loadChildren: () =>
      import('./features/reviewer/reviewer.routes').then(m => m.REVIEWER_ROUTES),
  },

  //Approver
  {
    path: 'approver',
    loadChildren: () =>
      import('./features/approver/approver.routes').then(m => m.APPROVER_ROUTES),
  },

  //Finance Officer
  {
    path: 'finance',
    loadChildren: () =>
      import('./features/finance/finance.routes').then(m => m.FINANCE_ROUTES),
  },

  //Compliance Officer
  {
    path: 'compliance',
    loadChildren: () =>
      import('./features/compliance/compliance.routes').then(m => m.COMPLIANCE_ROUTES),
  },

  { path: '**', redirectTo: 'auth/login' },
];
