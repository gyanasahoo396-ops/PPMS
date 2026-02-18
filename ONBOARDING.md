# User Onboarding Guide

This guide explains how to onboard new users to the D3 (Dhamnagar Development Dashboard) with role-based access control.

## Prerequisites

1. **Node.js** installed on your system
2. **Firebase Admin SDK Key** (service account credentials)

## Getting the Firebase Admin SDK Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ppms-b8d2b`
3. Navigate to **Project Settings** (gear icon) → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Save the downloaded file as `firebase-admin-key.json` in the project root directory

⚠️ **Important**: Never commit `firebase-admin-key.json` to version control. It contains sensitive credentials.

## User Roles

The system supports the following roles:

- **minister** - Highest level access (e.g., government ministers, executives)
- **admin** - Full administrative access
- **manager** - Department/project management access
- **viewer** - Read-only access

## Onboarding a New User

### Method 1: Using PowerShell Script (Recommended for Windows)

```powershell
.\onboard-user.ps1 -Email "minister@example.com" -Password "SecurePass123" -DisplayName "John Doe" -Role "minister" -Department "Finance"
```

**Parameters:**

- `-Email` (required): User's email address
- `-Password` (required): Initial password (min 6 characters)
- `-DisplayName` (required): User's full name
- `-Role` (required): User role (minister, admin, manager, viewer)
- `-Department` (optional): User's department

### Method 2: Using Node.js Script Directly

```bash
node onboard-user.mjs <email> <password> <displayName> <role> [department]
```

**Example:**

```bash
node onboard-user.mjs minister@example.com SecurePass123 "John Doe" minister "Finance"
```

## Example: Creating a Minister User

```powershell
.\onboard-user.ps1 `
  -Email "minister.finance@gov.in" `
  -Password "Minister@2024!" `
  -DisplayName "Hon. Finance Minister" `
  -Role "minister" `
  -Department "Finance Department"
```

This will:

1. ✅ Create the user in Firebase Authentication
2. ✅ Create a user profile in Firestore with role and department
3. ✅ Generate a password reset link (optional)
4. ✅ Display login credentials

## Example: Creating Other Roles

### Admin User

```powershell
.\onboard-user.ps1 `
  -Email "admin@ppms.gov.in" `
  -Password "Admin@2024!" `
  -DisplayName "System Administrator" `
  -Role "admin"
```

### Manager User

```powershell
.\onboard-user.ps1 `
  -Email "manager.projects@gov.in" `
  -Password "Mgr@2024!" `
  -DisplayName "Project Manager" `
  -Role "manager" `
  -Department "Infrastructure"
```

### Viewer User

```powershell
.\onboard-user.ps1 `
  -Email "viewer@ppms.gov.in" `
  -Password "View@2024!" `
  -DisplayName "Guest Viewer" `
  -Role "viewer"
```

## What Happens During Onboarding?

1. **Firebase Authentication**: A new user account is created
2. **Firestore Document**: User profile is stored with:
   - Email
   - Display name
   - Role
   - Department (if provided)
   - Creation timestamp
   - Active status (true by default)
3. **Password Reset Link**: (Optional) Generated for user to set their own password

## User Login

After onboarding, users can log in at:

- **Local Development**: `http://localhost:4201/login`
- **Production**: Your deployed app URL

## Troubleshooting

### Error: "firebase-admin-key.json not found"

**Solution**: Download the service account key from Firebase Console (see prerequisites)

### Error: "Email already exists"

**Solution**: This email is already registered. Use a different email or delete the existing user from Firebase Console.

### Error: "Invalid role"

**Solution**: Role must be one of: minister, admin, manager, viewer

### Error: "Password too short"

**Solution**: Password must be at least 6 characters long

## Security Best Practices

1. ✅ Use strong passwords (mix of uppercase, lowercase, numbers, special characters)
2. ✅ Change default passwords immediately after first login
3. ✅ Assign minimal required role (principle of least privilege)
4. ✅ Review user permissions regularly
5. ✅ Deactivate accounts for users who no longer need access

## Managing Users After Creation

### Via Firebase Console

1. Go to Firebase Console → Authentication
2. Find the user and manage their account
3. Can disable, delete, or reset password

### Via Code (Future Enhancement)

A user management UI will be added to allow admins to:

- View all users
- Edit user roles
- Activate/deactivate users
- Reset passwords

## Need Help?

Contact the system administrator or check the main project README for more information.

---

**Last Updated**: {{ current_date }}
**System**: D3 (Dhamnagar Development Dashboard)
**Organization**: CSSPL
