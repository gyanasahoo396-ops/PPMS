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

- **Framework**: Angular 19+ (Standalone Components)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Font Awesome Free

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
├── pages/       (dashboard, departments, priorities, stuck-projects, project-detail)
├── services/    (project-data.service)
└── models/      (project.model)
```

Developed for Hon'ble Minister, Dhamnagar Constituency
