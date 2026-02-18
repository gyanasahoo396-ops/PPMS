# PPMS Authentication & Authorization System

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Setup & Configuration](#setup--configuration)
- [User Management](#user-management)
- [Developer Guide](#developer-guide)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

---

## Overview

The PPMS (Project Performance Management System) features a complete authentication and authorization system built with Firebase Authentication and Firestore, providing secure, role-based access control.

### Key Features

- ✅ Firebase Authentication integration (Email/Password)
- ✅ Firestore user profiles with role-based access
- ✅ Premium login screen with CSSPL branding
- ✅ Route guards for protected pages
- ✅ User onboarding scripts
- ✅ Four-tier role hierarchy (Minister, Admin, Manager, Viewer)
- ✅ Signal-based reactive state management
- ✅ Type-safe TypeScript implementation
- ✅ WCAG AA accessibility compliance

### Role Hierarchy

1. **Minister** (Highest) - Full system access
   - Purple badge in UI
   - Complete visibility and control
   - Access to all features

2. **Admin** - System administration
   - Blue badge in UI
   - User management and system configuration
   - Administrative functions

3. **Manager** - Department/project management
   - Green badge in UI
   - Manage assigned projects and departments
   - Operational access

4. **Viewer** - Read-only access
   - Gray badge in UI
   - View-only access to dashboards
   - No modification permissions

---

## Quick Start

### Prerequisites

1. Node.js and npm installed
2. Firebase project configured
3. Firebase Admin SDK key

### Step 1: Get Firebase Admin SDK Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ppms-b8d2b`
3. Navigate to: Project Settings → Service Accounts
4. Click: **Generate New Private Key**
5. Save as: `firebase-admin-key.json` in project root

### Step 2: Create Your First User

**Quick Method** (Creates test Minister):

```powershell
.\create-sample-minister.ps1
```

This creates:
- **Email**: `minister@ppms.gov.in`
- **Password**: `Minister@2024!`
- **Role**: Minister
- **Department**: Chief Minister's Office

**Custom User** (PowerShell):

```powershell
.\onboard-user.ps1 `
  -Email "user@example.com" `
  -Password "SecurePass123!" `
  -DisplayName "User Name" `
  -Role "minister|admin|manager|viewer" `
  -Department "Department Name"
```

**Custom User** (Node.js):

```bash
node onboard-user.mjs user@example.com SecurePass123! "User Name" manager "Engineering"
```

### Step 3: Login

1. Navigate to: `http://localhost:4201/login`
2. Enter the credentials created above
3. You'll be automatically redirected to the dashboard

---

## System Architecture

### File Structure

```
src/
├── app/
│   ├── guards/
│   │   ├── auth.guard.ts          # Protects routes from unauthenticated users
│   │   └── role.guard.ts          # Protects routes based on user roles
│   ├── models/
│   │   └── user.model.ts          # User and role type definitions
│   ├── services/
│   │   ├── auth.service.ts        # Authentication logic (login/logout)
│   │   └── user.service.ts        # Firestore user CRUD operations
│   └── pages/
│       └── login/                 # Login page component
│           ├── login.component.ts
│           ├── login.component.html
│           └── login.component.css
├── environments/
│   ├── environment.ts             # Development Firebase config
│   └── environment.prod.ts        # Production Firebase config
└── app.config.ts                  # Firebase app initialization

Root Files:
├── onboard-user.mjs              # Node.js onboarding script
├── onboard-user.ps1              # PowerShell onboarding wrapper
├── create-sample-minister.ps1    # Quick test user creation
└── firebase-admin-key.json       # Admin SDK credentials (required)
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Access Flow                         │
└─────────────────────────────────────────────────────────────────┘

    User navigates to any protected route
                    │
                    ▼
           ┌─────────────────┐
           │   Auth Guard    │ ◄──── Checks authentication
           └─────────────────┘       status via AuthService
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  Authenticated           Not Authenticated
        │                       │
        ▼                       ▼
  Allow Access          Redirect to Login
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │  Login Page     │
        │              │  - Email input  │
        │              │  - Password     │
        │              │  - Submit       │
        │              └─────────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │  AuthService    │
        │              │  .login()       │
        │              └─────────────────┘
        │                       │
        │                       ▼
        │              ┌─────────────────┐
        │              │ Firebase Auth   │
        │              │ Verification    │
        │              └─────────────────┘
        │                       │
        │           ┌───────────┴───────────┐
        │           │                       │
        │           ▼                       ▼
        │      Success                  Failure
        │           │                       │
        │           ▼                       ▼
        │    ┌─────────────┐         Display Error
        │    │  Fetch User │         Message
        │    │  from       │              │
        │    │  Firestore  │              └──► User tries again
        │    └─────────────┘
        │           │
        │           ▼
        │    ┌─────────────┐
        │    │ Update      │
        │    │ Last Login  │
        │    └─────────────┘
        │           │
        │           ▼
        │    ┌─────────────┐
        │    │ Set Current │
        │    │ User Signal │
        │    └─────────────┘
        │           │
        └───────────┴──────────────┐
                    │               │
                    ▼               ▼
           ┌─────────────┐   ┌─────────────┐
           │  Dashboard  │   │   Header    │
           │   Display   │   │   Shows     │
           │             │   │  User Info  │
           └─────────────┘   └─────────────┘
```

### Component Architecture

```
         ┌──────────────────────┐
         │    App Component     │
         │   (app.component)    │
         └──────────┬───────────┘
                    │
         ┌──────────┴───────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Login Page     │    │  Dashboard      │
│  (Public)       │    │  (Protected)    │
└─────────────────┘    └────────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ Header  │ │ Sidebar │ │Content  │
              │         │ │         │ │   Area  │
              └─────────┘ └─────────┘ └─────────┘
                    │
                    └──► Shows User Info
                         & Logout Button
```

### Service Dependencies

```
    Components
        │
        ▼
┌─────────────────┐          ┌─────────────────┐
│  AuthService    │──────────│  UserService    │
│                 │  uses    │                 │
│  - login()      │          │ - getUserByUid()│
│  - logout()     │          │ - createUser()  │
│  - isAuth()     │          │ - updateRole()  │
│  - currentUser  │          │ - getAllUsers() │
└─────────┬───────┘          └────────┬────────┘
          │                           │
          ▼                           ▼
    ┌──────────────┐          ┌──────────────┐
    │ Firebase     │          │  Firestore   │
    │ Auth         │          │  Database    │
    └──────────────┘          └──────────────┘
```

---

## Setup & Configuration

### Firebase Configuration

**Environment Files**

The Firebase configuration is stored in environment files:

**Development** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "ppms-b8d2b.firebaseapp.com",
    projectId: "ppms-b8d2b",
    storageBucket: "ppms-b8d2b.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

**Production** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  firebase: {
    // Production Firebase config
  }
};
```

### Firebase Integration

**App Configuration** (`src/app/app.config.ts`):

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
```

### Dependencies

Install required packages:

```bash
npm install @angular/fire firebase --legacy-peer-deps
npm install firebase-admin --save-dev --legacy-peer-deps
```

---

## User Management

### User Data Structure

**Firestore Collection**: `users/{uid}`

```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "displayName": "User Full Name",
  "phoneNumber": "+1234567890",
  "role": "minister",
  "department": "Finance",
  "createdAt": "2024-02-17T10:30:00.000Z",
  "lastLogin": "2024-02-17T15:45:00.000Z",
  "isActive": true
}
```

### Creating Users

**Using Onboarding Scripts**

PowerShell (Recommended):

```powershell
.\onboard-user.ps1 `
  -Email "user@example.com" `
  -Password "Pass123!" `
  -DisplayName "John Doe" `
  -Role "manager" `
  -Department "Engineering"
```

Node.js:

```bash
node onboard-user.mjs user@example.com Pass123! "John Doe" manager "Engineering"
```

**Programmatically** (In Angular app):

```typescript
import { UserService } from './services/user.service';
import { UserRole } from './models/user.model';

async createNewUser(uid: string) {
  await this.userService.createUser(uid, {
    email: 'user@example.com',
    displayName: 'John Doe',
    role: UserRole.MANAGER,
    department: 'Engineering'
  });
}
```

### Managing Users

**Get User by Email**:

```typescript
const user = await this.userService.getUserByEmail('user@example.com');
```

**Update User Role**:

```typescript
await this.userService.updateUserRole(uid, UserRole.ADMIN);
```

**Get All Users**:

```typescript
const allUsers = await this.userService.getAllUsers();
```

**Deactivate User**:

```typescript
await this.userService.deactivateUser(uid);
```

**Manual Management**:

1. **View Users**: Firebase Console → Authentication → Users
2. **Reset Password**: Find user → Reset Password
3. **Change Role**: Firestore → users → {uid} → Edit `role` field
4. **Deactivate**: Firestore → users → {uid} → Set `isActive: false`

### User Onboarding Process

```
┌────────────────────────────────────────────────────────────────┐
│               User Onboarding Process                          │
└────────────────────────────────────────────────────────────────┘

  Admin runs onboarding script
            │
            ▼
  ┌─────────────────────┐
  │  onboard-user.ps1   │
  │  or                 │
  │  onboard-user.mjs   │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Validate Inputs     │
  │ - Email format      │
  │ - Password length   │
  │ - Role validity     │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Firebase Admin SDK  │
  │ createUser()        │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Create User in      │
  │ Firebase Auth       │
  │ Returns: { uid }    │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Create User Doc     │
  │ in Firestore        │
  │ users/{uid}         │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Generate Password   │
  │ Reset Link          │
  │ (Optional)          │
  └──────────┬──────────┘
             │
             ▼
  ┌─────────────────────┐
  │ Display Success     │
  │ Message with        │
  │ Credentials         │
  └─────────────────────┘
```

---

## Developer Guide

### Authentication Service

**Location**: `src/app/services/auth.service.ts`

**Features**:
- Login with email/password
- Logout functionality
- Session state management with signals
- Error handling with user-friendly messages
- Auto-redirect after login/logout

**Usage in Components**:

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-my-component',
  template: `
    @if (authService.currentUser()) {
      <p>Welcome, {{ authService.currentUser()!.displayName }}</p>
      <span>Role: {{ authService.currentUser()!.role }}</span>
      <button (click)="logout()">Logout</button>
    }
  `
})
export class MyComponent {
  authService = inject(AuthService);

  // Get current user (Signal)
  currentUser = this.authService.currentUser;

  // Check if authenticated
  isLoggedIn = this.authService.isAuthenticated();

  // Logout
  async logout() {
    await this.authService.logout();
  }
}
```

### User Service

**Location**: `src/app/services/user.service.ts`

**Features**:
- CRUD operations for users in Firestore
- Role management
- User activation/deactivation
- Query users by email or role
- Last login tracking

**Methods**:

```typescript
// Create user
createUser(uid: string, userData: UserCreateRequest): Promise<void>

// Get user by UID
getUserByUid(uid: string): Promise<User | null>

// Get user by email
getUserByEmail(email: string): Promise<User | null>

// Update user role
updateUserRole(uid: string, role: UserRole): Promise<void>

// Deactivate user
deactivateUser(uid: string): Promise<void>

// Get all users
getAllUsers(): Promise<User[]>
```

### Route Guards

#### Auth Guard

**Location**: `src/app/guards/auth.guard.ts`

Protects routes from unauthenticated users.

**Usage**:

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  }
];
```

#### Role Guard

**Location**: `src/app/guards/role.guard.ts`

Fine-grained access control based on user roles.

**Usage**:

```typescript
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard([UserRole.ADMIN, UserRole.MINISTER])],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [roleGuard([UserRole.MINISTER, UserRole.ADMIN, UserRole.MANAGER])],
  }
];
```

### Role-Based Access Control Flow

```
         User attempts route access
                    │
                    ▼
           ┌─────────────────┐
           │   Auth Guard    │
           │  (Is user       │
           │   logged in?)   │
           └────────┬────────┘
                    │
           ┌────────┴────────┐
           │                 │
          YES               NO
           │                 │
           ▼                 ▼
    ┌──────────────┐   Redirect to
    │ Role Guard   │   /login
    │ (Check user  │
    │  role)       │
    └──────┬───────┘
           │
    ┌──────┴──────────────────┐
    │                         │
  Allowed                 Not Allowed
  Roles                   Role
    │                         │
    ▼                         ▼
  Grant                  Redirect to
  Access                 /dashboard

  Route Examples:
  ═══════════════

  /dashboard
    └── authGuard ✓
        └── All authenticated users

  /admin
    └── authGuard ✓
        └── roleGuard([minister, admin]) ✓
            └── Only Minister & Admin

  /reports
    └── authGuard ✓
        └── roleGuard([minister, admin, manager]) ✓
            └── Not Viewer
