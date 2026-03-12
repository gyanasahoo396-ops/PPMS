import { Component, OnInit, inject, computed, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() toggleSidebar = new EventEmitter<void>();

    private authService = inject(AuthService);

    currentDate: string = '';
    pageTitle: string = 'Dashboard Overview';
    isLoggingOut = signal(false);
    showLogoutConfirm = signal(false);

    // Get current user from auth service
    currentUser = computed(() => this.authService.currentUser());
    isAuthenticated = computed(() => this.authService.isAuthenticated());

    ngOnInit(): void {
        this.updateDate();

        // Debug: Log auth state changes
        this.authService.authState$.subscribe(user => {
            console.log('Header: Auth state changed, user:', user?.email);
        });
    }

    updateDate(): void {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        this.currentDate = now.toLocaleDateString('en-IN', options);
    }

    onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    confirmLogout(): void {
        this.showLogoutConfirm.set(true);
    }

    cancelLogout(): void {
        this.showLogoutConfirm.set(false);
    }

    async logout(): Promise<void> {
        this.isLoggingOut.set(true);
        this.showLogoutConfirm.set(false);

        try {
            console.log('Header: Initiating logout...');
            await this.authService.logout();
            console.log('Header: Logout successful!');
        } catch (error) {
            console.error('Logout error:', error);
            this.isLoggingOut.set(false);
            // Still attempt navigation in case of error
            window.location.href = '/login';
        }
    }
}
