import { Component, OnInit, OnDestroy, inject, signal, computed, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreProjectService } from '../../services/firestore-project.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
    @Input() isOpen: boolean = false;
    @Output() closeSidebar = new EventEmitter<void>();

    stuckCount = signal(0);
    isLoggingOut = signal(false);

    private authService = inject(AuthService);
    private firestoreService = inject(FirestoreProjectService);
    private destroy$ = new Subject<void>();

    currentUser = computed(() => this.authService.currentUser());

    ngOnInit(): void {
        this.firestoreService.getStuckProjects$()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: stuck => this.stuckCount.set(stuck.length),
                error: err => console.warn('Stuck projects stream error:', err)
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