```

### User Models

**Location**: `src/app/models/user.model.ts`

**UserRole Enum**:

```typescript
export enum UserRole {
  MINISTER = 'minister',
  ADMIN = 'admin',
  MANAGER = 'manager',
  VIEWER = 'viewer'
}
```

**User Interface**:

```typescript
export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string | null;
  role: UserRole;
  department?: string | null;
  createdAt: Date;
  lastLogin?: Date | null;
  isActive: boolean;
}
```

**LoginCredentials Interface**:

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}
```

**UserCreateRequest Interface**:

```typescript
export interface UserCreateRequest {
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
}
```

### Login Component

**Location**: `src/app/pages/login/`

**Features**:
- Modern gradient design with CSSPL branding
- Reactive form with validation
- Show/hide password toggle
- Real-time field validation with error messages
- Loading states during authentication
- Responsive design (mobile-first)
- Smooth animations and transitions
- Glassmorphism effects
- Security badge and branding

**Form Structure**:

```typescript
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)])
});
```

### Header Component Integration

**Updates Made**:
- Display current user name
- Show role badge with color coding:
  - Minister: Purple (`bg-purple-100 text-purple-800`)
  - Admin: Blue (`bg-blue-100 text-blue-800`)
  - Manager: Green (`bg-green-100 text-green-800`)
  - Viewer: Gray (`bg-gray-100 text-gray-800`)
