import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    private router = inject(Router);
    private authService = inject(AuthService);

    currentUser = this.authService.currentUser;
    isAuthenticated = this.authService.isAuthenticated;

    navigateToDashboard(): void {
        this.router.navigate(['/dhamnagar-dashboard']);
    }

    navigateToFieldExecution(): void {
        this.router.navigate(['/field-execution']);
    }

    async logout(): Promise<void> {
        await this.authService.logout();
    }
}
