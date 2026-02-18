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
- **Hosting**: Firebase Hosting (Multi-Environment Setup)
- **CI/CD**: GitHub Actions
- **Backend**: Firebase (Authentication & Firestore)

## Installation

```bash
npm install
npm start
```

Navigate to `http://localhost:4200`

## Deployment

This project uses a multi-environment Firebase hosting setup with automated CI/CD:

- **Development**: Auto-deploys to `ppms-dev-9361e` when pushing to `develop` branch
- **Production**: Auto-deploys to `ppms-b8d2b` when pushing to `main` branch

### Quick Deployment Commands

```bash
npm run build:dev        # Build for development
npm run build:prod       # Build for production
npm run deploy:dev       # Deploy to development
npm run deploy:prod      # Deploy to production
```

### Setup Instructions

For initial setup of CI/CD pipeline, see:
- 📋 **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Quick start checklist
- 🚀 **[FIREBASE_ENVIRONMENTS_README.md](FIREBASE_ENVIRONMENTS_README.md)** - Overview
- 📖 **[CI_CD_SETUP.md](CI_CD_SETUP.md)** - Detailed setup guide
- 📚 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment reference

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