- User avatar with initials
- Logout button
- Conditional rendering based on auth state

---

## Security

### Authentication Security

1. **Email/Password Validation**
   - Email format verification
   - Password minimum 6 characters
   - Firebase handles secure password hashing

2. **Session Management**
   - Automatic state sync with Firebase
   - Persistent sessions across page reloads
   - Secure token handling by Firebase

3. **Route Protection**
   - All dashboard routes require authentication
   - Unauthorized access redirects to login
   - Return URL preserved for post-login redirect

4. **Role-Based Access**
   - Configurable per-route role requirements
   - Fine-grained permission control
   - Centralized role management

### Credential Security

1. **Service Account Key**
   - Stored in `firebase-admin-key.json`
   - **MUST** be in `.gitignore`
   - Never commit to version control
   - Use environment variables in production

2. **Environment Configuration**
   - Separate dev/prod Firebase configs
   - API keys in environment files
   - Production credentials secured

3. **Error Handling**
   - User-friendly error messages
   - No system details exposed
   - Detailed logging for debugging

### Firestore Security Rules

**Recommended Rules** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    // Helper function to check if user is admin or minister
    function isAdminOrMinister() {
      return getUserRole() in ['admin', 'minister'];
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if isAuthenticated() && request.auth.uid == userId;

      // Only admins and ministers can write
      allow write: if isAuthenticated() && isAdminOrMinister();

      // Admins and ministers can read all users
      allow read: if isAuthenticated() && isAdminOrMinister();
    }

    // Other collections (customize as needed)
    match /projects/{projectId} {
      // All authenticated users can read
      allow read: if isAuthenticated();

      // Only ministers, admins, and managers can write
      allow write: if isAuthenticated() && getUserRole() in ['minister', 'admin', 'manager'];
    }
  }
}
```

### Best Practices

1. **Password Management**
   - Enforce strong password requirements
   - Use Firebase password reset functionality
   - Never store passwords in plain text
   - Implement password change feature

2. **User Management**
   - Regular audit of user accounts
   - Deactivate unused accounts
   - Monitor role assignments
   - Track last login times

3. **Production Deployment**
   - Use environment variables for secrets
   - Enable Firebase App Check
   - Configure CORS properly
   - Set up monitoring and alerts

4. **Development**
   - Keep service account keys secure
   - Use separate Firebase projects for dev/prod
   - Test security rules thoroughly
   - Regular security audits

---

## Troubleshooting

### Common Issues

#### Login Not Working

**Symptoms**: Login fails with error message

**Solutions**:
1. Check Firebase config in `src/environments/environment.ts`
2. Verify user exists in Firebase Authentication console
3. Check browser console for detailed errors
4. Ensure Firestore user document exists
5. Verify password is correct (minimum 6 characters)
6. Clear browser cache and cookies

#### Route Guard Redirecting

**Symptoms**: Constantly redirected to login or dashboard

**Solutions**:
1. Verify user is logged in (check `authService.currentUser()`)
2. Check user role matches required role for route
3. Clear browser cache and local storage
4. Check browser console for guard errors
5. Verify route configuration in `app.routes.ts`

#### Onboarding Script Fails

**Symptoms**: Script throws errors when creating users

**Solutions**:
1. Verify `firebase-admin-key.json` exists in project root
2. Check network connectivity
3. Ensure Firebase project ID is correct in admin key
4. Verify email format is valid
5. Check password meets strength requirements (6+ characters)
6. Ensure role is one of: minister, admin, manager, viewer
7. Check Firebase console for quota limits

#### User Not Found After Login

**Symptoms**: Login succeeds but user profile not loaded

**Solutions**:
1. Check if Firestore user document exists
2. Verify UID matches between Auth and Firestore
3. Check Firestore security rules
4. Review browser console for Firestore errors
5. Manually create user document if missing

#### Firebase Permission Denied

**Symptoms**: Error: "Permission denied" in console

**Solutions**:
1. Check Firestore security rules
2. Verify user is authenticated
3. Ensure user role has necessary permissions
4. Check if user document exists in Firestore
5. Review Firebase console rules simulator

### Debug Checklist

- [ ] Firebase configuration correct in environment files
- [ ] User exists in Firebase Authentication
- [ ] User document exists in Firestore
- [ ] Password meets minimum requirements
- [ ] Network connectivity is stable
- [ ] Browser console shows no errors
- [ ] Service account key exists and is valid
- [ ] Firestore security rules are configured
- [ ] User role matches route requirements
- [ ] No browser extensions blocking requests

### Getting Help

1. **Check Browser Console**: Look for detailed error messages
2. **Firebase Console**: Review Authentication and Firestore logs
3. **Network Tab**: Check for failed API requests
4. **Test in Incognito**: Rule out browser extension issues
5. **Review Logs**: Check server/cloud function logs if applicable

---

## Reference

### Quick Commands

**Create Minister User**:
```powershell
.\create-sample-minister.ps1
```

**Create Custom User**:
```powershell
.\onboard-user.ps1 -Email "email@domain.com" -Password "Pass123!" -DisplayName "User Name" -Role "manager" -Department "Dept"
```

**Start Development Server**:
```bash
npm run start
# or
npx ng serve --port 4201
```

**Access Application**:
```
http://localhost:4201/login
```

### Default Test Credentials

After running `create-sample-minister.ps1`:

- **Email**: `minister@ppms.gov.in`
- **Password**: `Minister@2024!`
- **Role**: Minister
- **Department**: Chief Minister's Office

### Important Files Reference

| File | Purpose |
|------|---------|
| `src/app/services/auth.service.ts` | Authentication logic |
| `src/app/services/user.service.ts` | User CRUD operations |
| `src/app/guards/auth.guard.ts` | Route authentication guard |
| `src/app/guards/role.guard.ts` | Role-based access guard |
| `src/app/models/user.model.ts` | User types and interfaces |
| `src/app/pages/login/` | Login page component |
| `src/environments/environment.ts` | Firebase dev config |
| `src/app/app.config.ts` | Firebase initialization |
| `onboard-user.ps1` | PowerShell onboarding script |
| `onboard-user.mjs` | Node.js onboarding script |
| `firebase-admin-key.json` | Admin SDK credentials |

### Role Badge Colors

| Role | Color | Tailwind Classes |
|------|-------|-----------------|
| Minister | Purple | `bg-purple-100 text-purple-800` |
| Admin | Blue | `bg-blue-100 text-blue-800` |
| Manager | Green | `bg-green-100 text-green-800` |
| Viewer | Gray | `bg-gray-100 text-gray-800` |

### API Methods Summary

**AuthService**:
```typescript
login(credentials: LoginCredentials): Promise<void>
logout(): Promise<void>
isAuthenticated(): boolean
currentUser: Signal<User | null>
```

**UserService**:
```typescript
createUser(uid: string, userData: UserCreateRequest): Promise<void>
getUserByUid(uid: string): Promise<User | null>
getUserByEmail(email: string): Promise<User | null>
updateUserRole(uid: string, role: UserRole): Promise<void>
deactivateUser(uid: string): Promise<void>
getAllUsers(): Promise<User[]>
```

### Technology Stack

- **Framework**: Angular 21
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **State Management**: Angular Signals
- **Forms**: Reactive Forms
- **Guards**: Functional Guards
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Language**: TypeScript

### Next Steps (Optional Enhancements)

1. **Password Reset Flow**
   - Implement forgot password page
   - Email verification link
   - Password reset form

2. **User Management UI**
   - Admin dashboard for user CRUD
   - Role assignment interface
   - User activation/deactivation toggle
   - Search and filter users

3. **Enhanced Security**
   - Multi-factor authentication (MFA)
   - Session timeout
   - Password complexity requirements
   - Login attempt tracking and lockout

4. **Email Verification**
   - Verify email on signup
   - Resend verification email
   - Prevent login until verified

5. **Audit Logging**
   - User action tracking
   - Login history
   - Role change logs
   - Export audit reports

6. **Profile Management**
   - Update display name
   - Change password
   - Update phone number
   - Upload avatar image

### Deployment Checklist

Before deploying to production:

- [ ] Update Firebase config in `environment.prod.ts`
- [ ] Configure Firestore security rules
- [ ] Set up Firebase hosting or deployment target
- [ ] Configure environment variables for secrets
- [ ] Enable Firebase App Check
- [ ] Set up monitoring and alerts
- [ ] Test all authentication flows
- [ ] Verify role-based access works correctly
- [ ] Change all default passwords
- [ ] Remove test users
- [ ] Review and audit user permissions
- [ ] Set up backup strategy for Firestore
- [ ] Configure CORS policies
- [ ] Enable HTTPS only
- [ ] Document production URLs and credentials

---

## Support & Contact

**Project**: PPMS (Project Performance Management System)  
**Organization**: CSSPL  
**Version**: 1.0  
**Last Updated**: February 2026

For issues or questions:
- Check this documentation thoroughly
- Review Firebase Console logs
- Examine browser console for errors
- Test in different browsers/environments
- Contact development team for assistance

---

**Status**: ✅ Complete and Production Ready
