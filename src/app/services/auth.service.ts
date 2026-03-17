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
          // Fetch user data from Firestore — must run inside injection context
          // because AngularFire internally calls inject() in getDoc/doc APIs.
          const userData = await runInInjectionContext(this.injector, () =>
            this.userService.getUserByUid(firebaseUser.uid)
          );
          this.currentUser.set(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Still mark as authenticated even if Firestore fetch fails
          this.currentUser.set(null);
        }
      } else {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      }
    });
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
