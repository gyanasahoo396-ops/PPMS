import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check Firebase auth state which updates immediately after login
  return authService.authState$.pipe(
    take(1),
    tap(user => {
      console.log('Auth guard checking state:', !!user);
    }),
    map(user => !!user),
    tap(loggedIn => {
      if (!loggedIn) {
        console.log('User not authenticated, redirecting to login');
        // Redirect to login page with return url
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      } else {
        console.log('User authenticated, allowing access');
      }
    })
  );
};
