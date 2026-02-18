import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User as FirebaseUser,
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

  // Signals for reactive state management
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Firebase auth state observable
  authState$ = authState(this.auth);

  constructor() {
    // Subscribe to auth state changes
    this.authState$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userData = await this.userService.getUserByUid(firebaseUser.uid);
        this.currentUser.set(userData);
      } else {
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
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Update last login
      await this.userService.updateLastLogin(userCredential.user.uid);
      
      // Navigate to dashboard
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Login error:', error);
      
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
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser.set(null);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
