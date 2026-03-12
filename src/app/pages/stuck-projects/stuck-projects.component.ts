import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-stuck-projects',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stuck-projects.component.html',
    styleUrls: ['./stuck-projects.component.css']
})
export class StuckProjectsComponent implements OnInit {
    stuckProjects: Project[] = [];

    constructor(
        private projectService: ProjectDataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.stuckProjects = this.projectService.getStuckProjects();
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/dhamnagar-dashboard/project', projectId]);
    }
}
