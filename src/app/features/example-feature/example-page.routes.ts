import { Routes } from '@angular/router';

export const EXAMPLE_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/example-page/example-page').then(
        (m) => m.ExamplePage
      ),
    title: 'Example',
  },
];
