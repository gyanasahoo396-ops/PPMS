import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Return the observable that waits for auth state
  return authService.authState$.pipe(
    take(1), // Take the first emitted value (completed init)
    map(user => !!user), // Convert to boolean
    tap(loggedIn => {
      if (!loggedIn) {
        // Redirect to login page with return url
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
};
