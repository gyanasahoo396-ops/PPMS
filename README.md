# Dhamnagar Constituency Project Monitoring System

A comprehensive Angular-based project monitoring dashboard for tracking departmental projects in Dhamnagar constituency.

## Features

### **Dashboard View**
- KPI cards showing Total Projects, Funds Utilized, Average Completion, and Stuck Projects
- Department-wise Expenditure Chart (Bar Chart using Chart.js)
- Physical Progress Status Distribution (Doughnut Chart)
- HM Committed Projects Ticker

### **Department-Wise View**
- Filter projects by department
- Search functionality
- Comprehensive project table

### **HM Priorities & Stuck Projects**
- Gallery view of high-visibility projects
- Alert cards for stuck/stalled projects

### **Project Detail Modal**
- Comprehensive project information
- **Before/After Field Inspection Photos** section
- Financial breakdown and timeline

## Technology Stack

- **Framework**: Angular 21+ (Standalone Components)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Font Awesome Free
- **Backend**: Firebase (Authentication & Firestore)

## Installation

```bash
npm install
npm start
```

Navigate to `http://localhost:4200`

## Project Structure

```
src/app/
├── components/  (sidebar, header)
├── guards/      (auth, role guards)
├── layouts/     (main layout)
├── pages/       (dashboard, departments, priorities, stuck-projects, project-detail, login)
├── services/    (auth, user, project-data)
└── models/      (user, project)
```

## Documentation

- **[Authentication Guide](docs/AUTHENTICATION.md)** - Complete authentication & authorization documentation
- **[Onboarding Guide](ONBOARDING.md)** - User creation and onboarding instructions
- **[Deployment Guide](DEPLOYMENT.md)** - Firebase deployment instructions

## Authentication & User Management

This system includes role-based access control with four user roles:
- **Minister** - Highest access level
- **Admin** - System administration
- **Manager** - Project management
- **Viewer** - Read-only access

For detailed authentication setup and user management, see [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md).

---

Developed for Hon'ble Minister, Dhamnagar Constituency
