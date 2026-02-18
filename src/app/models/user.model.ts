export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export enum UserRole {
  MINISTER = 'minister',
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserCreateRequest {
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
}
