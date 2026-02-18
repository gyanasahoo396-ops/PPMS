import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    private authService = inject(AuthService);
    
    currentDate: string = '';
    pageTitle: string = 'Dashboard Overview';
    
    // Get current user from auth service
    currentUser = computed(() => this.authService.currentUser());

    ngOnInit(): void {
        this.updateDate();
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

    toggleSidebar(): void {
        // Emit event to parent or use a service for sidebar toggle
    }
    
    async logout(): Promise<void> {
        try {
            await this.authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}
