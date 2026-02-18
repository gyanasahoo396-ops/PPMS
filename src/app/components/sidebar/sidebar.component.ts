import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    stuckCount: number = 0;
    isOpen: boolean = false;

    constructor(private projectService: ProjectDataService) { }

    ngOnInit(): void {
        this.stuckCount = this.projectService.getStuckProjects().length;
    }

    toggleSidebar(): void {
        this.isOpen = !this.isOpen;
    }
}
