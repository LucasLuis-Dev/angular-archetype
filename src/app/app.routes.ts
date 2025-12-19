import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
    {
    path: 'example',
    canActivate: [authGuard],
    loadChildren: () =>
        import('./features/example-feature/example-page.routes').then(
        (m) => m.EXAMPLE_FEATURE_ROUTES
        ),
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
