import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { PrioritiesComponent } from './pages/priorities/priorities.component';
import { StuckProjectsComponent } from './pages/stuck-projects/stuck-projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'departments', component: DepartmentsComponent },
            { path: 'priorities', component: PrioritiesComponent },
            { path: 'stuck', component: StuckProjectsComponent },
            { path: 'project/:id', component: ProjectDetailComponent }
        ]
    },
    { path: '**', redirectTo: '/login' }
];
