# Authentication & Authorization Quick Start Guide

## System Overview

The PPMS (Project Performance Management System) now has a complete authentication and authorization system with:

- ✅ Firebase Authentication integration
- ✅ Firestore user profiles with role-based access
- ✅ Login screen with CSSPL branding
- ✅ Route guards for protected pages
- ✅ User onboarding scripts
- ✅ Role-based permissions (Minister, Admin, Manager, Viewer)

## File Structure

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
└── ONBOARDING.md                 # Detailed onboarding guide
```

## Quick Start

### 1. Development Setup

The development server is already running on port 4201. Navigate to the login page:

```
http://localhost:4201/login
```

### 2. Create Your First User (Minister)

**Step 1**: Get Firebase Admin SDK Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ppms-b8d2b`
3. Project Settings → Service Accounts → Generate New Private Key
4. Save as `firebase-admin-key.json` in project root

**Step 2**: Run Onboarding Script

PowerShell (Recommended):

```powershell
.\onboard-user.ps1 -Email "minister@gov.in" -Password "Minister@2024!" -DisplayName "Hon. Minister" -Role "minister" -Department "PMO"
```

Or directly with Node:

```bash
node onboard-user.mjs minister@gov.in Minister@2024! "Hon. Minister" minister "PMO"
```

### 3. Login

1. Navigate to `http://localhost:4201/login`
2. Enter credentials created above
3. You'll be redirected to the dashboard

## User Roles & Permissions

### Role Hierarchy

1. **Minister** (Highest) - Full system access
   - Purple badge in UI
   - Complete visibility and control

2. **Admin** - System administration
   - Blue badge in UI
   - User management, system configuration

3. **Manager** - Department/project management
   - Green badge in UI
   - Manage assigned projects and departments

4. **Viewer** - Read-only access
   - Gray badge in UI
   - View-only access to dashboards

### Using Role Guards

To protect routes by role, use the `roleGuard`:

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
  },
];
```

## Authentication Service Usage

### In Components

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({...})
export class MyComponent {
  private authService = inject(AuthService);

  // Get current user
  currentUser = this.authService.currentUser; // Signal

  // Check if authenticated
  isLoggedIn = this.authService.isAuthenticated();

  // Logout
  async logout() {
    await this.authService.logout();
  }
}
```

### In Templates

```html
@if (authService.currentUser()) {
<p>Welcome, {{ authService.currentUser()!.displayName }}</p>
<span>Role: {{ authService.currentUser()!.role }}</span>
}
```

## User Service Operations

### Create User Programmatically

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

### Get User by Email

```typescript
const user = await this.userService.getUserByEmail('user@example.com');
```

### Update User Role

```typescript
await this.userService.updateUserRole(uid, UserRole.ADMIN);
```

### Get All Users

```typescript
const allUsers = await this.userService.getAllUsers();
```

## Firestore Data Structure

### Users Collection (`users/{uid}`)

```json
{
  "email": "minister@gov.in",
  "displayName": "Hon. Minister",
  "phoneNumber": null,
  "role": "minister",
  "department": "PMO",
  "createdAt": Timestamp,
  "lastLogin": Timestamp,
  "isActive": true
}
```

## Common Tasks

### Add New User

```powershell
.\onboard-user.ps1 -Email "user@example.com" -Password "Pass123!" -DisplayName "User Name" -Role "manager"
```

### Change User Role

1. Go to Firebase Console → Firestore
2. Find user document
3. Edit `role` field to desired role

### Deactivate User

```typescript
await userService.deactivateUser(uid);
```

### Reset Password

Users can use "Forgot Password" (to be implemented), or:

1. Firebase Console → Authentication
2. Find user → Reset Password

## Security Rules

Ensure Firestore security rules are configured:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth.uid == userId;

      // Only admins and ministers can write
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'minister'];
    }
  }
}
```

## Troubleshooting

### Login Not Working

1. Check Firebase config in `environment.ts`
2. Verify user exists in Firebase Authentication
3. Check browser console for errors
4. Ensure Firestore user document exists

### Route Guard Redirecting

1. Verify user is logged in
2. Check user role matches required role
3. Clear browser cache and try again

### Onboarding Script Fails

1. Verify `firebase-admin-key.json` exists
2. Check network connectivity
3. Ensure Firebase project ID is correct
4. Verify email format and password strength

## Next Steps

1. **Implement Forgot Password** - Add password reset flow
2. **User Management UI** - Admin interface for user CRUD
3. **Audit Logging** - Track user actions
4. **Email Verification** - Verify user emails
5. **Multi-factor Authentication** - Add extra security layer

## Support

For issues or questions:

- Check Firebase Console logs
- Review browser console for errors
- Consult ONBOARDING.md for detailed instructions

---

**Last Updated**: February 2026
**System**: PPMS v1.0
**Organization**: CSSPL
