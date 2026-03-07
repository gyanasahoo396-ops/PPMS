import { Component, OnInit, inject, signal, computed, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    @Input() isOpen: boolean = false;
    @Output() closeSidebar = new EventEmitter<void>();

    stuckCount: number = 0;
    isLoggingOut = signal(false);

    private projectService = inject(ProjectDataService);
    private authService = inject(AuthService);

    currentUser = computed(() => this.authService.currentUser());

    ngOnInit(): void {
        this.stuckCount = this.projectService.getStuckProjects().length;
    }

    onLinkClick(): void {
        this.closeSidebar.emit();
    }

    async logout(): Promise<void> {
        this.isLoggingOut.set(true);

        try {
            console.log('Sidebar: Initiating logout...');
            await this.authService.logout();
            console.log('Sidebar: Logout successful!');
        } catch (error) {
            console.error('Logout error:', error);
            this.isLoggingOut.set(false);
            window.location.href = '/login';
        }
    }
}
