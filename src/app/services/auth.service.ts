import { Injectable, inject, signal, Injector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private userService = inject(UserService);
  private injector = inject(Injector);

  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isAuthenticated = signal(false);

  // Firebase auth state observable
  authState$ = authState(this.auth);

  constructor() {
    // Subscribe to auth state changes
    this.authState$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        this.isAuthenticated.set(true);
        try {
          const userData = await runInInjectionContext(this.injector, () =>
            this.userService.getUserByUid(firebaseUser.uid)
          );
          if (userData) {
            // Cache role so it survives offline sessions
            localStorage.setItem(`ppms_role_${firebaseUser.uid}`, userData.role);
            this.currentUser.set(userData);
          } else {
            // Doc doesn't exist yet — auto-provision Firestore profile on first login
            const created = await runInInjectionContext(this.injector, () =>
              this.userService.createSelfProfile(firebaseUser)
            );
            localStorage.setItem(`ppms_role_${firebaseUser.uid}`, created.role);
            this.currentUser.set(created);
          }
        } catch (error) {
          // Firestore offline — restore role from localStorage cache so save/edit buttons remain enabled
          console.warn('Firestore offline — using cached role for fallback.');
          const cachedRole = localStorage.getItem(`ppms_role_${firebaseUser.uid}`) ?? 'viewer';
          this.currentUser.set({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
            role: cachedRole as any,
            createdAt: new Date(),
            isActive: true,
          } as any);
          this.scheduleFirestoreRetry(firebaseUser.uid);
        }
      } else {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      }
    });
  }

  /** Retry loading full user profile from Firestore after a delay (handles offline startup) */
  private scheduleFirestoreRetry(uid: string, attempt = 1): void {
    const delayMs = Math.min(attempt * 3000, 15000); // 3s, 6s, 9s … max 15s
    setTimeout(() => {
      runInInjectionContext(this.injector, () => this.userService.getUserByUid(uid))
        .then(userData => {
          if (userData) {
            localStorage.setItem(`ppms_role_${uid}`, userData.role);
            this.currentUser.set(userData);
          } else if (attempt < 5) {
            this.scheduleFirestoreRetry(uid, attempt + 1);
          }
        })
        .catch(() => {
          if (attempt < 5) this.scheduleFirestoreRetry(uid, attempt + 1);
        });
    }, delayMs);
  }

  /**
   * Sign in with email and password
   */
  async login(email: string, password: string): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      console.log('Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful, user UID:', userCredential.user.uid);
      
      // Update last login (fire and forget, don't block navigation)
      this.userService.updateLastLogin(userCredential.user.uid).catch(error => {
        console.warn('Failed to update last login:', error);
      });
      
      // Navigate to home
      console.log('Navigating to home...');
      const navigated = await this.router.navigate(['/home']);
      console.log('Navigation result:', navigated);
      this.isLoading.set(false);
    } catch (error: any) {
      console.error('Login error:', error);
      this.isLoading.set(false);
      
      // Set user-friendly error message
      switch (error.code) {
        case 'auth/invalid-email':
          this.errorMessage.set('Invalid email address.');
          break;
        case 'auth/user-disabled':
          this.errorMessage.set('This account has been disabled.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          this.errorMessage.set('Invalid email or password.');
          break;
        case 'auth/invalid-credential':
          this.errorMessage.set('Invalid credentials. Please check your email and password.');
          break;
        default:
          this.errorMessage.set('An error occurred during login. Please try again.');
      }
      
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      console.log('Logging out user...');
      
      // Reset all signals immediately to prevent race conditions
      this.isLoading.set(false);
      this.errorMessage.set(null);
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      
      // Sign out from Firebase
      await signOut(this.auth);
      console.log('Signed out from Firebase');
      
      // Navigate to login page
      await this.router.navigate(['/login']);
      console.log('Navigated to login page');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear auth state even if logout fails
      this.isLoading.set(false);
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
