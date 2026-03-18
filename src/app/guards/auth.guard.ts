import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the signal is already resolved (user navigating within the app),
  // return immediately without waiting for the observable.
  if (authService.isAuthenticated()) {
    return true;
  }

  // Wait for the first definitive Firebase auth emission, then either
  // allow navigation (authenticated) or redirect to login (unauthenticated).
  return authService.authState$.pipe(
    take(1),
    map(user => user ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }))
  );
};
