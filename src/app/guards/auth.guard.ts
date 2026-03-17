import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the signal is already resolved (user navigating within the app),
  // return immediately without waiting for the observable.
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise wait for the first definitive (non-null) Firebase auth emission.
  // Using filter(u => u !== null) prevents the guard from acting on the
  // transient null emitted before Firebase resolves the cached session.
  return authService.authState$.pipe(
    filter(user => user !== null),
    take(1),
    map(() => true),
    // Timeout fallback: if Firebase never resolves (e.g. offline), redirect.
    tap({
      error: () => router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
    })
  );
};
