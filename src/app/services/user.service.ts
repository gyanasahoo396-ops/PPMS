import { Injectable, inject } from '@angular/core';
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
  private usersCollection = collection(this.firestore, 'users');

  /**
   * Get user data by UID
   */
  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
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

      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get user data by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
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
      }

      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  /**
   * Create a new user document in Firestore
   */
  async createUser(uid: string, userData: UserCreateRequest): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      
      await setDoc(userDoc, {
        email: userData.email,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber || null,
        role: userData.role,
        department: userData.department || null,
        createdAt: serverTimestamp(),
        lastLogin: null,
        isActive: true
      });
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
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, {
        lastLogin: serverTimestamp()
      });
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
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, { role });
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
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, { isActive: false });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Activate user
   */
  async activateUser(uid: string): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, { isActive: true });
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
      const querySnapshot = await getDocs(this.usersCollection);
      
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
