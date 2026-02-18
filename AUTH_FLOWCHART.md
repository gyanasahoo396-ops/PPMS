# Authentication Flow Diagram

## Login Flow

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

## Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      Authentication Data Flow                  │
└────────────────────────────────────────────────────────────────┘

  Firebase Auth                 AuthService               Component
  (Backend)                     (Service)                 (UI)
      │                             │                         │
      │                             │   ◄─── User Login  ─────┤
      │                             │        Request          │
      │                             │                         │
      │   ◄─── signInWithEmail ────┤                         │
      │        AndPassword()        │                         │
      │                             │                         │
      ├─── UserCredential ─────────►│                         │
      │                             │                         │
      │                             ├─── Fetch User ─────┐    │
      │                             │    Profile         │    │
      │                             │                    │    │
  Firestore                         │                    │    │
      │                             │                    │    │
      │   ◄─── getDoc(users/uid) ───┘                    │    │
      │                                                  │    │
      ├─── User Document ──────────────────────────────►│    │
      │    {                                            │    │
      │      email: "..."                               │    │
      │      role: "minister"                           │    │
      │      displayName: "..."                         │    │
      │    }                                            │    │
      │                                                  │    │
      │                             ├─── Update ────────┘    │
      │                             │    currentUser()       │
      │                             │    Signal              │
      │                             │                        │
      │                             ├─── Success ───────────►│
      │                             │    Navigate            │
      │                             │    to Dashboard        │
```

## Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Component Hierarchy                         │
└────────────────────────────────────────────────────────────────┘

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

## Service Dependencies

```
┌────────────────────────────────────────────────────────────────┐
│                      Service Layer                             │
└────────────────────────────────────────────────────────────────┘

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

## Firestore Data Model

```
┌────────────────────────────────────────────────────────────────┐
│                    Firestore Structure                         │
└────────────────────────────────────────────────────────────────┘

    firestore
        └── users (collection)
             ├── {uid-1} (document)
             │    ├── email: string
             │    ├── displayName: string
             │    ├── phoneNumber: string | null
             │    ├── role: "minister" | "admin" | "manager" | "viewer"
             │    ├── department: string | null
             │    ├── createdAt: Timestamp
             │    ├── lastLogin: Timestamp | null
             │    └── isActive: boolean
             │
             ├── {uid-2} (document)
             │    └── ...
             │
             └── {uid-n} (document)
                  └── ...
```

## User Onboarding Flow

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

## Role-Based Access Control

```
┌────────────────────────────────────────────────────────────────┐
│                  Route Protection Model                        │
└────────────────────────────────────────────────────────────────┘

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

---

**Legend:**

- `┌─┐` : Process/Component
- `│` : Flow direction
- `◄──` : Data input
- `──►` : Data output
- `▼` : Continues to next step
