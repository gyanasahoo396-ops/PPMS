import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
    departments: string[] = [];
    projects: Project[] = [];
    filteredProjects: Project[] = [];
    selectedDept: string = 'All';
    searchQuery: string = '';

    constructor(
        private projectService: ProjectDataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.departments = this.projectService.getDepartments();
        this.projects = this.projectService.getAllProjects();
        this.filteredProjects = this.projects;
    }

    filterProjects(dept: string): void {
        this.selectedDept = dept;
        this.applyFilters();
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredProjects = this.projectService.searchProjects(
            this.searchQuery,
            this.selectedDept
        );
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Stuck': return 'status-stuck';
            case 'Planned': return 'status-planned';
            default: return 'status-inprogress';
        }
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/project', projectId]);
    }
}
