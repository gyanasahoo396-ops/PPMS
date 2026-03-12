import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { PrioritiesComponent } from './pages/priorities/priorities.component';
import { StuckProjectsComponent } from './pages/stuck-projects/stuck-projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { InterventionProjectsComponent } from './pages/intervention-projects/intervention-projects.component';
import { HomeComponent } from './pages/home/home.component';
import { FieldExecutionComponent } from './pages/field-execution/field-execution.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'field-execution', component: FieldExecutionComponent },
            {
                path: 'dhamnagar-dashboard',
                component: MainLayoutComponent,
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'departments', component: DepartmentsComponent },
                    { path: 'priorities', component: PrioritiesComponent },
                    { path: 'stuck', component: StuckProjectsComponent },
                    { path: 'intervention', component: InterventionProjectsComponent },
                    { path: 'project/:id', component: ProjectDetailComponent }
                ]
            }
        ]
    },
    { path: '**', redirectTo: '/login' }
];
