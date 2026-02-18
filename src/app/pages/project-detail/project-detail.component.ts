import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
    project: Project | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectDataService
    ) { }

    ngOnInit(): void {
        const projectId = this.route.snapshot.paramMap.get('id');
        if (projectId) {
            this.project = this.projectService.getProjectById(projectId);
        }
    }

    close(): void {
        this.router.navigate(['/dashboard']);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Stuck': return 'bg-red-100 text-red-800';
            case 'Planned': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    }
}
