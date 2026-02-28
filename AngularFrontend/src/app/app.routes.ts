import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'order', pathMatch: 'full' },
  {
    path: 'order',
    loadComponent: () =>
      import('./features/order-wizard/order-wizard.component').then(m => m.OrderWizardComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/order-wizard/select-template/select-template.component').then(m => m.SelectTemplateComponent),
      },
      {
        path: ':family/products',
        loadComponent: () =>
          import('./features/order-wizard/select-products/select-products.component').then(m => m.SelectProductsComponent),
      },
      {
        path: ':family/browse',
        loadComponent: () =>
          import('./features/order-wizard/browse-imagery/browse-imagery.component').then(m => m.BrowseImageryComponent),
      },
      {
        path: ':family/configure',
        loadComponent: () =>
          import('./features/order-wizard/configure/configure.component').then(m => m.ConfigureComponent),
      },
      {
        path: ':family/schedule',
        loadComponent: () =>
          import('./features/order-wizard/schedule/schedule.component').then(m => m.ScheduleComponent),
      },
      {
        path: ':family/review',
        loadComponent: () =>
          import('./features/order-wizard/review/review.component').then(m => m.ReviewComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'order' },
];
