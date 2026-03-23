import { inject } from '@angular/core';
import { CanActivateFn, Routes, Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { UiToastService } from './shared/ui-toast.service';

const shouldShowLoginToast = (url: string): boolean => {
  return url.startsWith('/destinations/all') || url.startsWith('/book-tour');
};

const requireAuth: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const uiToast = inject(UiToastService);
  if (authService.user) {
    return true;
  }
  if (shouldShowLoginToast(state.url)) {
    uiToast.show('Please login to move ahead');
  }
  sessionStorage.setItem('auth_return', state.url);
  return router.createUrlTree(['/signin']);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./empty-route.component').then((m) => m.AppEmptyRoute),
    pathMatch: 'full',
  },
  {
    path: 'destinations',
    loadComponent: () => import('./empty-route.component').then((m) => m.AppEmptyRoute),
    pathMatch: 'full',
  },
  {
    path: 'destinations/all',
    loadComponent: () =>
      import('./destinations/destinations-view-all.component').then((m) => m.DestinationsViewAllComponent),
    canActivate: [requireAuth],
  },
  {
    path: 'destination/:id',
    loadComponent: () =>
      import('./destinations/destination-detail.component').then((m) => m.DestinationDetail),
  },
  {
    path: 'book-tour',
    loadComponent: () => import('./book-tour/book-tour-page.component').then((m) => m.BookTourPage),
    canActivate: [requireAuth],
  },
  {
    path: 'book-tour/:id',
    loadComponent: () => import('./book-tour/book-tour-page.component').then((m) => m.BookTourPage),
    canActivate: [requireAuth],
  },

  {
    path: 'signin',
    loadComponent: () => import('./empty-route.component').then((m) => m.AppEmptyRoute),
  },
  {
    path: 'signup',
    loadComponent: () => import('./empty-route.component').then((m) => m.AppEmptyRoute),
  },
  {
    path: 'profiles',
    loadComponent: () => import('./profile/profile-page.component').then((m) => m.ProfilePage),
    canActivate: [requireAuth],
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile-page.component').then((m) => m.ProfilePage),
    canActivate: [requireAuth],
  },

  {
    path: '**',
    loadComponent: () => import('./destinations/fallback-page.component').then((m) => m.Placeholder),
  },
];
