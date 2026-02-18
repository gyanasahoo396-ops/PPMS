# 🚀 PPMS Authentication - Quick Reference Card

## 📋 Quick Commands

### Create Minister User

```powershell
.\create-sample-minister.ps1
```

### Create Custom User

```powershell
.\onboard-user.ps1 -Email "email@domain.com" -Password "Pass123!" -DisplayName "User Name" -Role "minister|admin|manager|viewer" [-Department "Dept Name"]
```

### Start Dev Server (if not running)

```powershell
npm run start
# Or
npx ng serve --port 4201
```

### Access Login Page

```
http://localhost:4201/login
```

## 🔑 Default Test Credentials

After running `create-sample-minister.ps1`:

- **Email**: `minister@ppms.gov.in`
- **Password**: `Minister@2024!`
- **Role**: Minister
- **Department**: Chief Minister's Office

## 📁 Important Files

| File                         | Purpose                         |
| ---------------------------- | ------------------------------- |
| `onboard-user.ps1`           | PowerShell onboarding script    |
| `onboard-user.mjs`           | Node.js onboarding script       |
| `create-sample-minister.ps1` | Quick test user creation        |
| `firebase-admin-key.json`    | Firebase credentials (REQUIRED) |
| `AUTH_GUIDE.md`              | Developer guide                 |
| `ONBOARDING.md`              | User onboarding guide           |
| `AUTH_IMPLEMENTATION.md`     | Implementation details          |
| `AUTH_FLOWCHART.md`          | System diagrams                 |

## 🎯 User Roles

| Role     | Badge Color | Access Level       |
| -------- | ----------- | ------------------ |
| Minister | 🟣 Purple   | Full system access |
| Admin    | 🔵 Blue     | Administration     |
| Manager  | 🟢 Green    | Project management |
| Viewer   | ⚪ Gray     | Read-only          |

## 🔐 Firebase Setup (One-Time)

1. Go to: https://console.firebase.google.com/
2. Select project: `ppms-b8d2b`
3. Project Settings → Service Accounts
4. Generate New Private Key
5. Save as: `firebase-admin-key.json`
6. Place in: Project root directory

## 🛠️ Common Tasks

### View All Users

- Firebase Console → Authentication → Users

### Reset User Password

- Firebase Console → Authentication → Find User → Reset Password

### Change User Role

- Firebase Console → Firestore → users → {uid} → Edit `role` field

### Deactivate User

- Firebase Console → Firestore → users → {uid} → Set `isActive: false`

## 🐛 Troubleshooting

| Issue              | Solution                                   |
| ------------------ | ------------------------------------------ |
| Login fails        | Check Firebase config in `environment.ts`  |
| User not found     | Verify user exists in Firebase Auth        |
| Script fails       | Ensure `firebase-admin-key.json` exists    |
| Can't access route | Check user role matches route requirements |
| Build errors       | Run `npm install` to install dependencies  |

## 📞 Get Help

1. Check `AUTH_GUIDE.md` for detailed documentation
2. Review `ONBOARDING.md` for setup issues
3. Check browser console for errors
4. Verify Firebase Console for auth logs

## 🔄 Development Workflow

```
┌─────────────────────────────────────┐
│ 1. Get Firebase Admin Key           │
│ 2. Run: .\create-sample-minister.ps1│
│ 3. Navigate to: /login              │
│ 4. Enter credentials                │
│ 5. Start developing! 🎉             │
└─────────────────────────────────────┘
```

## 🎨 UI Components with Auth

### In TypeScript

```typescript
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

currentUser = inject(AuthService).currentUser;
```

### In Template

```html
@if (currentUser()) {
<p>{{ currentUser()!.displayName }}</p>
<p>{{ currentUser()!.role }}</p>
}
```

## 🔒 Protected Routes

### Add Auth Guard

```typescript
{
  path: 'route',
  component: MyComponent,
  canActivate: [authGuard]
}
```

### Add Role Guard

```typescript
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

{
  path: 'admin',
  component: AdminComponent,
  canActivate: [roleGuard([UserRole.ADMIN, UserRole.MINISTER])]
}
```

## 📦 Dependencies

- `@angular/fire` - Firebase for Angular
- `firebase` - Firebase SDK
- `firebase-admin` - Admin SDK (for scripts)

Install with:

```powershell
npm install @angular/fire firebase --legacy-peer-deps
npm install firebase-admin --save-dev --legacy-peer-deps
```

## ✅ Checklist Before Deployment

- [ ] Firebase Admin SDK key is NOT in git
- [ ] Environment files have correct Firebase config
- [ ] Default passwords changed
- [ ] Firestore security rules configured
- [ ] All users have appropriate roles
- [ ] Login page accessible
- [ ] Protected routes working
- [ ] Logout functionality working

## 🎯 Quick Test Flow

1. ✅ Create minister user
2. ✅ Navigate to `/login`
3. ✅ Login with credentials
4. ✅ Verify redirect to dashboard
5. ✅ Check header shows user info
6. ✅ Test logout button
7. ✅ Verify redirect to login

---

**Version**: 1.0  
**Last Updated**: Feb 17, 2026  
**Organization**: CSSPL  
**Project**: PPMS

💡 **Pro Tip**: Bookmark this file for quick reference during development!
