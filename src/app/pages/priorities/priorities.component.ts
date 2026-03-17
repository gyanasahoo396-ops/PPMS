import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';

@Component({
    selector: 'app-priorities',
    standalone: true,
    imports: [CommonModule, MobilePageHeaderComponent],
    templateUrl: './priorities.component.html',
    styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {
    priorityProjects: Project[] = [];

    constructor(
        private projectService: ProjectDataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.priorityProjects = this.projectService.getPriorityProjects();
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/dhamnagar-dashboard/project', projectId]);
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }
}
