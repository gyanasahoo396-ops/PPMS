import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { User, UserRole, UserCreateRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private injector  = inject(Injector);
  private usersCollection = collection(this.firestore, 'users');

  private run<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  /**
   * Get user data by UID
   */
  async getUserByUid(uid: string): Promise<User | null> {
    // Intentionally NOT catching offline errors — let them propagate so the
    // caller can distinguish "offline" (throws) from "doc not found" (null).
    const userSnapshot = await this.run(() => getDoc(doc(this.usersCollection, uid)));
    if (!userSnapshot.exists()) return null;
    const data = userSnapshot.data();
    return {
      uid: userSnapshot.id,
      email: data['email'],
      displayName: data['displayName'],
      phoneNumber: data['phoneNumber'],
      role: data['role'] as UserRole,
      department: data['department'],
      createdAt: data['createdAt']?.toDate() || new Date(),
      lastLogin: data['lastLogin']?.toDate(),
      isActive: data['isActive'] ?? true
    };
  }

  /**
   * Get user data by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const querySnapshot = await this.run(() => getDocs(query(this.usersCollection, where('email', '==', email))));
      if (querySnapshot.empty) return null;
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      return {
        uid: userDoc.id,
        email: data['email'],
        displayName: data['displayName'],
        phoneNumber: data['phoneNumber'],
        role: data['role'] as UserRole,
        department: data['department'],
        createdAt: data['createdAt']?.toDate() || new Date(),
        lastLogin: data['lastLogin']?.toDate(),
        isActive: data['isActive'] ?? true
      };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  /** Auto-provision a Firestore profile for a Firebase Auth user on first login. */
  async createSelfProfile(firebaseUser: { uid: string; email: string | null; displayName: string | null }): Promise<User> {
    const displayName = firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User';
    const role = UserRole.ADMIN;
    await this.run(() => setDoc(doc(this.usersCollection, firebaseUser.uid), {
      email: firebaseUser.email ?? '',
      displayName,
      role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true,
    }));
    console.log('Auto-provisioned Firestore profile for', firebaseUser.email, 'with role:', role);
    return { uid: firebaseUser.uid, email: firebaseUser.email ?? '', displayName, role, createdAt: new Date(), isActive: true };
  }

  /**
   * Create a new user document in Firestore
   */
  async createUser(uid: string, userData: UserCreateRequest): Promise<void> {
    try {
      await this.run(() => setDoc(doc(this.usersCollection, uid), {
        email: userData.email,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber || null,
        role: userData.role,
        department: userData.department || null,
        createdAt: serverTimestamp(),
        lastLogin: null,
        isActive: true
      }));
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      await this.run(() => updateDoc(doc(this.usersCollection, uid), { lastLogin: serverTimestamp() }));
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      await this.run(() => updateDoc(doc(this.usersCollection, uid), { role }));
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(uid: string): Promise<void> {
    try {
      await this.run(() => updateDoc(doc(this.usersCollection, uid), { isActive: false }));
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async activateUser(uid: string): Promise<void> {
    try {
      await this.run(() => updateDoc(doc(this.usersCollection, uid), { isActive: true }));
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  /**
   * Get all users (for admin)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await this.run(() => getDocs(this.usersCollection));
      return querySnapshot.docs.map(d => {
        const data = d.data();
        return {
          uid: d.id,
          email: data['email'],
          displayName: data['displayName'],
          phoneNumber: data['phoneNumber'],
          role: data['role'] as UserRole,
          department: data['department'],
          createdAt: data['createdAt']?.toDate() || new Date(),
          lastLogin: data['lastLogin']?.toDate(),
          isActive: data['isActive'] ?? true
        };
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const q = query(this.usersCollection, where('role', '==', role));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data['email'],
          displayName: data['displayName'],
          phoneNumber: data['phoneNumber'],
          role: data['role'] as UserRole,
          department: data['department'],
          createdAt: data['createdAt']?.toDate() || new Date(),
          lastLogin: data['lastLogin']?.toDate(),
          isActive: data['isActive'] ?? true
        };
      });
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
}
